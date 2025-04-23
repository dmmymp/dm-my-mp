
// Part 1

'use client';
import { insertLetter } from "./actions";
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import Link from "next/link";
import Head from "next/head";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MpStatsModal from "./components/MpStatsModal";
import DOMPurify from "dompurify"; // Added for input sanitization

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// reCAPTCHA site key for bot protection
const RECAPTCHA_SITE_KEY="6Ldv3CErAAAAAKdyUdc81tDy9FL8ouCLRDSle3dI" ; 



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

type EngagementMetric = {
  value: string | number;
  color: "green" | "amber" | "red";
  tooltip: string;
  link?: string;
};

type PolicyCategory = {
  category: string;
  summary: string;
  position: number;
  spectrum: { left: string; center: string; right: string };
  votes: { left: number; right: number };
  link: string;
};

type MPStats = {
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
  policyCategories: PolicyCategory[];
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
  totalDeclaredInterests: number | null;
  averageTotalDeclaredInterests: number;
};



type EngagementData = {
  totalLetters: number;
  topIssues: { issue: string; count: number }[];
  byConstituency: { constituency: string; count: number }[];
  byPostcode: { postcode: string; count: number }[];
  recentLetters: {
    postcode: string;
    issue: string;
    customIssue: string | null;
    problemShort: string;
    solutionShort: string | null;
    constituency: string;
    sentAt: string;
  }[];
};

// InputField Component for form inputs
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

// TextAreaField Component for textarea inputs
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

// ProgressIndicator Component to show the current step
const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center mb-6 gap-2 sm:gap-4">
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
          currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
        }`}
        aria-label={`Step 1: Find MP (Enter your postcode)${currentStep >= 1 ? " (Active)" : ""}`}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <span
        className={`mt-1 text-xs sm:text-sm font-medium text-center ${
          currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Find MP (Enter your postcode)
      </span>
    </div>

    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
          currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
        }`}
        aria-label={`Step 2: Write Message (Fill the boxes)${currentStep >= 2 ? " (Active)" : ""}`}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </div>
      <span
        className={`mt-1 text-xs sm:text-sm font-medium text-center ${
          currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Write Message (Fill in boxes)
      </span>
    </div>

    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
          currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
        }`}
        aria-label={`Step 3: Send (Tidy and email/share)${currentStep >= 3 ? " (Active)" : ""}`}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span
        className={`mt-1 text-xs sm:text-sm font-medium text-center ${
          currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Send (Tidy and email/share)
      </span>
    </div>
  </div>
);

