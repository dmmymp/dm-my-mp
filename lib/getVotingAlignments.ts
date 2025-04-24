
import fetch from "node-fetch";

type EngagementMetric = {
  value: string | number;
  color: "green" | "amber" | "red";
  tooltip: string;
  link?: string;
};
type VotingTopic = {
  description: string;
  votesFor: number;
  votesAgainst: number;
  absences: number;
  period: string;
  statement: string;
  link: string;
};
type ElectionDonations = {
  cash: number;
  inKind: number;
  summary: string;
};
type FinancialSupport = {
  totalDonations: number;
  totalGiftsAndBenefits: number;
  totalSupport: number;
  comparisonToAverage: string;
  donationType: string;
};

// Interfaces for TypeScript
interface DreamMp {
  id: string;
  description: string;
}

interface Debate {
  body: string;
  major: string;
  htype: string;
  section: string;
  hdate: string;
}

interface FinancialCategory {
  category_id: string;
  summaries: {
    comparable_id: string;
    details: { slug: string; value: string }[];
  }[];
}

interface EnrichedFinancialData {
  categories: FinancialCategory[];
}

interface MpData {
  full_name: string;
  party: string;
  person_id: string;
  member_id: string;
  office: { position: string; dept?: string }[];
}

interface MpInfo {
  maiden_speech?: string;
  by_member_id?: {
    [key: string]: {
      public_whip_division_attendance?: string;
      public_whip_rebellions?: string;
    };
  };
  person_regmem_enriched2024_en?: string | EnrichedFinancialData;
  [key: `public_whip_dreammp${string}_both_voted`]: string | undefined;
  [key: `public_whip_dreammp${string}_distance`]: string | undefined;
  [key: `public_whip_dreammp${string}_abstentions`]: string | undefined;
}

// Core hardcoded dreamMpMappings (critical policies, validated)
const dreamMpMappings: { id: string; description: string; category: string; direction: "left" | "right" }[] = [
  { id: "20006", description: "more restrictive immigration policies", category: "Immigration", direction: "right" },
  { id: "1042", description: "more restrictive immigration policies", category: "Immigration", direction: "right" },
  { id: "6789", description: "stricter border controls", category: "Immigration", direction: "right" },
  { id: "20007", description: "increased mental health funding", category: "Health & NHS", direction: "left" },
  { id: "6679", description: "increased NHS funding", category: "Health & NHS", direction: "left" },
  { id: "837", description: "increased public safety measures", category: "Crime & Policing", direction: "right" },
  { id: "6732", description: "a more regulated economy", category: "Economy & Taxation", direction: "left" },
  { id: "20008", description: "increased social care funding", category: "Welfare & Cost of Living", direction: "left" },
  { id: "1030", description: "more environmental regulations", category: "Environment & Climate", direction: "left" },
  { id: "6680", description: "increased public funding for education", category: "Education", direction: "left" },
  { id: "982", description: "more social housing", category: "Housing", direction: "left" },
  { id: "984", description: "increased public transport funding", category: "Transport", direction: "left" },
  { id: "1040", description: "increased welfare spending for cost of living", category: "Welfare & Cost of Living", direction: "left" },
  { id: "1041", description: "tougher policing measures", category: "Crime & Policing", direction: "right" },
  { id: "1043", description: "increased social care funding", category: "Welfare & Cost of Living", direction: "left" },
  { id: "1074", description: "more EU integration", category: "Foreign Policy & EU", direction: "left" },
  { id: "6761", description: "increased defense spending", category: "Foreign Policy & EU", direction: "right" },
  { id: "1100", description: "increased renewable energy investment", category: "Environment & Climate", direction: "left" },
  { id: "1142", description: "increased minimum wage", category: "Economy & Taxation", direction: "left" },
  { id: "1150", description: "increased affordable housing targets", category: "Housing", direction: "left" },
];

// Hardcoded average total support per MP
const AVERAGE_TOTAL_SUPPORT_PER_MP = 30000; // £30,000

