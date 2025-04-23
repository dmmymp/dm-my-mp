"use server"; // Mark this file as server-only

import { db } from "../db";
import { letters } from "../db/schema";

// Function to summarize text
const summarizeText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
};

// Server action to insert a letter into the database
export async function insertLetter(formData: {
  postcode: string;
  issue: string;
  customIssue?: string;
  problem: string;
  solution?: string;
  constituency: string;
}) {
  try {
    await db.insert(letters).values({
      postcode: formData.postcode.toUpperCase(),
      issue: formData.issue.split(" - ")[0],
      customIssue: formData.issue === "Other - (Specify your own issue)" ? formData.customIssue : null,
      problemShort: summarizeText(formData.problem),
      solutionShort: formData.solution ? summarizeText(formData.solution) : null,
      constituency: formData.constituency,
      sentAt: new Date(),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to save letter data:", err);
    return { success: false, error: "Failed to save engagement data" };
  }
}