// Function to extract outward code from postcode
const getOutwardCode = (postcode: string): string => {
  const match = postcode.match(/^([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\s*[0-9][A-Z]{2}$/i);
  return match ? match[1].toUpperCase() : postcode.toUpperCase(); // Fallback to full postcode if invalid
};

// Part 2

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
  const [showMpStats, setShowMpStats] = useState<boolean>(false);
  const [showNeighbourIssues, setShowNeighbourIssues] = useState<boolean>(false);
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [showTrendsModal, setShowTrendsModal] = useState<boolean>(false);
  const [isLoadingNeighbourIssues, setIsLoadingNeighbourIssues] = useState<boolean>(false);
  const [isLoadingMpStats, setIsLoadingMpStats] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null); // Added for reCAPTCHA
  const [showEmailConfirmation, setShowEmailConfirmation] = useState<boolean>(false); // Added for email confirmation popup
  const tidiedLetterPreRef = useRef<HTMLPreElement>(null);
  const tidiedLetterTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [mpStats, setMpStats] = useState<MPStats | null>(null);
  const [startYear, setStartYear] = useState<number | null>(null);

 // Load reCAPTCHA script and generate token
 useEffect(() => {
  if (!RECAPTCHA_SITE_KEY) {
    console.error("reCAPTCHA site key is not set in environment variables");
    setError("reCAPTCHA configuration error. Please contact support.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
          .then((token: string) => {
            setRecaptchaToken(token);
          })
          .catch((err: Error) => {
            console.error("reCAPTCHA execute error:", err);
            setError("Failed to verify reCAPTCHA. Please try again.");
          });
      });
    } else {
      console.error("grecaptcha not available after script load");
      setError("reCAPTCHA failed to load. Please try again.");
    }
  };

  script.onerror = () => {
    console.error("Failed to load reCAPTCHA script");
    setError("Failed to load reCAPTCHA script. Please check your connection.");
  };

  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, []);

  useEffect(() => {
    console.log('showMpStats changed:', showMpStats);
  }, [showMpStats]);

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

  const handlePostcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    if (!formData.postcode.trim() || !postcodeRegex.test(formData.postcode.trim())) {
      setError("Please enter a valid UK postcode (e.g., SW1A 1AA).");
      return;
    }
    if (!recaptchaToken) {
      setError("reCAPTCHA verification failed. Please try again.");
      return;
    }
    setLoading(true);
    setError("");
    setMpDetails(null);
    setMpStats(null);
    setStartYear(null);
    setShowMpStats(false);
    try {
      const response = await fetch(`/api/getMP?postcode=${formData.postcode}`, {
        headers: {
          "X-Recaptcha-Token": recaptchaToken,
        },
      });
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
        const startYear = parseInt(lines["startyear"]) || 2024;
        if (
          parsedDetails.name === "Unknown" &&
          parsedDetails.party === "Unknown" &&
          parsedDetails.constituency === "Unknown" &&
          parsedDetails.email === "Unknown"
        ) {
          setError("No MP found for this postcode. Please recheck your entry and try again.");
        } else {
          setMpDetails(parsedDetails);
          setStartYear(startYear);
          console.log("startYear set to:", startYear);
          await fetchMpStats();
        }
      }
    } catch (err) {
      setError("An error occurred while fetching MP details. Please try again or check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
      // Refresh reCAPTCHA token after submission
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
          .then((token: string) => {
            setRecaptchaToken(token);
          });
      });
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
    // Sanitize inputs before sending to API
    const sanitizedLetter = DOMPurify.sanitize(letter);
    const sanitizedFullName = DOMPurify.sanitize(formData.fullName);
    const sanitizedAddress = DOMPurify.sanitize(formData.address);
    const sanitizedEmail = DOMPurify.sanitize(formData.userEmail);

    if (
      sanitizedLetter !== letter ||
      sanitizedFullName !== formData.fullName ||
      sanitizedAddress !== formData.address ||
      sanitizedEmail !== formData.userEmail
    ) {
      setError("Your input contains potentially harmful content. Please remove any scripts or HTML tags and try again.");
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

  const summarizeText = (text: string, maxLength: number = 100): string => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  };

// Part 3

  const handleEmailYourMP = async () => {
    if (!mpDetails || !tidiedLetter || !formData.fullName || !formData.userEmail || !liabilityConsent) {
      setError("Please ensure you have generated and tidied a message, provided your details, and agreed to the disclaimer.");
      return;
    }
    setShowEmailConfirmation(true); // Show confirmation popup
  };