// Fetch all dreammp IDs from TheyWorkForYou
async function fetchDreamMpIds(): Promise<DreamMp[]> {
  try {
    const apiKey = process.env.TWFY_API_KEY;
    if (!apiKey) throw new Error("TWFY_API_KEY is not set");
    const response = await fetch(`https://www.theyworkforyou.com/api/getDreamMPs?key=${apiKey}&output=js`);
    if (!response.ok) throw new Error(`Failed to fetch dreammp IDs: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching dreammp IDs:", error);
    return [];
  }
}

// Validate mappings against TheyWorkForYou data
async function validateMappings(fetchedData: DreamMp[]): Promise<void> {
  if (!Array.isArray(fetchedData)) {
    console.warn("validateMappings: fetchedData is not an array, skipping validation");
    return;
  }
  fetchedData.forEach(entry => {
    const mapping = dreamMpMappings.find(m => m.id === entry.id);
    if (!mapping) {
      console.warn(`New dreammp ID ${entry.id}: ${entry.description}`);
    } else if (mapping.description !== entry.description) {
      console.warn(`Description mismatch for ID ${entry.id}: ${mapping.description} vs ${entry.description}`);
    }
  });
}

// Filter valid debates (includes major 1, 2, 3)
const filterValidDebates = (debates: Debate[]): Debate[] =>
  debates.filter(debate => {
    const body = debate.body?.replace(/<[^>]+>/g, "") || "";
    return (
      (debate.major === "1" || debate.major === "2" || debate.major === "3") &&
      (debate.htype === "12" || debate.section === "Debates") &&
      body.length > 10
    );
  });

// Count constituency mentions
const getConstituencyMentions = (debates: Debate[], constituency: string): number => {
  const regex = new RegExp(`\\b${constituency}\\b|\\b${constituency}-on-Sea\\b`, "i");
  return debates.reduce((count, debate) => {
    const body = debate.body?.replace(/<[^>]+>/g, "") || "";
    return count + (regex.test(body) ? 1 : 0);
  }, 0);
};

// Parse financial support
const parseFinancialSupport = (enrichedData: EnrichedFinancialData | string | undefined): FinancialSupport => {
  let totalDonations = 0;
  let totalGiftsAndBenefits = 0;
  let donationType = "non-campaign";

  if (enrichedData) {
    const data: EnrichedFinancialData = typeof enrichedData === "string" ? JSON.parse(enrichedData) : enrichedData;
    for (const category of data.categories || []) {
      if (category.category_id === "2") {
        const summaries = category.summaries || [];
        for (const summary of summaries) {
          if (summary.comparable_id === "enriched_info") {
            const details = summary.details || [];
            totalDonations = parseFloat(details.find((d) => d.slug === "all_income")?.value || "0");
            donationType = "campaign";
          }
        }
      } else if (category.category_id === "3") {
        const summaries = category.summaries || [];
        for (const summary of summaries) {
          if (summary.comparable_id === "enriched_info") {
            const details = summary.details || [];
            totalGiftsAndBenefits = parseFloat(details.find((d) => d.slug === "all_income")?.value || "0");
          }
        }
      }
    }
  }

  const totalSupport = totalDonations + totalGiftsAndBenefits;
  const comparisonToAverage = totalSupport > AVERAGE_TOTAL_SUPPORT_PER_MP
    ? `above the average of £${AVERAGE_TOTAL_SUPPORT_PER_MP.toLocaleString()} per MP`
    : totalSupport < AVERAGE_TOTAL_SUPPORT_PER_MP
    ? `below the average of £${AVERAGE_TOTAL_SUPPORT_PER_MP.toLocaleString()} per MP`
    : `equal to the average of £${AVERAGE_TOTAL_SUPPORT_PER_MP.toLocaleString()} per MP`;

  return { totalSupport, totalDonations, totalGiftsAndBenefits, comparisonToAverage, donationType };
};

export async function getVotingAlignments(name: string, constituency: string): Promise<{
  profileSummary: {
    fullName: string;
    party: string;
    constituency: string;
    yearsInOffice: number;
    votingAttendance: EngagementMetric;
    speechActivity: EngagementMetric;
    rebellions: EngagementMetric;
    topicClarity: EngagementMetric;
    localReferences: EngagementMetric;
  };
  topVotingTopics: VotingTopic[];
  parliamentaryActivity: {
    speechCount: number;
    topTopics: string[];
    constituencyMentions: number;
    link: string;
  };
  committeesAndRoles: {
    roles: string;
    committees: string;
    focus: string;
  };
  overallSummary: {
    summary: string;
    scorecard: { area: string; status: "green" | "amber" | "red" }[];
  };
  financialSupport: FinancialSupport;
  startYear: number;
  electionDonations: ElectionDonations;
}> {
  try {
    console.log("getVotingAlignments called with:", { name, constituency });

    const apiKey = process.env.TWFY_API_KEY;
    if (!apiKey) throw new Error("TWFY_API_KEY is not set in environment variables.");

    // Fetch MP data
    let mpData: MpData;
    try {
      const response = await fetch(
        `https://www.theyworkforyou.com/api/getMP?key=${apiKey}&name=${encodeURIComponent(name)}&constituency=${encodeURIComponent(constituency)}&output=js`
      );
      if (!response.ok) throw new Error(`Failed to fetch MP data: ${response.status}`);
      const rawData = await response.json();
      mpData = Array.isArray(rawData) ? rawData[0] : rawData;
      console.log("TheyWorkForYou getMP Response:", mpData);
    } catch (error) {
      console.error("Error fetching MP data:", error);
      throw error;
    }

    const personId = mpData.person_id;
    const memberId = mpData.member_id;
    if (!personId || !memberId) throw new Error("Could not find person_id or member_id for the MP");

    // Fetch MP info
    let mpInfo: MpInfo;
    try {
      const response = await fetch(
        `https://www.theyworkforyou.com/api/getMPInfo?key=${apiKey}&id=${personId}&output=js`
      );
      if (!response.ok) throw new Error(`Failed to fetch MP info: ${response.status}`);
      const data = await response.json() as MpInfo;
      if (!data || typeof data !== "object" || !("by_member_id" in data)) {
        throw new Error("Invalid MP info response: Missing required fields");
      }
      mpInfo = data;
      console.log("TheyWorkForYou getMPInfo Response:", mpInfo);
    } catch (error) {
      console.error("Error fetching MP info:", error);
      throw error;
    }

    // Fetch dreammp IDs
    const fetchedDreamMps = await fetchDreamMpIds();
    await validateMappings(fetchedDreamMps);
    const mappings = [
      ...dreamMpMappings,
      ...fetchedDreamMps
        .filter(f => !dreamMpMappings.some(m => m.id === f.id))
        .map(f => ({
          id: f.id,
          description: f.description,
          category: "Unknown",
          direction: "left", // Default, to be reviewed
        })),
    ];

    // Profile Summary
    const fullName = mpData.full_name || name;
    const party = mpData.party || "Unknown";
    const startYear = mpInfo.maiden_speech
      ? parseInt(mpInfo.maiden_speech.match(/(\d{4}-\d{2}-\d{2})/)?.[1]?.split("-")[0] || new Date().getFullYear().toString(), 10)
      : new Date().getFullYear();
    const yearsInOffice = new Date().getFullYear() - startYear;

    // Voting Attendance
    const memberData = mpInfo.by_member_id?.[memberId] || {};
    const votingAttendancePercentage = parseFloat(memberData.public_whip_division_attendance?.replace("%", "") || "0");
    const votingAttendance: EngagementMetric = {
      value: votingAttendancePercentage,
      color: votingAttendancePercentage > 90 ? "green" : votingAttendancePercentage >= 70 ? "amber" : "red",
      tooltip: "Voting Attendance reflects how often the MP participates in votes. Green: >90%, Amber: 70–90%, Red: <70%.",
      link: `https://www.theyworkforyou.com/mp/${encodeURIComponent(name.toLowerCase().replace(/\s/g, "_"))}/${encodeURIComponent(constituency.toLowerCase().replace(/\s/g, "_"))}#votingrecord`,
    };

    // Speech Activity
    let debates: Debate[] = [];
    try {
      let allDebates: Debate[] = [];
      let page = 1;
      const perPage = 500;
      while (true) {
        const response = await fetch(
          `https://www.theyworkforyou.com/api/getHansard?key=${apiKey}&person=${personId}&order=d&num=${perPage}&page=${page}&output=js`
        );
        if (!response.ok) break;
        const data = await response.json() as { rows?: Debate[] };
        const rows = Array.isArray(data.rows) ? data.rows : [];
        allDebates = allDebates.concat(rows);
        if (rows.length < perPage) break;
        page++;
      }
      debates = filterValidDebates(allDebates);
    } catch (error) {
      console.error("Error fetching Hansard data:", error);
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const speechCount = debates.filter(debate => {
      if (!debate.hdate || typeof debate.hdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(debate.hdate)) {
        return false;
      }
      return new Date(debate.hdate) >= oneYearAgo;
    }).length;
    const speechActivity: EngagementMetric = {
      value: speechCount,
      color: speechCount > 20 ? "green" : speechCount >= 5 ? "amber" : "red",
      tooltip: "Speech Activity measures spoken contributions in Commons debates over the past year. Green: >20 speeches, Amber: 5–20, Red: <5.",
      link: `https://www.theyworkforyou.com/debates/?person=${personId}`,
    };

    // Rebellions
    const rebellionPercentage = parseFloat(memberData.public_whip_rebellions?.replace("%", "") || "0");
    const rebellions: EngagementMetric = {
      value: Math.round(rebellionPercentage),
      color: rebellionPercentage >= 5 && rebellionPercentage <= 15 ? "green" : rebellionPercentage > 0 ? "amber" : "red",
      tooltip: "Rebellions show votes against party line. Green: 5–15%, Amber: 0–5% or >15%, Red: 0.",
    };

    // Top Voting Topics
    const votingTopics: VotingTopic[] = mappings.map(mapping => {
      const bothVotedKey = `public_whip_dreammp${mapping.id}_both_voted` as const;
      const distanceKey = `public_whip_dreammp${mapping.id}_distance` as const;
      const abstentionsKey = `public_whip_dreammp${mapping.id}_abstentions` as const;

      const bothVoted = parseInt(mpInfo[bothVotedKey] || "0", 10);
      const distance = parseFloat(mpInfo[distanceKey] || "1");
      const absences = parseInt(mpInfo[abstentionsKey] || "0", 10);
      const votesFor = Math.round(bothVoted * (mapping.direction === "left" ? 1 - distance : distance));
      const votesAgainst = Math.round(bothVoted * (mapping.direction === "left" ? distance : 1 - distance));
      return {
        description: mapping.description,
        votesFor,
        votesAgainst,
        absences,
        period: `between ${startYear}–2025`,
        statement: `Generally voted ${votesFor > votesAgainst ? "for" : "against"} ${mapping.description} (${votesFor} votes for, ${votesAgainst} votes against, ${absences} absences, between ${startYear}–2025)`,
        link: `https://www.theyworkforyou.com/mp/${encodeURIComponent(name.toLowerCase().replace(/\s/g, "_"))}/${encodeURIComponent(constituency.toLowerCase().replace(/\s/g, "_"))}/votes#${mapping.category.toLowerCase().replace(/\s/g, "_")}`,
      };
    }).filter(topic => topic.votesFor + topic.votesAgainst > 0);

    const topVotingTopics = votingTopics
      .sort((a, b) => (b.votesFor + b.votesAgainst) - (a.votesFor + a.votesAgainst))
      .slice(0, 10);

    // Topic Clarity
    const totalTopicsWithVotes = topVotingTopics.length;
    const consistentTopics = topVotingTopics.filter(
      topic => {
        const totalVotes = topic.votesFor + topic.votesAgainst;
        if (totalVotes === 0) return false; // Safety check to avoid division by zero
        const voteRatio = topic.votesFor / totalVotes;
        return voteRatio > 0.75 || voteRatio < 0.25;
      }
    ).length;
    const topicClarityValue = totalTopicsWithVotes > 0 ? (consistentTopics / totalTopicsWithVotes) * 100 : 0;
    const topicClarity: EngagementMetric = {
      value: topicClarityValue > 75 ? "Consistent" : topicClarityValue >= 25 ? "Mixed" : "Unclear",
      color: topicClarityValue > 75 ? "green" : topicClarityValue >= 25 ? "amber" : "red",
      tooltip: "Topic Clarity measures consistency in voting on key issues. Green: >75% alignment, Amber: 25–75%, Red: <25% or no votes.",
      link: `https://www.theyworkforyou.com/mp/${encodeURIComponent(name.toLowerCase().replace(/\s/g, "_"))}/${encodeURIComponent(constituency.toLowerCase().replace(/\s/g, "_"))}#votingrecord`,
    };

    // Local References
    const constituencyMentions = getConstituencyMentions(debates, constituency);
    const localReferences: EngagementMetric = {
      value: constituencyMentions,
      color: constituencyMentions > 10 ? "green" : constituencyMentions >= 1 ? "amber" : "red",
      tooltip: "Local References measure mentions of the constituency in debates. Green: >10 mentions, Amber: 1–10, Red: 0.",
      link: `https://www.theyworkforyou.com/debates/?person=${personId}`,
    };

    const profileSummary = {
      fullName,
      party,
      constituency,
      yearsInOffice,
      votingAttendance,
      speechActivity,
      rebellions,
      topicClarity,
      localReferences,
    };

    // Parliamentary Activity
    const topTopicsMap: { [topic: string]: number } = {};
    debates.forEach(debate => {
      const lowerDesc = debate.body?.toLowerCase().replace(/<[^>]+>/g, "") || "";
      let topic = debate.section || "General";
      if (lowerDesc.includes("immigration") || lowerDesc.includes("border control") || lowerDesc.includes("asylum")) topic = "Immigration";
      else if (lowerDesc.includes("health") || lowerDesc.includes("nhs") || lowerDesc.includes("hospital")) topic = "Health & NHS";
      else if (lowerDesc.includes("education") || lowerDesc.includes("school") || lowerDesc.includes("university")) topic = "Education";
      else if (lowerDesc.includes("housing") || lowerDesc.includes("homeless") || lowerDesc.includes("rent")) topic = "Housing";
      else if (lowerDesc.includes("climate") || lowerDesc.includes("environment") || lowerDesc.includes("net zero")) topic = "Environment & Climate";
      else if (lowerDesc.includes("economy") || lowerDesc.includes("tax") || lowerDesc.includes("budget")) topic = "Economy & Taxation";
      else if (lowerDesc.includes("crime") || lowerDesc.includes("police") || lowerDesc.includes("justice")) topic = "Crime & Policing";
      else if (lowerDesc.includes("pension") || lowerDesc.includes("triple lock") || lowerDesc.includes("benefits")) topic = "Welfare & Cost of Living";
      else if (lowerDesc.includes("eu") || lowerDesc.includes("brexit") || lowerDesc.includes("european union")) topic = "Foreign Policy & EU";
      else if (lowerDesc.includes("transport") || lowerDesc.includes("rail") || lowerDesc.includes("road")) topic = "Transport";
      else if (lowerDesc.includes("defence") || lowerDesc.includes("military") || lowerDesc.includes("armed forces")) topic = "Defence";
      else if (lowerDesc.includes("energy") || lowerDesc.includes("renewable") || lowerDesc.includes("gas")) topic = "Energy";
      else if (lowerDesc.includes("technology") || lowerDesc.includes("digital") || lowerDesc.includes("ai")) topic = "Technology & Innovation";
      else if (lowerDesc.includes("social justice") || lowerDesc.includes("equality") || lowerDesc.includes("diversity")) topic = "Social Justice";
      else if (lowerDesc.includes("employment") || lowerDesc.includes("jobs") || lowerDesc.includes("unemployment")) topic = "Employment";
      else if (lowerDesc.includes("trade") || lowerDesc.includes("export") || lowerDesc.includes("import")) topic = "Trade";
      else if (lowerDesc.includes("agriculture") || lowerDesc.includes("farming") || lowerDesc.includes("rural")) topic = "Agriculture & Rural Affairs";
      else if (lowerDesc.includes("culture") || lowerDesc.includes("arts") || lowerDesc.includes("sport")) topic = "Culture & Sport";
      else if (lowerDesc.includes("local government") || lowerDesc.includes("council") || lowerDesc.includes("devolution")) topic = "Local Government";
      else if (lowerDesc.includes("terrorism") || lowerDesc.includes("security") || lowerDesc.includes("counter-terrorism")) topic = "National Security";
      topTopicsMap[topic] = (topTopicsMap[topic] || 0) + 1;
    });

    const topTopics = Object.entries(topTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => `${topic} (${count} mentions)`);

    const parliamentaryActivity = {
      speechCount,
      topTopics,
      constituencyMentions,
      link: `https://www.theyworkforyou.com/debates/?person=${personId}`,
    };

    // Committees and Roles
    const roles = mpData.office
      ?.filter((office: { position: string; dept?: string }) => {
        const position = office.position?.toLowerCase() || '';
        return (
          (position.includes('minister') ||
            position.includes('spokesperson') ||
            position.includes('shadow') ||
            position.includes('whip')) &&
          !position.includes('committee')
        );
      })
      .map((office: { position: string }) => office.position)
      .join(', ') || 'None';

    const committees = mpData.office
      ?.filter((office: { position: string; dept?: string }) => {
        const dept = office.dept?.toLowerCase() || '';
        const position = office.position?.toLowerCase() || '';
        return dept.includes('committee') || position.includes('committee');
      })
      .map((office: { position: string; dept?: string }) => office.dept || office.position)
      .join(', ') || 'None';

    const focus = (() => {
      const committeeLower = committees.toLowerCase();
      if (committeeLower.includes('environmental') || committeeLower.includes('environment')) return 'Environmental Policy';
      if (committeeLower.includes('education')) return 'Education Policy';
      if (committeeLower.includes('justice')) return 'Justice Policy';
      if (committeeLower.includes('health')) return 'Health Policy';
      if (committeeLower.includes('defense') || committeeLower.includes('defence')) return 'Defense Policy';
      if (committeeLower.includes('transport')) return 'Transport Policy';
      return 'General';
    })();

    const committeesAndRoles = { roles, committees, focus };

    // Overall Summary
    const greenCount = [votingAttendance, speechActivity, rebellions, topicClarity, localReferences].filter(metric => metric.color === "green").length;
    const engagementLevel = greenCount >= 3 ? "engaged" : greenCount >= 1 ? "moderately engaged" : "less engaged";
    const summary = `${fullName} appears ${engagementLevel} in representing ${constituency}. They have ${speechActivity.color === "green" ? "regular" : speechActivity.color === "amber" ? "occasional" : "minimal"} parliamentary activity and ${localReferences.color === "green" ? "strong" : localReferences.color === "amber" ? "some" : "no"} local focus. Their voting clarity is ${String(topicClarity.value).toLowerCase()}, and they show ${rebellions.color === "green" ? "balanced" : rebellions.color === "amber" ? "limited" : "no"} independence from their party.`;

    const scorecard = [
      { area: "Voting Attendance", status: votingAttendance.color },
      { area: "Speech Activity", status: speechActivity.color },
      { area: "Local Engagement", status: localReferences.color },
      { area: "Party Independence", status: rebellions.color },
      { area: "Topic Clarity", status: topicClarity.color },
    ];

    const overallSummary = { summary, scorecard };

    // Financial Support
    const financialSupport = parseFinancialSupport(mpInfo.person_regmem_enriched2024_en);

    // Election Donations
    let electionDonations: ElectionDonations = {
      cash: 0,
      inKind: 0,
      summary: "Election Donations: £0 cash, £0 in-kind (campaign-specific, excludes non-campaign gifts).",
    };
    if (mpInfo.person_regmem_enriched2024_en) {
      const enrichedData: EnrichedFinancialData = typeof mpInfo.person_regmem_enriched2024_en === "string" ? JSON.parse(mpInfo.person_regmem_enriched2024_en) : mpInfo.person_regmem_enriched2024_en;
      let cash = 0;
      let inKind = 0;
      const sourceSummary = financialSupport.donationType === "campaign" ? "campaign donations" : "no campaign donations";
      for (const category of enrichedData.categories || []) {
        if (category.category_id === "2") {
          const summaries = category.summaries || [];
          for (const summary of summaries) {
            if (summary.comparable_id === "enriched_info") {
              const details = summary.details || [];
              cash = parseFloat(details.find((d) => d.slug === "cash_sum")?.value || "0");
              inKind = parseFloat(details.find((d) => d.slug === "in_kind_sum")?.value || "0");
            }
          }
        }
      }
      electionDonations = {
        cash,
        inKind,
        summary: `Election Donations: £${cash.toLocaleString()} cash, £${inKind.toLocaleString()} in-kind (${sourceSummary}).`,
      };
    }

    return {
      profileSummary,
      topVotingTopics,
      parliamentaryActivity,
      committeesAndRoles,
      overallSummary,
      financialSupport,
      startYear,
      electionDonations,
    };
  } catch (error) {
    console.error("Error in getVotingAlignments:", error);
    throw error;
  }
}
