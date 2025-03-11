"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import Link from "next/link";
import Head from "next/head";

type MPDetails = {
  name: string;
  party: string;
  constituency: string;
  email: string;
  photoUrl?: string;
  bio?: string;
};

type FormData = {
  postcode: string;
  fullName: string;
  address: string;
  userEmail: string;
  issue: string;
  customIssue?: string;
  problem: string;
  solution: string;
  personalProblem: string;
  personalSolution: string;
  consent: boolean;
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  onKeyDown,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <div className="mb-4">
    <label className="block text-black dark:text-white mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border rounded text-black placeholder-gray-500 dark:text-white dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-400"
      required={required}
      onKeyDown={onKeyDown}
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  helpText = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}) => (
  <div className="mb-4">
    <label className="block text-black dark:text-white mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-2 border rounded text-black placeholder-gray-500 min-h-[100px] dark:text-white dark:border-gray-700 dark:bg-gray-800 dark:placeholder-gray-400 ${className}`}
      required={required}
    />
    {helpText && <p className="text-gray-500 text-sm mt-1 dark:text-gray-400">{helpText}</p>}
  </div>
);

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-center mb-6 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 p-2 rounded-lg shadow-md">
    <div className="flex items-center">
      <span className={`mr-2 font-bold ${currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
        1. Find MP <span className="text-xs italic font-normal">(Enter your postcode)</span>
      </span>
      <span className="mr-2 dark:text-gray-300">{">"}</span>
      <span className={`mr-2 font-bold ${currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
        2. Write Message <span className="text-xs italic font-normal">(Fill all boxes)</span>
      </span>
      <span className="mr-2 dark:text-gray-300">{">"}</span>
      <span className={`font-bold ${currentStep >= 3 ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`}>
        3. Send <span className="text-xs italic font-normal">(Tidy & email/share)</span>
      </span>
    </div>
  </div>
);

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    postcode: "",
    fullName: "",
    address: "",
    userEmail: "",
    issue: "",
    customIssue: "",
    problem: "",
    solution: "",
    personalProblem: "",
    personalSolution: "",
    consent: false,
  });
  const [mpDetails, setMpDetails] = useState<MPDetails | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [letter, setLetter] = useState<string>("");
  const [tidiedLetter, setTidiedLetter] = useState<string>("");
  const [editedTidiedLetter, setEditedTidiedLetter] = useState<string>("");
  const [isEditingTidiedLetter, setIsEditingTidiedLetter] = useState<boolean>(false);
  const [liabilityConsent, setLiabilityConsent] = useState<boolean>(false);
  const [tidyLoading, setTidyLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showLegalReminder, setShowLegalReminder] = useState<boolean>(false);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [showTidyPopup, setShowTidyPopup] = useState(false); // New state for tidy popup
  const tidiedLetterRef = useRef<HTMLPreElement | HTMLTextAreaElement>(null);

  const issueOptions = [
    "Government Overreach - (Free speech restrictions, arrests for criticizing policies, hate speech laws)",
    "Government Accountability - (Policy transparency, Online Safety Act concerns, government oversight)",
    "Cost of Living - (Food prices, energy bills, financial pressures)",
    "Healthcare - (NHS staff shortages, NHS waiting times, access to services)",
    "Social Care & Welfare - (Access delays, quality concerns, funding shortfalls)",
    "Education - (Teacher shortages, funding pressure, youth services)",
    "Housing - (Affordability, homelessness, social housing)",
    "Jobs & Economy - (Employment opportunities, local economy stagnation)",
    "Community & Cohesion - (Immigration, integration issues, local service strain)",
    "Crime & Safety - (Local crime, policing, community safety)",
    "Public Transport & Roads - (Transport access, road maintenance, reliability)",
    "Environment - (Sustainability, pollution, green spaces)",
    "Other - (Specify your own issue)",
  ];

  const scriptedPrompts: { [key: string]: { problem: string; solution: string }[] } = {
    "Government Overreach - (Free speech restrictions, arrests for criticizing policies, hate speech laws)": [
      {
        problem: "I’m concerned about arrests for peaceful protests under hate speech laws.",
        solution: "Advocate for clearer hate speech definitions to protect free expression.",
      },
      {
        problem: "Online criticism is being unfairly targeted by broad legal interpretations.",
        solution: "Push for amendments to ensure laws don’t suppress legitimate speech.",
      },
      {
        problem: "Local events have seen police overreach in managing public dissent.",
        solution: "Support guidelines to limit police action to actual threats, not opinions.",
      },
      {
        problem: "I’ve noticed people being fined for social media posts about politics.",
        solution: "Propose a public debate to refine online speech rules.",
      },
      {
        problem: "In my area, expressing views at public meetings feels risky.",
        solution: "Encourage community forums with legal oversight.",
      },
      {
        problem: "I’ve heard of friends silenced by vague speech laws.",
        solution: "Suggest a citizen-led review of speech legislation.",
      },
    ],
    "Government Accountability - (Policy transparency, Online Safety Act concerns, government oversight)": [
      {
        problem: "The Online Safety Act’s impact isn’t clear to constituents.",
        solution: "Press for public reports on how policies affect our community.",
      },
      {
        problem: "Decisions seem made without local input or explanation.",
        solution: "Call for regular town halls to improve transparency.",
      },
      {
        problem: "Oversight of government actions feels weak in our area.",
        solution: "Advocate for stronger independent reviews of policy effects.",
      },
      {
        problem: "I’ve noticed local policies announced with no prior consultation.",
        solution: "Propose a citizen feedback app for policy drafts.",
      },
      {
        problem: "In my town, budget cuts lack clear justification.",
        solution: "Suggest open Q&A sessions with local officials.",
      },
      {
        problem: "I’ve seen online laws confuse residents about their rights.",
        solution: "Encourage a simplified online rights guide.",
      },
    ],
    "Cost of Living - (Food prices, energy bills, financial pressures)": [
      {
        problem: "Energy bills are soaring, straining local families.",
        solution: "Support energy cost subsidies for low-income households.",
      },
      {
        problem: "Food prices in our shops are outpacing wages.",
        solution: "Push for tax relief on essentials to ease financial pressure.",
      },
      {
        problem: "Rising rents are pushing people out of our community.",
        solution: "Advocate for rent caps or more affordable housing options.",
      },
      {
        problem: "I’ve struggled to heat my home this winter.",
        solution: "Propose a community energy-sharing scheme.",
      },
      {
        problem: "In my area, grocery costs make it hard to feed my family.",
        solution: "Suggest local food co-ops to reduce prices.",
      },
      {
        problem: "I’ve noticed friends cutting back due to rising costs.",
        solution: "Encourage a barter network for essential goods.",
      },
    ],
    "Healthcare - (NHS staff shortages, NHS waiting times, access to services)": [
      {
        problem: "NHS waiting times are delaying care for local patients.",
        solution: "Increase funding to hire more healthcare staff locally.",
      },
      {
        problem: "GP appointments are hard to book in our area.",
        solution: "Support incentives to attract doctors to our constituency.",
      },
      {
        problem: "Specialist services are too far away for many residents.",
        solution: "Push for mobile clinics or better transport to healthcare.",
      },
      {
        problem: "I’ve waited months for a doctor’s appointment.",
        solution: "Propose a telemedicine pilot for routine checkups.",
      },
      {
        problem: "In my town, elderly neighbors can’t access urgent care.",
        solution: "Suggest a neighborhood health volunteer network.",
      },
      {
        problem: "I’ve seen friends struggle with mental health support delays.",
        solution: "Encourage peer-support groups with MP backing.",
      },
    ],
    "Social Care & Welfare - (Access delays, quality concerns, funding shortfalls)": [
      {
        problem: "Elderly locals wait months for care assessments.",
        solution: "Advocate for more funding to speed up care access.",
      },
      {
        problem: "Care quality varies widely in our community.",
        solution: "Support stricter standards and oversight for care providers.",
      },
      {
        problem: "Welfare delays are leaving families in hardship.",
        solution: "Press for faster processing of welfare claims locally.",
      },
      {
        problem: "I’ve seen a relative wait too long for home care.",
        solution: "Propose a care scheduling app for quicker matches.",
      },
      {
        problem: "In my area, care homes have inconsistent standards.",
        solution: "Suggest peer reviews by local care users.",
      },
      {
        problem: "I’ve noticed friends struggling with delayed benefits.",
        solution: "Encourage a community welfare advice hotline.",
      },
    ],
    "Education - (Teacher shortages, funding pressure, youth services)": [
      {
        problem: "Teacher shortages are disrupting our schools.",
        solution: "Support recruitment bonuses to bring in more educators.",
      },
      {
        problem: "School budgets can’t cover basic supplies here.",
        solution: "Push for increased per-pupil funding in our area.",
      },
      {
        problem: "Youth services have shrunk, leaving kids with few options.",
        solution: "Advocate for restoring local youth programs.",
      },
      {
        problem: "I’ve noticed my child’s class has no art supplies.",
        solution: "Propose a school swap program for unused materials.",
      },
      {
        problem: "In my area, kids lack after-school activities.",
        solution: "Suggest community-led youth clubs using existing spaces.",
      },
      {
        problem: "I’ve seen teachers overstretched at my kid’s school.",
        solution: "Encourage a parent-teacher mentoring initiative.",
      },
    ],
    "Housing - (Affordability, homelessness, social housing)": [
      {
        problem: "Rents are unaffordable for many in our constituency.",
        solution: "Support building more social housing locally.",
      },
      {
        problem: "Homelessness is rising on our streets.",
        solution: "Push for emergency shelters and support services.",
      },
      {
        problem: "Young families can’t buy homes here anymore.",
        solution: "Advocate for affordable homeownership schemes.",
      },
      {
        problem: "I’ve struggled to find a flat I can afford.",
        solution: "Propose a tenant-landlord mediation service.",
      },
      {
        problem: "In my town, homeless people sleep near my home.",
        solution: "Suggest a community outreach program for support.",
      },
      {
        problem: "I’ve seen young couples leave due to housing costs.",
        solution: "Encourage shared housing schemes for first-timers.",
      },
    ],
    "Jobs & Economy - (Employment opportunities, local economy stagnation)": [
      {
        problem: "Job openings are scarce in our area.",
        solution: "Encourage investment in local job creation programs.",
      },
      {
        problem: "Small businesses are closing due to high costs.",
        solution: "Support tax breaks or grants for local startups.",
      },
      {
        problem: "Young people are leaving for work elsewhere.",
        solution: "Push for training schemes to keep talent here.",
      },
      {
        problem: "I’ve lost my job and can’t find new work locally.",
        solution: "Propose a skills-sharing network among locals.",
      },
      {
        problem: "In my area, shops keep shutting down.",
        solution: "Suggest a local business mentoring program.",
      },
      {
        problem: "I’ve noticed teens leaving for city jobs.",
        solution: "Encourage remote work hubs in our community.",
      },
    ],
    "Community & Cohesion - (Immigration, integration issues, local service strain)": [
      {
        problem: "Service strain is causing tension in our community.",
        solution: "Fund expanded services to match population needs.",
      },
      {
        problem: "New residents struggle to integrate locally.",
        solution: "Support community programs to foster inclusion.",
      },
      {
        problem: "Language barriers limit access to local help.",
        solution: "Advocate for English language training to improve integration.",
      },
      {
        problem: "I’ve seen long waits at my local clinic due to population growth.",
        solution: "Propose a community health info day.",
      },
      {
        problem: "In my area, new families feel isolated.",
        solution: "Suggest a welcome buddy system with locals.",
      },
      {
        problem: "I’ve noticed concerns about illegal immigration affecting trust.",
        solution: "Encourage a public forum to discuss integration policies fairly.",
      },
    ],
    "Crime & Safety - (Local crime, policing, community safety)": [
      {
        problem: "Petty crime is rising in our neighborhoods.",
        solution: "Support more police patrols in high-crime areas.",
      },
      {
        problem: "Anti-social behavior is unsettling residents.",
        solution: "Push for community initiatives to address youth behavior.",
      },
      {
        problem: "Poor lighting increases safety fears at night.",
        solution: "Advocate for better street lighting locally.",
      },
      {
        problem: "I’ve had my bike stolen near my home.",
        solution: "Propose a neighborhood watch app for reporting.",
      },
      {
        problem: "In my area, teens are causing trouble at night.",
        solution: "Suggest a youth dialogue group with community leaders.",
      },
      {
        problem: "I’ve noticed dark streets feel unsafe.",
        solution: "Encourage a resident-led safety audit.",
      },
    ],
    "Public Transport & Roads - (Transport access, road maintenance, reliability)": [
      {
        problem: "Buses are unreliable, stranding commuters.",
        solution: "Press for improved bus schedules and funding.",
      },
      {
        problem: "Potholes are damaging cars and risking safety.",
        solution: "Support road repair budgets for our area.",
      },
      {
        problem: "Rural areas lack decent transport links.",
        solution: "Advocate for better rural bus routes.",
      },
      {
        problem: "I’ve missed work due to late buses.",
        solution: "Propose a commuter feedback system for schedules.",
      },
      {
        problem: "In my town, potholes ruined my car tires.",
        solution: "Suggest a community pothole reporting map.",
      },
      {
        problem: "I’ve seen no buses to my village.",
        solution: "Encourage a carpool network for rural residents.",
      },
    ],
    "Environment - (Sustainability, pollution, green spaces)": [
      {
        problem: "Air pollution is worsening local health.",
        solution: "Promote stricter emissions controls in our area.",
      },
      {
        problem: "Green spaces are shrinking due to development.",
        solution: "Push for protections on local parks and fields.",
      },
      {
        problem: "Litter is piling up in our community.",
        solution: "Support more clean-up efforts and bins locally.",
      },
      {
        problem: "I’ve noticed smog affecting my breathing.",
        solution: "Propose a community air quality monitoring project.",
      },
      {
        problem: "In my area, a park is being built over.",
        solution: "Suggest a petition to redesignate it as protected.",
      },
      {
        problem: "I’ve seen rubbish overflow near my street.",
        solution: "Encourage a local litter swap initiative.",
      },
    ],
  };

  const getProblemPlaceholder = (issue: string) => {
    switch (issue) {
      case "Government Overreach - (Free speech restrictions, arrests for criticizing policies, hate speech laws)":
        return "e.g., I’ve heard of people being arrested for social media posts criticizing government policies.";
      case "Government Accountability - (Policy transparency, Online Safety Act concerns, government oversight)":
        return "e.g., I’m concerned about lack of transparency in government policies like the Online Safety Act.";
      case "Cost of Living - (Food prices, energy bills, financial pressures)":
        return "e.g., My energy bills have doubled this year.";
      case "Healthcare - (NHS staff shortages, NHS waiting times, access to services)":
        return "e.g., I’ve waited 6 months for an NHS appointment.";
      case "Social Care & Welfare - (Access delays, quality concerns, funding shortfalls)":
        return "e.g., My elderly parent waits weeks for care support.";
      case "Education - (Teacher shortages, funding pressure, youth services)":
        return "e.g., My child’s school lacks enough teachers for core subjects.";
      case "Housing - (Affordability, homelessness, social housing)":
        return "e.g., Rents in my area are unaffordable for my income.";
      case "Jobs & Economy - (Employment opportunities, local economy stagnation)":
        return "e.g., There are few job openings in my town.";
      case "Community & Cohesion - (Immigration, integration issues, local service strain)":
        return "e.g., Local services are overstretched due to population growth.";
      case "Crime & Safety - (Local crime, policing, community safety)":
        return "e.g., Burglaries have increased in my neighborhood.";
      case "Public Transport & Roads - (Transport access, road maintenance, reliability)":
        return "e.g., Buses in my area are unreliable and often late.";
      case "Environment - (Sustainability, pollution, green spaces)":
        return "e.g., Air pollution near my home is affecting my health.";
      case "Other - (Specify your own issue)":
        return "e.g., Describe your specific concern here.";
      default:
        return "Describe the problem";
    }
  };

  const getSolutionPlaceholder = (issue: string) => {
    switch (issue) {
      case "Government Overreach - (Free speech restrictions, arrests for criticizing policies, hate speech laws)":
        return "e.g., Advocate for clearer definitions of hate speech to protect free expression.";
      case "Government Accountability - (Policy transparency, Online Safety Act concerns, government oversight)":
        return "e.g., Push for greater transparency in government policy-making.";
      case "Cost of Living - (Food prices, energy bills, financial pressures)":
        return "e.g., Subsidize energy costs for low-income households.";
      case "Healthcare - (NHS staff shortages, NHS waiting times, access to services)":
        return "e.g., Increase funding for local NHS staff recruitment.";
      case "Social Care & Welfare - (Access delays, quality concerns, funding shortfalls)":
        return "e.g., Hire more carers to reduce waiting times.";
      case "Education - (Teacher shortages, funding pressure, youth services)":
        return "e.g., Offer incentives to attract teachers to our schools.";
      case "Housing - (Affordability, homelessness, social housing)":
        return "e.g., Build more affordable homes on unused land.";
      case "Jobs & Economy - (Employment opportunities, local economy stagnation)":
        return "e.g., Support small businesses with tax breaks.";
      case "Community & Cohesion - (Immigration, integration issues, local service strain)":
        return "e.g., Fund community programs to ease service demand.";
      case "Crime & Safety - (Local crime, policing, community safety)":
        return "e.g., Increase police patrols in high-crime areas.";
      case "Public Transport & Roads - (Transport access, road maintenance, reliability)":
        return "e.g., Improve bus schedules and repair potholes.";
      case "Environment - (Sustainability, pollution, green spaces)":
        return "e.g., Enforce stricter emissions rules in our area.";
      case "Other - (Specify your own issue)":
        return "e.g., Propose your own solution here.";
      default:
        return "Propose a solution";
    }
  };

  const updateFormData = (key: keyof FormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (mpDetails && formData.issue && formData.problem && formData.consent) {
      const issueText = formData.issue === "Other - (Specify your own issue)" && formData.customIssue ? formData.customIssue : formData.issue.split(" - ")[0];
      const generatedLetter = `
Dear ${mpDetails.name ?? "MP"},

I am writing to express my concern regarding the issue of ${issueText.toLowerCase()} in our constituency of ${mpDetails.constituency ?? "your constituency"}.

The specific problem is: ${formData.problem}${formData.personalProblem ? `\n\nMy personal experience: ${formData.personalProblem}` : ""}

${formData.solution ? `I believe a possible solution could be: ${formData.solution}${formData.personalSolution ? `\n\nMy suggestion based on personal experience: ${formData.personalSolution}` : ""}` : ""}

I appreciate your attention to this matter and look forward to your response.

Yours sincerely,
${formData.fullName}
${formData.address}
${formData.postcode.toUpperCase()}
Email: ${formData.userEmail}
      `.trim();
      setLetter(generatedLetter);
    } else {
      setLetter("");
    }
  }, [mpDetails, formData]);

  const handleSearch = async () => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    if (!formData.postcode.trim() || !postcodeRegex.test(formData.postcode.trim())) {
      setError("Please enter a valid UK postcode (e.g., SW1A 1AA).");
      return;
    }

    setLoading(true);
    setError("");
    setMpDetails(null);

    try {
      const response = await fetch(`/api/getMP?postcode=${formData.postcode}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (data.error) {
        setError("No MP found for this postcode. Please recheck your entry and try again.");
      } else {
        const lines = data.mpDetails.split("\n").reduce((acc: { [key: string]: string }, line: string) => {
          const [key, value] = line.split(": ").map((s: string) => s.trim());
          acc[key.toLowerCase()] = value;
          return acc;
        }, {});

        const parsedDetails = {
          name: lines["name"] || "Unknown",
          party: lines["party"] || "Unknown",
          constituency: lines["constituency"] || "Unknown",
          email: lines["email"] || "Unknown",
          photoUrl: undefined,
          bio: undefined,
        };

        if (
          parsedDetails.name === "Unknown" &&
          parsedDetails.party === "Unknown" &&
          parsedDetails.constituency === "Unknown" &&
          parsedDetails.email === "Unknown"
        ) {
          setError("No MP found for this postcode. Please recheck your entry and try again.");
        } else {
          setMpDetails(parsedDetails);
        }
      }
    } catch (err) {
      setError("An error occurred while fetching MP details. Please try again or check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleGetSuggestion = () => {
    if (!formData.issue || formData.issue === "Other - (Specify your own issue)") {
      setError("Please select an issue first (other than 'Other').");
      return;
    }

    const prompts = scriptedPrompts[formData.issue];
    const nextIndex = (suggestionIndex + 1) % prompts.length;
    updateFormData("problem", prompts[nextIndex].problem);
    updateFormData("solution", prompts[nextIndex].solution);
    setSuggestionIndex(nextIndex);
  };

  const handleClearSuggestion = () => {
    updateFormData("problem", "");
    updateFormData("solution", "");
    setSuggestionIndex(0);
  };

  const handleTidyLetter = async () => {
    if (!letter || !formData.fullName || !formData.address || !formData.userEmail || !liabilityConsent) {
      setError("Please fill in your name, address, email, generate a message, and agree to the disclaimer first.");
      return;
    }

    setShowLegalReminder(true);
  };

  const confirmTidyLetter = async () => {
    setShowLegalReminder(false);
    setTidyLoading(true);
    try {
      const response = await fetch("/api/tidyLetter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letter,
          name: formData.fullName,
          address: formData.address,
          email: formData.userEmail,
        }),
      });
      if (!response.ok) throw new Error("Failed to tidy message");
      const data = await response.json();
      setTidiedLetter(data.tidiedLetter || "No tidied message returned");
      setEditedTidiedLetter(data.tidiedLetter || "");
      console.log("Tidied Message Set:", data.tidiedLetter);
    } catch (err) {
      setError("An error occurred while tidying the message. Please try again or check your connection.");
      console.error(err);
    } finally {
      setTidyLoading(false);
    }
  };

  const handleEmailYourMP = () => {
    if (!mpDetails || !tidiedLetter || !formData.fullName || !formData.userEmail || !liabilityConsent) {
      setError("Please ensure you have generated and tidied a message, provided your details, and agreed to the disclaimer.");
      return;
    }

    const subject = `Message from constituent regarding ${formData.issue}`;
    const body = encodeURIComponent(isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter);
    window.open(`mailto:${mpDetails.email}?subject=${encodeURIComponent(subject)}&body=${body}`, "_blank");
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };

  const handleShareOnTwitter = async () => {
    if (!tidiedLetterRef.current || !tidiedLetter) return;

    const letterToSanitize = isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter;
    console.log("Current Tidied Message State:", letterToSanitize);

    const sanitizedLetterLines = letterToSanitize.split("\n");
    let bodyEndIndex = sanitizedLetterLines.length;
    for (let i = 1; i < sanitizedLetterLines.length; i++) {
      const line = sanitizedLetterLines[i].trim().toLowerCase();
      if (
        line.match(/^(yours sincerely,|sincerely,)/i) ||
        line.includes(formData.fullName.toLowerCase()) ||
        line.includes(formData.address.toLowerCase()) ||
        line.includes(formData.userEmail.toLowerCase()) ||
        line.includes(formData.postcode.toLowerCase()) ||
        line.startsWith("i appreciate your attention to this matter and look forward to")
      ) {
        bodyEndIndex = i;
        break;
      }
    }

    if (bodyEndIndex <= 1) {
      throw new Error("Could not determine the end of the message body in the tidied message.");
    }

    const bodyLines = sanitizedLetterLines.slice(1, bodyEndIndex).filter(
      (line) =>
        !line.toLowerCase().startsWith("my personal experience:") &&
        !line.toLowerCase().startsWith("to address this problem,") &&
        !line.toLowerCase().startsWith("i appreciate your attention to this matter and look forward to")
    );

    const sanitizedLetter = `
Dear ${mpDetails?.name ?? "MP"},

${bodyLines.join("\n").trim()}

Yours sincerely,
[Name omitted]
    `.trim();

    const originalContent = tidiedLetterRef.current.innerText;
    tidiedLetterRef.current.innerText = sanitizedLetter;

    await new Promise((resolve) => setTimeout(resolve, 2500));

    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts && tidiedLetterRef.current?.innerText !== sanitizedLetter) {
      console.log(`Attempt ${attempts + 1}: Tidied Message Ref`, tidiedLetterRef.current?.innerText);
      await new Promise((resolve) => setTimeout(resolve, 250));
      attempts++;
    }

    console.log("Tidied Message Ref Before Screenshot (Final):", tidiedLetterRef.current?.innerText);
    console.log("Sanitized Message:", sanitizedLetter);

    try {
      const canvas = await html2canvas(tidiedLetterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => element.tagName === "SCRIPT" || element.tagName === "STYLE",
      });
      const imageDataUrl = canvas.toDataURL("image/png");

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext("2d");
      if (tempContext) {
        tempContext.drawImage(canvas, 0, 0);
      }
      const jpegImageDataUrl = tempCanvas.toDataURL("image/jpeg", 0.9);

      let blob;
      try {
        blob = await fetch(imageDataUrl).then((res) => res.blob());
      } catch (pngError) {
        console.error("PNG copy failed, trying JPEG:", pngError);
        blob = await fetch(jpegImageDataUrl).then((res) => res.blob());
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      alert("Screenshot of the tidied message copied to clipboard! Paste it into your Twitter tweet (use Ctrl+V or Cmd+V).");

      const tweetText = "I wrote to my MP in minutes, you can too. Try it ➡️";
      const url = window.location.href;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank", "width=600,height=400");
    } catch (err) {
      console.error("Failed to generate screenshot or copy to clipboard:", err);
      setError("Couldn’t generate screenshot or copy to clipboard. Sharing text only.");

      const tweetText = "I wrote to my MP in minutes, you can too. Try it ➡️";
      const url = window.location.href;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, "_blank", "width=600,height=400");
    } finally {
      tidiedLetterRef.current.innerText = originalContent;
    }
  };

  const handleShareOnFacebook = async () => {
    if (!tidiedLetterRef.current || !tidiedLetter) return;

    const letterToSanitize = isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter;
    console.log("Current Tidied Message State for Facebook:", letterToSanitize);

    const sanitizedLetterLines = letterToSanitize.split("\n");
    let bodyEndIndex = sanitizedLetterLines.length;
    for (let i = 1; i < sanitizedLetterLines.length; i++) {
      const line = sanitizedLetterLines[i].trim().toLowerCase();
      if (
        line.match(/^(yours sincerely,|sincerely,)/i) ||
        line.includes(formData.fullName.toLowerCase()) ||
        line.includes(formData.address.toLowerCase()) ||
        line.includes(formData.userEmail.toLowerCase()) ||
        line.includes(formData.postcode.toLowerCase()) ||
        line.startsWith("i appreciate your attention to this matter and look forward to")
      ) {
        bodyEndIndex = i;
        break;
      }
    }

    if (bodyEndIndex <= 1) {
      throw new Error("Could not determine the end of the message body in the tidied message.");
    }

    const bodyLines = sanitizedLetterLines.slice(1, bodyEndIndex).filter(
      (line) =>
        !line.toLowerCase().startsWith("my personal experience:") &&
        !line.toLowerCase().startsWith("to address this problem,") &&
        !line.toLowerCase().startsWith("i appreciate your attention to this matter and look forward to")
    );

    const sanitizedLetter = `
Dear ${mpDetails?.name ?? "MP"},

${bodyLines.join("\n").trim()}

Yours sincerely,
[Name omitted]
    `.trim();

    const originalContent = tidiedLetterRef.current.innerText;
    tidiedLetterRef.current.innerText = sanitizedLetter;

    await new Promise((resolve) => setTimeout(resolve, 2500));

    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts && tidiedLetterRef.current?.innerText !== sanitizedLetter) {
      console.log(`Attempt ${attempts + 1}: Tidied Message Ref`, tidiedLetterRef.current?.innerText);
      await new Promise((resolve) => setTimeout(resolve, 250));
      attempts++;
    }

    console.log("Tidied Message Ref Before Screenshot (Final):", tidiedLetterRef.current?.innerText);
    console.log("Sanitized Message for Facebook:", sanitizedLetter);

    try {
      const canvas = await html2canvas(tidiedLetterRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        ignoreElements: (element) => element.tagName === "SCRIPT" || element.tagName === "STYLE",
      });
      const imageDataUrl = canvas.toDataURL("image/png");

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext("2d");
      if (tempContext) {
        tempContext.drawImage(canvas, 0, 0);
      }
      const jpegImageDataUrl = tempCanvas.toDataURL("image/jpeg", 0.9);

      let blob;
      try {
        blob = await fetch(imageDataUrl).then((res) => res.blob());
      } catch (pngError) {
        console.error("PNG copy failed, trying JPEG:", pngError);
        blob = await fetch(jpegImageDataUrl).then((res) => res.blob());
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      alert("Screenshot of the tidied message copied to clipboard! Paste it into your Facebook post (use Ctrl+V or Cmd+V).");

      const url = window.location.href;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, "_blank", "width=600,height=400");
    } catch (err) {
      console.error("Failed to generate screenshot or copy to clipboard:", err);
      setError("Couldn’t generate screenshot or copy to clipboard. Sharing text only.");

      const url = window.location.href;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, "_blank", "width=600,height=400");
    } finally {
      tidiedLetterRef.current.innerText = originalContent;
    }
  };

  const handleEditToggle = () => {
    setIsEditingTidiedLetter(!isEditingTidiedLetter);
    if (!isEditingTidiedLetter) {
      setEditedTidiedLetter(tidiedLetter);
    } else {
      setTidiedLetter(editedTidiedLetter);
    }
  };

  const handleEditedTidiedLetterChange = (value: string) => {
    setEditedTidiedLetter(value);
  };

  const getCurrentStep = () => {
    if (tidiedLetter) return 3;
    if (mpDetails) return 2;
    return 1;
  };

  return (
    <>
      <Head>
        <meta property="og:title" content="DM My MP - Beta" />
        <meta property="og:description" content="I wrote to my MP in minutes, you can too. Try it ➡️" />
        <meta property="og:url" content="https://dmmymp.com" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="container mx-auto p-6 bg-white dark:bg-gray-900">
        {!mpDetails ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">DM My MP - Beta</h1>
            <p className="text-gray-600 mb-4 dark:text-gray-300">Contact your representative about an important issue in minutes.</p>
            <p className="text-sm text-yellow-600 mb-4 dark:text-yellow-400">
              This is a beta version—please report issues to <a href="mailto:dmmymp@gmail.com" className="underline">feedback</a>.
            </p>
            <div className="w-full max-w-md">
              <p className="text-sm text-gray-700 mb-4 dark:text-gray-300">
                <strong>How It Works:</strong> 1. Enter your postcode to find your MP. 2. Write your message with optional suggestions. 3. Send it directly to your MP’s email.
              </p>
              <p className="text-sm text-gray-700 mb-4 dark:text-gray-300">
                <strong>About This Tool:</strong> This is a free, independent tool to help UK citizens voice concerns to MPs. We don’t store your data after use—just enter, write, and send.
              </p>
              <InputField
                label="UK Postcode"
                value={formData.postcode}
                onChange={(value) => updateFormData("postcode", value)}
                placeholder="e.g., SW1A 1AA"
                required
                onKeyDown={handlePostcodeKeyDown}
              />
              <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm">
                Note: This is a beta version without CAPTCHA. Please use responsibly.
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Find My MP"}
                </button>
                <Link href="/insights">
                  <button className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-800 dark:bg-purple-600 dark:hover:bg-purple-700">
                    Top Issues in Your Area (Demo Only)
                  </button>
                </Link>
              </div>
              {error && <p className="text-red-500 mt-4 text-center dark:text-red-400">{error}</p>}
            </div>
            <footer className="mt-8 text-center text-gray-600 dark:text-gray-300">
              <p>
                <Link href="/terms-of-use" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Terms of Use</Link> |{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link> |{" "}
                <Link href="/free-speech" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Your Free Speech Rights</Link>
              </p>
            </footer>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-black dark:text-white">Send a DM to Your MP - Beta</h1>
            </div>
            <p className="text-sm text-yellow-600 mb-4 dark:text-yellow-400 text-center">
              This is a beta version—please report issues to <a href="mailto:dmmymp@gmail.com" className="underline">feedback</a>.
            </p>
            <ProgressIndicator currentStep={getCurrentStep()} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-4 border rounded bg-gray-100 text-black dark:bg-gray-800 dark:text-white dark:border-gray-700">
                <p className="text-sm text-gray-700 mb-4 dark:text-gray-300">
                  <strong>About This Tool:</strong> A free, independent way to contact your MP. We don’t store your data—just write and send.
                </p>
                <div className="flex items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-black dark:text-white">{mpDetails.name}</h2>
                    <p><strong className="text-black dark:text-white">Party:</strong> {mpDetails.party}</p>
                    <p><strong className="text-black dark:text-white">Constituency:</strong> {mpDetails.constituency}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-black dark:text-white"><strong className="text-black dark:text-white">Email:</strong> {mpDetails.email}</p>
                  <button
                    onClick={() => handleCopyToClipboard(mpDetails.email)}
                    className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 text-xs"
                  >
                    Copy Email
                  </button>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2 text-black dark:text-white">Your Details</h3>
                <InputField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(value) => updateFormData("fullName", value)}
                  placeholder="Full Name"
                  required
                />
                <InputField
                  label="Address"
                  value={formData.address}
                  onChange={(value) => updateFormData("address", value)}
                  placeholder="Address in Constituency"
                  required
                />
                <InputField
                  label="Email"
                  value={formData.userEmail}
                  onChange={(value) => updateFormData("userEmail", value)}
                  placeholder="Your Email Address"
                  type="email"
                  required
                />
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => updateFormData("consent", e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-black dark:text-white">I consent to my data being used to generate and send this message.</span>
                </label>

                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Disclaimer</h3>
                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  Disclaimer: You’re responsible for your message’s content, which must comply with UK laws (e.g., Public Order Act 1986, Online Safety Act 2023). We don’t store your data after use, review your content, or endorse it. Use responsibly.
                </p>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={liabilityConsent}
                    onChange={(e) => setLiabilityConsent(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-black dark:text-white">I acknowledge that I am solely responsible for my message’s content and agree to the terms.</span>
                </label>

                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Draft Your Message</h3>
                <div className="mb-4">
                  <label className="block text-black dark:text-white mb-1">Select an Issue</label>
                  <select
                    value={formData.issue}
                    onChange={(e) => updateFormData("issue", e.target.value)}
                    className="w-full p-2 border rounded text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="">Select an issue</option>
                    {issueOptions.map((option) => (
                      <option key={option} value={option} className="text-black dark:text-white">{option}</option>
                    ))}
                  </select>
                </div>
                {formData.issue === "Other - (Specify your own issue)" && (
                  <InputField
                    label="Specify Your Issue"
                    value={formData.customIssue || ""}
                    onChange={(value) => updateFormData("customIssue", value)}
                    placeholder="e.g., Local park maintenance"
                    required
                  />
                )}

                <div className="flex gap-2 mb-2">
                  <button
                    onClick={handleGetSuggestion}
                    className="w-2/3 bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-white"
                    disabled={!formData.issue || formData.issue === "Other - (Specify your own issue)"}
                  >
                    Get Suggestion of a Common Concern
                  </button>
                  <button
                    onClick={handleClearSuggestion}
                    className="w-1/3 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Clear Suggestion
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-4 dark:text-gray-400">
                  Prompts based on common UK constituency concerns from public data (e.g., <a href="https://www.gov.uk/government/statistics" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">gov.uk reports</a>).
                </p>

                <TextAreaField
                  label="Problem (Required)"
                  value={formData.problem}
                  onChange={(value) => updateFormData("problem", value)}
                  placeholder={getProblemPlaceholder(formData.issue)}
                  required
                  helpText="Keep it factual and non-threatening to comply with UK law."
                />
                <TextAreaField
                  label="Personal Experience (Optional)"
                  value={formData.personalProblem}
                  onChange={(value) => updateFormData("personalProblem", value)}
                  placeholder="Add your personal experience (optional, ensure it’s legal)"
                />
                <TextAreaField
                  label="Solution (Optional)"
                  value={formData.solution}
                  onChange={(value) => updateFormData("solution", value)}
                  placeholder={getSolutionPlaceholder(formData.issue)}
                  helpText="Edit or replace the suggestion as needed."
                />
                <TextAreaField
                  label="Personal Solution (Optional)"
                  value={formData.personalSolution}
                  onChange={(value) => updateFormData("personalSolution", value)}
                  placeholder="Add your suggestion based on experience (optional, ensure it’s legal)"
                />
              </div>

              <div className="p-4 border rounded bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Draft Message Preview</h3>
                <p className="text-gray-600 mb-2 dark:text-gray-400">
                  This preview updates as you fill the form. Scroll to see it grow!
                </p>
                <pre
                  className="whitespace-pre-wrap mb-4 min-h-[400px] border p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-300"
                  style={{ borderColor: letter ? "green" : "gray" }}
                >
                  {letter || "Start typing above to see your draft message here..."}
                </pre>

                <button
                  onClick={handleTidyLetter}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={tidyLoading || !letter || !liabilityConsent}
                >
                  {tidyLoading ? "Tidying Message..." : "Tidy and Format Message with AI"}
                </button>

                {showLegalReminder && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg dark:bg-gray-800 max-w-md">
                      <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Before Tidying Your Message</h3>
                      <p className="text-gray-700 mb-2 dark:text-gray-300">
                        This message will be tidied using Mistral AI, an open-source model that refines your text for clarity.{" "}
                        <a href="https://mistral.ai" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Learn more</a>.
                      </p>
                      <p className="text-gray-700 mb-4 dark:text-gray-300">
                        Ensure your message complies with UK laws (e.g., no threats or offensive content). You remain fully responsible for its content.
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowLegalReminder(false)}
                          className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmTidyLetter}
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {tidiedLetter && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Tidied Message:</h3>
                    {isEditingTidiedLetter ? (
                      <TextAreaField
                        label=""
                        value={editedTidiedLetter}
                        onChange={handleEditedTidiedLetterChange}
                        placeholder="Edit your tidied message here"
                        className="min-h-[400px]"
                      />
                    ) : (
                      <pre ref={tidiedLetterRef as React.RefObject<HTMLPreElement>} className="whitespace-pre-wrap mb-4 min-h-[400px] border p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        {editedTidiedLetter || tidiedLetter}
                      </pre>
                    )}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleEditToggle}
                        className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                      >
                        {isEditingTidiedLetter ? "Save Changes" : "Edit Tidied Message"}
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter)}
                        className="w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                      >
                        📋 Copy Message
                      </button>
                      <button
                        onClick={handleEmailYourMP}
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        disabled={isEditingTidiedLetter || !liabilityConsent}
                      >
                        📧 Email Your MP
                      </button>
                      <button
                        onClick={handleShareOnTwitter}
                        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 flex items-center justify-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                        disabled={isEditingTidiedLetter || !liabilityConsent}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X with name/address/email omitted
                      </button>
                      <button
                        onClick={handleShareOnFacebook}
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                        disabled={isEditingTidiedLetter || !liabilityConsent}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.845c0-2.509 1.493-3.89 3.777-3.89.755 0 1.545.135 2.314.405v2.536h-1.304c-1.285 0-1.685.798-1.685 1.615V12h2.867l-.457 2.892h-2.41v6.987C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                        Share on Facebook with name/address/email omitted
                      </button>
                    </div>
                    {emailSent && (
                      <p className="text-green-600 mt-2 text-center dark:text-green-400">Email opened! Check your client to send.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {error && <p className="text-red-500 mt-4 text-center dark:text-red-400">{error}</p>}
            <footer className="mt-8 text-center text-gray-600 dark:text-gray-300">
              <p>
                <Link href="/terms-of-use" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Terms of Use</Link> |{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link> |{" "}
                <Link href="/free-speech" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Your Free Speech Rights</Link>
              </p>
            </footer>
          </div>
        )}
      </div>
    </>
  );
}