const confirmEmailYourMP = async () => {
  setShowEmailConfirmation(false);

  // Add null check for mpDetails
  if (!mpDetails) {
    setError("MP details are missing. Please search for your MP again.");
    return;
  }

  const result = await insertLetter({
    postcode: getOutwardCode(formData.postcode),
    issue: formData.issue,
    customIssue: formData.customIssue,
    problem: formData.problem,
    solution: formData.solution,
    constituency: mpDetails.constituency, // Now safe to access
  });

  if (!result.success) {
    setError(result.error || "Failed to save engagement data, but you can still send your email.");
  }

  const subject = `Message from constituent regarding ${formData.issue}`;
  const body = encodeURIComponent(isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter);
  window.open(`mailto:${mpDetails.email}?subject=${encodeURIComponent(subject)}&body=${body}`, "_blank"); // Now safe to access
  setEmailSent(true);
  setTimeout(() => setEmailSent(false), 5000);
};

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };

  const generateScreenshot = async () => {
    if (!tidiedLetterPreRef.current || !tidiedLetter) return null;
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
      throw new Error("Could not determine the end of the message body.");
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
    const originalContent = tidiedLetterPreRef.current.innerText;
    tidiedLetterPreRef.current.innerText = sanitizedLetter;
    await new Promise((resolve) => setTimeout(resolve, 2500));
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts && tidiedLetterPreRef.current?.innerText !== sanitizedLetter) {
      console.log(`Attempt ${attempts + 1}: Tidied Message Ref`, tidiedLetterPreRef.current?.innerText);
      await new Promise((resolve) => setTimeout(resolve, 250));
      attempts++;
    }
    console.log("Tidied Message Ref Before Screenshot (Final):", tidiedLetterPreRef.current?.innerText);
    console.log("Sanitized Message:", sanitizedLetter);
    try {
      const canvas = await html2canvas(tidiedLetterPreRef.current, {
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
      tidiedLetterPreRef.current.innerText = originalContent;
      return { blob, sanitizedLetter };
    } catch (err) {
      console.error("Failed to generate screenshot or copy to clipboard:", err);
      tidiedLetterPreRef.current.innerText = originalContent;
      throw err;
    }
  };

  const handleShareOnFacebook = async () => {
    try {
      await generateScreenshot();
      alert("Screenshot of the tidied message copied to clipboard! Paste it into your Facebook post (use Ctrl+V or Cmd+V).");
      const url = window.location.href;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, "_blank", "width=600,height=400");

} catch {
  setError("Couldn’t generate screenshot or copy to clipboard. Sharing text only.");
  const url = window.location.href;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, "_blank", "width=600,height=400");
}
  };

  const handleShareOnX = async () => {
    try {
      const result = await generateScreenshot();
      if (!result) return;
      alert("Screenshot of the tidied message copied to clipboard! Paste it into your X post (use Ctrl+V or Cmd+V).");
      const url = window.location.href;
      const text = `I wrote to my MP about ${formData.issue.split(" - ")[0]} using DM My MP. Join me in making your voice heard!`;
      const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(xUrl, "_blank", "width=600,height=400");
    } catch {
      setError("Couldn’t generate screenshot or copy to clipboard. Sharing text only.");
      const url = window.location.href;
      const text = `I wrote to my MP about ${formData.issue.split(" - ")[0]} using DM My MP. Join me in making your voice heard!`;
      const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      window.open(xUrl, "_blank", "width=600,height=400");
    }
  };

  const handleShareOnLinkedIn = async () => {
    try {
      const result = await generateScreenshot();
      if (!result) return;
      alert("Screenshot of the tidied message copied to clipboard! Paste it into your LinkedIn post (use Ctrl+V or Cmd+V).");
      const url = window.location.href;
      const title = `I Wrote to My MP About ${formData.issue.split(" - ")[0]}`;
      const summary = `Using DM My MP, I sent a letter to my MP to address ${formData.issue.split(" - ")[0]}. Join me in engaging with your representative to make a difference!`;
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
      window.open(linkedInUrl, "_blank", "width=600,height=400");
    } catch {
      setError("Couldn’t generate screenshot or copy to clipboard. Sharing text only.");
      const url = window.location.href;
      const title = `I Wrote to My MP About ${formData.issue.split(" - ")[0]}`;
      const summary = `Using DM My MP, I sent a letter to my MP to address ${formData.issue.split(" - ")[0]}. Join me in engaging with your representative to make a difference!`;
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
      window.open(linkedInUrl, "_blank", "width=600,height=400");
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

// Part 4

  const fetchEngagementData = async () => {
    try {
      const response = await fetch("/api/getEngagementData");
      if (!response.ok) throw new Error("Failed to fetch engagement data");
      const data = await response.json();
      setEngagementData(data);
      setShowTrendsModal(true);
    } catch (err) {
      console.error("Failed to fetch engagement data:", err);
      setError("Failed to fetch engagement trends");
    }
  };

  const getCurrentStep = () => {
    if (tidiedLetter) return 3;
    if (mpDetails) return 2;
    return 1;
  };

  const fetchMpStats = async () => {
    if (!mpDetails?.name || !mpDetails?.constituency) {
      console.log('fetchMpStats skipped: missing mpDetails');
      return;
    }
    setIsLoadingMpStats(true);
    setError("");
    try {
      const response = await fetch(
        `/api/fetchMpStats?name=${encodeURIComponent(mpDetails.name)}&constituency=${encodeURIComponent(mpDetails.constituency)}`
      );
      if (!response.ok) throw new Error(`Failed to fetch MP stats: ${response.status}`);
      const data = await response.json();
      console.log("fetchMpStats response:", data);
      setMpStats(data);
      if (data.startYear) {
        setStartYear(data.startYear);
        console.log("startYear set to:", data.startYear);
      } else {
        console.warn("startYear not found in fetchMpStats response, using fallback");
        setStartYear(null);
      }
    } catch (err) {
      setError("Failed to load MP stats");
      setMpStats(null);
      setStartYear(null);
      console.error("fetchMpStats error:", err);
    } finally {
      setIsLoadingMpStats(false);
    }
  };

  const MIN_LETTERS_THRESHOLD = 10; // Minimum letters required to show trends

  const getNeighbourIssues = (engagementData: EngagementData | null, constituency: string | undefined) => {
    if (!engagementData || !constituency) return [];
    const localLetters = engagementData.recentLetters.filter(
      (letter) => letter.constituency.toLowerCase() === constituency.toLowerCase()
    );
    if (localLetters.length < MIN_LETTERS_THRESHOLD) return []; // Enforce minimum threshold
    const issueCounts: { [key: string]: number } = {};
    localLetters.forEach((letter) => {
      const issue = letter.customIssue || letter.issue.split(" - ")[0];
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
    const totalLocalLetters = localLetters.length;
    const localIssues = Object.entries(issueCounts).map(([issue, count]) => ({
      issue,
      localConcern: Math.round((count / totalLocalLetters) * 100),
    }));
    const nationalAverages: { [key: string]: number } = {
      "Government Overreach": 30, "Government Accountability": 25, "Cost of Living": 50, "Healthcare": 45,
      "Social Care & Welfare": 35, "Education": 30, "Housing": 35, "Jobs & Economy": 25,
      "Community & Cohesion": 20, "Crime & Safety": 30, "Public Transport & Roads": 30, "Environment": 25,
    };
    return localIssues.map((item) => ({
      issue: item.issue,
      localConcern: item.localConcern,
      nationalConcern: nationalAverages[item.issue] || 20,
    }));
  };

  const neighbourIssues = getNeighbourIssues(engagementData, mpDetails?.constituency);
  const neighbourIssuesChartData = {
    labels: neighbourIssues.length > 0 ? neighbourIssues.map((item) => item.issue) : ["No Data"],
    datasets: [
      {
        label: "Local Concern (%)",
        data: neighbourIssues.length > 0 ? neighbourIssues.map((item) => item.localConcern) : [0],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "National Average (%)",
        data: neighbourIssues.length > 0 ? neighbourIssues.map((item) => item.nationalConcern) : [0],
        backgroundColor: "rgba(200, 200, 200, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };

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
      { problem: "I’m concerned about arrests for peaceful protests under hate speech laws.", solution: "Advocate for clearer hate speech definitions to protect free expression." },
      { problem: "Online criticism is being unfairly targeted by broad legal interpretations.", solution: "Push for amendments to ensure laws don’t suppress legitimate speech." },
      { problem: "Local events have seen police overreach in managing public dissent.", solution: "Support guidelines to limit police action to actual threats, not opinions." },
      { problem: "I’ve noticed people being fined for social media posts about politics.", solution: "Propose a public debate to refine online speech rules." },
      { problem: "In my area, expressing views at public meetings feels risky.", solution: "Encourage community forums with legal oversight." },
      { problem: "I’ve heard of friends silenced by vague speech laws.", solution: "Suggest a citizen-led review of speech legislation." },
    ],
    "Government Accountability - (Policy transparency, Online Safety Act concerns, government oversight)": [
      { problem: "The Online Safety Act’s impact isn’t clear to constituents.", solution: "Press for public reports on how policies affect our community." },
      { problem: "Decisions seem made without local input or explanation.", solution: "Call for regular town halls to improve transparency." },
      { problem: "Oversight of government actions feels weak in our area.", solution: "Advocate for stronger independent reviews of policy effects." },
      { problem: "I’ve noticed local policies announced with no prior consultation.", solution: "Propose a citizen feedback app for policy drafts." },
      { problem: "In my town, budget cuts lack clear justification.", solution: "Suggest open Q&A sessions with local officials." },
      { problem: "I’ve seen online laws confuse residents about their rights.", solution: "Encourage a simplified online rights guide." },
    ],
    "Cost of Living - (Food prices, energy bills, financial pressures)": [
      { problem: "Energy bills are soaring, straining local families.", solution: "Support energy cost subsidies for low-income households." },
      { problem: "Food prices in our shops are outpacing wages.", solution: "Push for tax relief on essentials to ease financial pressure." },
      { problem: "Rising rents are pushing people out of our community.", solution: "Advocate for rent caps or more affordable housing options." },
      { problem: "I’ve struggled to heat my home this winter.", solution: "Propose a community energy-sharing scheme." },
      { problem: "In my area, grocery costs make it hard to feed my family.", solution: "Suggest local food co-ops to reduce prices." },
      { problem: "I’ve noticed friends cutting back due to rising costs.", solution: "Encourage a barter network for essential goods." },
    ],
    "Healthcare - (NHS staff shortages, NHS waiting times, access to services)": [
      { problem: "NHS waiting times are delaying care for local patients.", solution: "Increase funding to hire more healthcare staff locally." },
      { problem: "GP appointments are hard to book in our area.", solution: "Support incentives to attract doctors to our constituency." },
      { problem: "Specialist services are too far away for many residents.", solution: "Push for mobile clinics or better transport to healthcare." },
      { problem: "I’ve waited months for a doctor’s appointment.", solution: "Propose a telemedicine pilot for routine checkups." },
      { problem: "In my town, elderly neighbors can’t access urgent care.", solution: "Suggest a neighborhood health volunteer network." },
      { problem: "I’ve seen friends struggle with mental health support delays.", solution: "Encourage peer-support groups with MP backing." },
    ],
    "Social Care & Welfare - (Access delays, quality concerns, funding shortfalls)": [
      { problem: "Elderly locals wait months for care assessments.", solution: "Advocate for more funding to speed up care access." },
      { problem: "Care quality varies widely in our community.", solution: "Support stricter standards and oversight for care providers." },
      { problem: "Welfare delays are leaving families in hardship.", solution: "Press for faster processing of welfare claims locally." },
      { problem: "I’ve seen a relative wait too long for home care.", solution: "Propose a care scheduling app for quicker matches." },
      { problem: "In my area, care homes have inconsistent standards.", solution: "Suggest peer reviews by local care users." },
      { problem: "I’ve noticed friends struggling with delayed benefits.", solution: "Encourage a community welfare advice hotline." },
    ],
    "Education - (Teacher shortages, funding pressure, youth services)": [
      { problem: "Teacher shortages are disrupting our schools.", solution: "Support recruitment bonuses to bring in more educators." },
      { problem: "School budgets can’t cover basic supplies here.", solution: "Push for increased per-pupil funding in our area." },
      { problem: "Youth services have shrunk, leaving kids with few options.", solution: "Advocate for restoring local youth programs." },
      { problem: "I’ve noticed my child’s class has no art supplies.", solution: "Propose a school swap program for unused materials." },
      { problem: "In my area, kids lack after-school activities.", solution: "Suggest community-led youth clubs using existing spaces." },
      { problem: "I’ve seen teachers overstretched at my kid’s school.", solution: "Encourage a parent-teacher mentoring initiative." },
    ],
    "Housing - (Affordability, homelessness, social housing)": [
      { problem: "Rents are unaffordable for many in our constituency.", solution: "Support building more social housing locally." },
      { problem: "Homelessness is rising on our streets.", solution: "Push for emergency shelters and support services." },
      { problem: "Young families can’t buy homes here anymore.", solution: "Advocate for affordable homeownership schemes." },
      { problem: "I’ve struggled to find a flat I can afford.", solution: "Propose a tenant-landlord mediation service." },
      { problem: "In my town, homeless people sleep near my home.", solution: "Suggest a community outreach program for support." },
      { problem: "I’ve seen young couples leave due to housing costs.", solution: "Encourage shared housing schemes for first-timers." },
    ],
    "Jobs & Economy - (Employment opportunities, local economy stagnation)": [
      { problem: "Job openings are scarce in our area.", solution: "Encourage investment in local job creation programs." },
      { problem: "Small businesses are closing due to high costs.", solution: "Support tax breaks or grants for local startups." },
      { problem: "Young people are leaving for work elsewhere.", solution: "Push for training schemes to keep talent here." },
      { problem: "I’ve lost my job and can’t find new work locally.", solution: "Propose a skills-sharing network among locals." },
      { problem: "In my area, shops keep shutting down.", solution: "Suggest a local business mentoring program." },
      { problem: "I’ve noticed teens leaving for city jobs.", solution: "Encourage remote work hubs in our community." },
    ],
    "Community & Cohesion - (Immigration, integration issues, local service strain)": [
      { problem: "Service strain is causing tension in our community.", solution: "Fund expanded services to match population needs." },
      { problem: "New residents struggle to integrate locally.", solution: "Support community programs to foster inclusion." },
      { problem: "Language barriers limit access to local help.", solution: "Advocate for English language training to improve integration." },
      { problem: "I’ve seen long waits at my local clinic due to population growth.", solution: "Propose a community health info day." },
      { problem: "In my area, new families feel isolated.", solution: "Suggest a welcome buddy system with locals." },
      { problem: "I’ve noticed concerns about illegal immigration affecting trust.", solution: "Encourage a public forum to discuss integration policies fairly." },
    ],
    "Crime & Safety - (Local crime, policing, community safety)": [
      { problem: "Petty crime is rising in our neighborhoods.", solution: "Support more police patrols in high-crime areas." },
      { problem: "Anti-social behavior is unsettling residents.", solution: "Push for community initiatives to address youth behavior." },
      { problem: "Poor lighting increases safety fears at night.", solution: "Advocate for better street lighting locally." },
      { problem: "I’ve had my bike stolen near my home.", solution: "Propose a neighborhood watch app for reporting." },
      { problem: "In my area, teens are causing trouble at night.", solution: "Suggest a youth dialogue group with community leaders." },
      { problem: "I’ve noticed dark streets feel unsafe.", solution: "Encourage a resident-led safety audit." },
    ],
    "Public Transport & Roads - (Transport access, road maintenance, reliability)": [
      { problem: "Buses are unreliable, stranding commuters.", solution: "Press for improved bus schedules and funding." },
      { problem: "Potholes are damaging cars and risking safety.", solution: "Support road repair budgets for our area." },
      { problem: "Rural areas lack decent transport links.", solution: "Advocate for better rural bus routes." },
      { problem: "I’ve missed work due to late buses.", solution: "Propose a commuter feedback system for schedules." },
      { problem: "In my town, potholes ruined my car tires.", solution: "Suggest a community pothole reporting map." },
      { problem: "I’ve seen no buses to my village.", solution: "Encourage a carpool network for rural residents." },
    ],
    "Environment - (Sustainability, pollution, green spaces)": [
      { problem: "Air pollution is worsening local health.", solution: "Promote stricter emissions controls in our area." },
      { problem: "Green spaces are shrinking due to development.", solution: "Push for protections on local parks and fields." },
      { problem: "Litter is piling up in our community.", solution: "Support more clean-up efforts and bins locally." },
      { problem: "I’ve noticed smog affecting my breathing.", solution: "Propose a community air quality monitoring project." },
      { problem: "In my area, a park is being built over.", solution: "Suggest a petition to redesignate it as protected." },
      { problem: "I’ve seen rubbish overflow near my street.", solution: "Encourage a local litter swap initiative." },
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
                <strong>About This Tool:</strong> This is a free, independent tool to help UK citizens voice concerns to MPs. We store anonymized message content (e.g., issue, problem) and the first part of your postcode to analyze local concerns, but not your personal details (e.g., name, email). See our <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link>.
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
  Note: This app uses reCAPTCHA to prevent spam, rate limiting to stop abuse, and input sanitization to block harmful content.
</div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Find My MP"}
                </button>
              </div>
              {error && <p className="text-red-500 mt-4 text-center dark:text-red-400">{error}</p>}
            </div>
            <footer className="mt-8 text-center text-gray-600 dark:text-gray-300">
  <p>
    <Link href="/terms-of-use" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Terms of Use</Link> |{" "}
    <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link> |{" "}
    <Link href="/free-speech" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Your Free Speech Rights</Link> |{" "}
    <Link href="/faq" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">FAQ</Link>
  </p>
</footer>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900">
            <div className="flex justify-center mb-6">
              <h1 className="text-3xl font-bold text-black dark:text-white text-center">Send a DM to Your MP - Beta</h1>
            </div>
            <p className="text-sm text-yellow-600 mb-4 dark:text-yellow-400 text-center">
              This is a beta version—please report issues to <a href="mailto:dmmymp@gmail.com" className="underline">feedback</a>.
            </p>
            <ProgressIndicator currentStep={getCurrentStep()} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-4 border rounded bg-gray-100 text-black dark:bg-gray-800 dark:text-white dark:border-gray-700">
                <p className="text-sm text-gray-700 mb-4 dark:text-gray-300">
                  <strong>About This Tool:</strong> A free, independent way to contact your MP. We store anonymized message content (e.g., issue, problem) and the first part of your postcode to analyze local concerns, but not your personal details (e.g., name, email). See our <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link>.
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
                <button
                  onClick={() => {
                    console.log("Button clicked, setting showMpStats to true, mpStats:", mpStats);
                    setShowMpStats(true);
                    if (!mpStats) fetchMpStats();
                  }}
                  className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoadingMpStats}
                >
                  {isLoadingMpStats ? "Loading..." : "See What My MP Cares About"}
                </button>
                <button
                  onClick={() => {
                    if (!engagementData) {
                      setIsLoadingNeighbourIssues(true);
                      fetchEngagementData().then(() => {
                        setShowNeighbourIssues(true);
                        setIsLoadingNeighbourIssues(false);
                      }).catch(() => {
                        setIsLoadingNeighbourIssues(false);
                      });
                    } else {
                      setShowNeighbourIssues(true);
                    }
                  }}
                  className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-800 dark:bg-purple-600 dark:hover:bg-purple-700 mb-4"
                  disabled={isLoadingNeighbourIssues}
                >
                  {isLoadingNeighbourIssues ? "Loading..." : "See What My Neighbours Care About"}
                </button>
                <button
                  onClick={fetchEngagementData}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 mb-4"
                >
                  See Engagement Trends
                </button>
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
                  <span className="text-black dark:text-white">I consent to my data being used to generate and send this message, and for anonymized message content and the first part of my postcode to be stored for engagement analysis.</span>
                </label>
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Disclaimer</h3>
                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  You are responsible for your message’s content, which must comply with UK laws (e.g., Public Order Act 1986, Online Safety Act 2023). We store anonymized message content (e.g., issue, problem, solution) and the first part of your postcode to analyze local and national concerns, but not your personal details (e.g., name, email). We do not review or endorse your content. See our <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link> for details.
                </p>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={liabilityConsent}
                    onChange={(e) => setLiabilityConsent(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-black dark:text-white">I acknowledge that I am solely responsible for my message’s content and agree to the terms, including storage of anonymized message content and the first part of my postcode.</span>
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
                  helpText="Do not include sensitive personal information (e.g., health, financial data) unless necessary, as this will be sent to your MP."
                />
                <TextAreaField
                  label="Solution (Optional)"
                  value={formData.solution}
                  onChange={(value) => updateFormData("solution", value)}
                  placeholder={getSolutionPlaceholder(formData.issue)}
                />
                <TextAreaField
                  label="Personal Solution (Optional)"
                  value={formData.personalSolution}
                  onChange={(value) => updateFormData("personalSolution", value)}
                  placeholder="Add a personal suggestion (optional, ensure it’s legal)"
                />
                {letter && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Generated Message</h3>
                    <pre className="p-4 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 whitespace-pre-wrap">{letter}</pre>
                    <button
                      onClick={handleTidyLetter}
                      className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={tidyLoading || !liabilityConsent}
                    >
                      {tidyLoading ? "Tidying..." : "Tidy My Message"}
                    </button>
                  </div>
                )}
                {showLegalReminder && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md text-black dark:text-white">
                      <h3 className="text-lg font-semibold mb-4">Legal Reminder</h3>
                      <p className="mb-4">
                        Your message must comply with UK laws (e.g., Public Order Act 1986, Online Safety Act 2023). We store anonymized message content (e.g., issue, problem, solution) and the first part of your postcode to analyze local and national concerns, but not your personal details (e.g., name, email). You are responsible for your content, which we do not review or endorse. See our <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link>.
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={confirmTidyLetter}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                          I Understand, Proceed
                        </button>
                        <button
                          onClick={() => setShowLegalReminder(false)}
                          className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {tidiedLetter && (
  <div className="p-4 border rounded bg-gray-100 text-black dark:bg-gray-800 dark:text-white dark:border-gray-700">
    <h3 className="text-lg font-semibold mb-2">Tidied Message</h3>
    {isEditingTidiedLetter ? (
      <textarea
        ref={tidiedLetterTextareaRef}
        value={editedTidiedLetter}
        onChange={(e) => handleEditedTidiedLetterChange(e.target.value)}
        className="w-full p-4 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 min-h-[300px] whitespace-pre-wrap"
      />
    ) : (
      <pre
        ref={tidiedLetterPreRef}
        className="p-4 border rounded bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-700 whitespace-pre-wrap"
      >
        {tidiedLetter}
      </pre>
    )}
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleEditToggle}
        className="w-1/2 bg-yellow-500 text-black p-2 rounded hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-white"
      >
        {isEditingTidiedLetter ? "Save Changes" : "Edit Message"}
      </button>
      <button
        onClick={() => handleCopyToClipboard(isEditingTidiedLetter ? editedTidiedLetter : tidiedLetter)}
        className="w-1/2 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
      >
        Copy to Clipboard
      </button>
    </div>
    <button
      onClick={handleEmailYourMP}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isEditingTidiedLetter || !liabilityConsent}
    >
      Email My MP
    </button>
    {emailSent && (
      <p className="text-green-500 mt-2 text-center dark:text-green-400">
        Your email has been opened for sending. Note that MPs may not respond immediately, and response times vary.{" "}
        <Link href="/faq" className="text-blue-600 hover:underline dark:text-blue-400">
          Learn more in our FAQ.
        </Link>
      </p>
    )}
    <button
      onClick={handleShareOnFacebook}
      className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-900 mt-4"
    >
      Share on Facebook
    </button>
    <button
      onClick={handleShareOnX}
      className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 mt-4"
    >
      Share on X
    </button>
    <button
      onClick={handleShareOnLinkedIn}
      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 mt-4"
    >
      Share on LinkedIn
    </button>
  </div>
)}

            </div>

            {mpDetails && mpStats && showMpStats && (
  <>
    {console.log('Rendering MpStatsModal, showMpStats:', showMpStats, 'mpDetails:', mpDetails, 'mpStats:', mpStats, 'startYear:', startYear)}
    <MpStatsModal
      isOpen={showMpStats}
      onClose={() => {
        console.log('MpStatsModal onClose called, setting showMpStats to false');
        setShowMpStats(false);
      }}
      mp={{
        name: mpDetails.name,
        constituency: mpDetails.constituency,
        party: mpDetails.party,
        email: mpDetails.email,
      }}
      stats={mpStats}
      startYear={startYear ?? undefined} // Convert null to undefined
      neighbourIssues={neighbourIssues}
    />
  </>
)}

            {showNeighbourIssues && engagementData && mpDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-2xl w-full text-black dark:text-white">
                  <h3 className="text-lg font-semibold mb-4">What Your Neighbours Care About in {mpDetails.constituency}</h3>
                  {neighbourIssues.length > 0 ? (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Data based on limited submissions and may not fully represent constituency views.
                      </p>
                      <Bar data={neighbourIssuesChartData} options={chartOptions} />
                      <ul className="list-disc list-inside mt-4">
                        {neighbourIssues.map((item, index) => (
                          <li key={index}>
                            <strong>{item.issue}:</strong> {item.localConcern}% locally vs {item.nationalConcern}% nationally
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>No local issues data available for {mpDetails.constituency}. We need at least {MIN_LETTERS_THRESHOLD} letters to display trends.</p>
                  )}
                  <button
                    onClick={() => setShowNeighbourIssues(false)}
                    className="mt-4 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {showEmailConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md text-black dark:text-white">
                  <h3 className="text-lg font-semibold mb-4">Confirm Sending Your Message</h3>
                  <p className="mb-4">
                    You are solely responsible for the content of your message, which must comply with UK laws (e.g., Public Order Act 1986, Online Safety Act 2023). We do not review or endorse your content. Are you sure you want to send this message to your MP?
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={confirmEmailYourMP}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Yes, Send
                    </button>
                    <button
                      onClick={() => setShowEmailConfirmation(false)}
                      className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showTrendsModal && engagementData && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-2xl w-full text-black dark:text-white">
                  <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
                  <p><strong>Total Letters Sent:</strong> {engagementData.totalLetters}</p>
                  <h4 className="font-semibold mt-4">Top Issues:</h4>
                  <ul className="list-disc list-inside">
                    {engagementData.topIssues.map((issue, index) => (
                      <li key={index}>
                        {issue.issue}: {issue.count} letters
                      </li>
                    ))}
                  </ul>
                  <h4 className="font-semibold mt-4">Recent Letters:</h4>
                  <ul className="list-disc list-inside">
                    {engagementData.recentLetters.slice(0, 5).map((letter, index) => (
                      <li key={index}>
                        {letter.issue} ({letter.postcode} area): {summarizeText(letter.problemShort)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setShowTrendsModal(false)}
                    className="mt-4 bg-gray-300 text-black p-2 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            {error && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg max-w-sm">
                <p>{error}</p>
                <button
                  onClick={() => setError("")}
                  className="mt-2 bg-white text-red-500 p-1 rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            )}
<footer className="mt-8 text-center text-gray-600 dark:text-gray-300">
  <p>
    <Link href="/terms-of-use" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Terms of Use</Link> |{" "}
    <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link> |{" "}
    <Link href="/free-speech" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">Your Free Speech Rights</Link> |{" "}
    <Link href="/faq" className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">FAQ</Link>
  </p>
</footer>
          </div>
        )}
      </div>
    </>
  );
}
