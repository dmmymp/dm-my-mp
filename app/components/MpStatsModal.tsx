import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type EngagementMetric = {
  value: string | number;
  color: "green" | "amber" | "red";
  tooltip: string;
  link?: string;
  average?: number;
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
  totalSupport: number;
  comparisonToAverage: string;
  donationType: string;
};

type NeighbourIssue = {
  issue: string;
  localConcern: number;
  nationalConcern: number;
};

type MpStatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mp: { name: string; constituency: string; party: string; email: string };
  stats: {
    profileSummary?: {
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
    topVotingTopics?: VotingTopic[];
    parliamentaryActivity?: {
      speechCount: number;
      topTopics: string[];
      constituencyMentions: number;
      link: string;
    };
    committeesAndRoles?: {
      roles: string;
      committees: string;
      focus: string;
    };
    overallSummary?: {
      summary: string;
      scorecard: { area: string; status: "green" | "amber" | "red" }[];
    };
    financialSupport?: FinancialSupport;
    startYear?: number;
    electionDonations?: ElectionDonations;
  } | null;
  startYear?: number;
  neighbourIssues?: NeighbourIssue[];
};

export default function MpStatsModal({ isOpen, onClose, mp, stats, startYear, neighbourIssues }: MpStatsModalProps) {
  console.log("MpStatsModal rendered, isOpen:", isOpen, "mp:", mp, "stats:", stats, "startYear:", startYear, "neighbourIssues:", neighbourIssues);

  const colorStyles = {
    green: { color: "#00cc00", label: "High" },
    amber: { color: "#ffaa00", label: "Moderate" },
    red: { color: "#cc0000", label: "Low" },
  };

  const theyWorkForYouBaseUrl = "https://www.theyworkforyou.com/mp/";
  const mpId = stats?.parliamentaryActivity?.link?.split("person=")[1] || "unknown";
  const mpProfileLink = `${theyWorkForYouBaseUrl}${mpId}`;
  const votingLink = `${theyWorkForYouBaseUrl}${encodeURIComponent(mp.name.toLowerCase().replace(/\s/g, "_"))}/${encodeURIComponent(mp.constituency.toLowerCase().replace(/\s/g, "_"))}/votes`;
  const financialInterestsLink = `${theyWorkForYouBaseUrl}${mpId}/#register`;

  const currentYear = 2025;
  const yearsInOffice = startYear ? currentYear - startYear : stats?.profileSummary?.yearsInOffice || 1;
  const isNewMp = yearsInOffice <= 1 && startYear && startYear >= 2024;
  const displayYearsInOffice = isNewMp ? "First Term (July 2024–Present)" : `${yearsInOffice} years (${startYear || currentYear - yearsInOffice}–${currentYear})`;

  const formatVotingStatement = (statement: string) => {
    const parts = statement.split(" voted ");
    if (parts.length !== 2) return statement;
    const [prefix, rest] = parts;
    const stanceMatch = rest.match(/^(for|against)\s(.+)/i);
    if (!stanceMatch) return statement;
    const [, stance, issue] = stanceMatch;
    return (
      <>
        {prefix} voted <strong>{stance}</strong> <strong>{issue}</strong>
      </>
    );
  };

  if (!stats || !stats.profileSummary) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent aria-describedby="mp-stats-description">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div id="mp-stats-description">
            <p>Loading MP data... If this persists, the data may be unavailable.</p>
          </div>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 w-full"
            aria-label="Close dialog"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    );
  }

  const engagementLevel = stats.overallSummary?.summary.match(/appears (\w+ \w+)/)?.[1] || "moderately engaged";
  const localEngagementColor = stats.profileSummary.localReferences.color;
  const localEngagementText = colorStyles[localEngagementColor].label;

  let alignmentText = "unknown";
  let alignmentColor = "amber";
  if (neighbourIssues?.length && stats.topVotingTopics) {
    const topLocalIssue = neighbourIssues[0].issue.toLowerCase();
    const relatedTopic = stats.topVotingTopics.find(topic => topic.description.toLowerCase().includes(topLocalIssue));
    alignmentText = relatedTopic && (relatedTopic.votesFor + relatedTopic.votesAgainst) > 0 ? "active" : "limited";
    alignmentColor = relatedTopic && (relatedTopic.votesFor + relatedTopic.votesAgainst) > 0 ? "green" : "red";
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby="mp-stats-description" className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`${mp.name}’s Representation Summary`}</DialogTitle>
        </DialogHeader>
        <div id="mp-stats-description" className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Profile Summary (July 2024–Present)</h3>
            <p>
              {stats.profileSummary.fullName} | {stats.profileSummary.party} | {stats.profileSummary.constituency}{' '}
              <a href={mpProfileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                [TheyWorkForYou Profile]
              </a>
            </p>
            <p>Years in Office: {displayYearsInOffice}</p>
            {isNewMp && (
              <p className="text-sm text-gray-600">New MP since July 2024, limited voting data.</p>
            )}
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                Voting Attendance: {stats.profileSummary.votingAttendance.value}%{' '}
                <span style={{ color: colorStyles[stats.profileSummary.votingAttendance.color].color }} title={stats.profileSummary.votingAttendance.tooltip}>
                  ({colorStyles[stats.profileSummary.votingAttendance.color].label})
                </span>{' '}
                (Avg: {stats.profileSummary.votingAttendance.average ?? 75}%)
              </li>
              <li>
                Parliamentary Contributions: {stats.profileSummary.speechActivity.value} contributions{' '}
                <span style={{ color: colorStyles[stats.profileSummary.speechActivity.color].color }} title={stats.profileSummary.speechActivity.tooltip}>
                  ({colorStyles[stats.profileSummary.speechActivity.color].label})
                </span>{' '}
                (Avg: {stats.profileSummary.speechActivity.average ?? 9})
              </li>
              <li>
                Rebellions: {stats.profileSummary.rebellions.value}%{' '}
                <span style={{ color: colorStyles[stats.profileSummary.rebellions.color].color }} title={stats.profileSummary.rebellions.tooltip}>
                  ({colorStyles[stats.profileSummary.rebellions.color].label})
                </span>{' '}
                (Avg: {stats.profileSummary.rebellions.average ?? 3}%)
              </li>
              <li>
                Topic Clarity: {stats.profileSummary.topicClarity.value}{' '}
                <span style={{ color: colorStyles[stats.profileSummary.topicClarity.color].color }} title={stats.profileSummary.topicClarity.tooltip}>
                  ({colorStyles[stats.profileSummary.topicClarity.color].label})
                </span>
              </li>
              <li>
                Local References: {stats.profileSummary.localReferences.value} mentions{' '}
                <span style={{ color: colorStyles[stats.profileSummary.localReferences.color].color }} title={stats.profileSummary.localReferences.tooltip}>
                  ({colorStyles[stats.profileSummary.localReferences.color].label})
                </span>{' '}
                (Avg: {stats.profileSummary.localReferences.average ?? 5})
              </li>
              <li>
                Financial Interests: £{(stats.financialSupport?.totalSupport ?? 0).toLocaleString()} ({stats.financialSupport?.comparisonToAverage ?? "N/A"}, {stats.financialSupport?.donationType ?? "unknown"}) {' '}
                <a href={financialInterestsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  [See interests]
                </a>
              </li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Representation Overview</h3>
            <p className="font-semibold">Engagement: {engagementLevel}</p>
            <p>{stats.overallSummary?.summary}</p>
            <p>
              Local Engagement: {stats.parliamentaryActivity?.constituencyMentions || 0} mentions of {mp.constituency} ({localEngagementText} focus{' '}
              <span style={{ color: colorStyles[localEngagementColor].color }}>({colorStyles[localEngagementColor].label})</span>)
            </p>
            {neighbourIssues?.length > 0 && (
              <p>
                Constituency Alignment: Voting on {neighbourIssues[0].issue} is {alignmentText}{' '}
                <span style={{ color: colorStyles[alignmentColor].color }}>({colorStyles[alignmentColor].label})</span>
              </p>
            )}
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Voting Record (Top Issues)</h3>
            {stats.topVotingTopics?.length ? (
              <>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  {stats.topVotingTopics.slice(0, 5).map((topic, index) => (
                    <li key={index}>
                      {formatVotingStatement(topic.statement)}{' '}
                      <a href={topic.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        [See votes]
                      </a>
                    </li>
                  ))}
                </ul>
                {stats.topVotingTopics.length > 5 && (
                  <p className="text-sm text-gray-600">
                    Additional voting records available on{' '}
                    <a href={votingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      TheyWorkForYou
                    </a>.
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500">
                Limited voting activity, possibly due to role (e.g., Prime Minister). See{' '}
                <a href={votingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  TheyWorkForYou
                </a>.
              </p>
            )}
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Election Donations</h3>
            <p>{stats.electionDonations?.summary || "No election donations reported."}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Parliamentary Activity</h3>
            <p>Contributions: {stats.parliamentaryActivity?.speechCount || 0}</p>
            <p>Top Topics: {stats.parliamentaryActivity?.topTopics.join(", ") || "None"}</p>
            <p>Constituency Mentions: {stats.parliamentaryActivity?.constituencyMentions || 0}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Committees and Roles</h3>
            <p>Roles: {stats.committeesAndRoles?.roles || "None"}</p>
            <p>Committees: {stats.committeesAndRoles?.committees || "None"}</p>
            <p>Focus: {stats.committeesAndRoles?.focus || "General"}</p>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Data Source:</strong> Sourced from{' '}
              <a href="https://www.theyworkforyou.com/api/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                TheyWorkForYou API
              </a>.
            </p>
            <p>
              <strong>Disclaimer:</strong> Voting records may not fully reflect intentions, especially for senior roles with limited voting.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 w-full"
          aria-label="Close dialog"
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}