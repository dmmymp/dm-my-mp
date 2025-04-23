
"use client";

import React, { useState, useCallback } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import MpOverview from "./MpOverview";

interface MpData {
  error: any;
  name: string;
  constituency: string;
  party: string;
  email?: string;
  image?: string | null;
}

interface MpStatsData {
  error: any;
  mpId: string;
  votingRecord: { topic: string; votes: number }[];
  rebelliousVotes: number;
  voteAttendance: number | null;
  recentActivity: string[];
  topTopics: { [key: string]: number };
  policyPositions: { [key: string]: string };
  financialInterests: string[];
  votingAlignment: { topic: string; alignment: string }[];
  newMpMessage: string | null;
  ministerialRoles: { name: string; department: string; startDate: string; endDate: string | null }[];
}

const MpStatsPage: React.FC = () => {
  const [mp, setMp] = useState<MpData | null>(null);
  const [mpStats, setMpStats] = useState<MpStatsData | null>(null);
  const [postcode, setPostcode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleRecaptchaVerify = useCallback((token: string | null) => {
    setRecaptchaToken(token);
  }, []);

  const handleSearch = async () => {
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setError(null);
    try {
      const mpResponse = await fetch(`/api/getMP?postcode=${encodeURIComponent(postcode)}`, {
        headers: {
          "X-Recaptcha-Token": recaptchaToken,
        },
      });
      if (!mpResponse.ok) throw new Error(`Failed to fetch MP data: ${mpResponse.status} ${mpResponse.statusText}`);
      const mpData: MpData = await mpResponse.json();
      if (mpData.error) throw new Error(mpData.error);
      setMp(mpData);

      const statsResponse = await fetch(
        `/api/fetchMpStats?name=${encodeURIComponent(mpData.name)}&constituency=${encodeURIComponent(mpData.constituency)}`
      );
      if (!statsResponse.ok) throw new Error(`Failed to fetch MP stats: ${statsResponse.status} ${mpResponse.statusText}`);
      const statsData: MpStatsData = await statsResponse.json();
      if (statsData.error) throw new Error(statsData.error);
      setMpStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set in environment variables");
    }
    return (
      <div className="p-6 font-sans text-gray-900 bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Send a DM to Your MP - Beta</h1>
        <p className="mb-6 text-sm">This is a beta version—please report issues to feedback.</p>
        <p className="text-red-500">
          reCAPTCHA configuration error. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans text-gray-900 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Send a DM to Your MP - Beta</h1>
      <p className="mb-6 text-sm">This is a beta version—please report issues to feedback.</p>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter your postcode"
          className="p-2 border border-gray-300 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Find My MP
        </button>
      </div>

      <div className="mb-6">
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={handleRecaptchaVerify}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {mp && mpStats && (
        <MpOverview
          name={mp.name}
          constituency={mp.constituency}
          party={mp.party}
          roles={mpStats.ministerialRoles.map((role) => role.name)}
          speechCount={mpStats.recentActivity.length}
          debateRank={123}
          attendPercent={mpStats.voteAttendance || 0}
          attendRank={456}
          responseRate="Unknown"
          giftsSummary={mpStats.financialInterests.join('; ') || 'No declared interests'}
          votingRecord={mpStats.votingRecord}
          voteAttendance={mpStats.voteAttendance}
          votingAlignment={mpStats.votingAlignment}
          rebelliousVotes={mpStats.rebelliousVotes}
        />
      )}
    </div>
  );
};

export default MpStatsPage;