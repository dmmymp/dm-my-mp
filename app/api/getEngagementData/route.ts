import { NextResponse } from "next/server";
import { db } from "../../../db";
import { letters } from "../../../db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get total letters sent
    const totalLetters = await db
      .select({ count: sql<number>`count(*)` })
      .from(letters);

    // Get top issues
    const topIssues = await db
      .select({
        issue: letters.issue,
        count: sql<number>`count(*)`,
      })
      .from(letters)
      .groupBy(letters.issue)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    // Get letters by constituency
    const byConstituency = await db
      .select({
        constituency: letters.constituency,
        count: sql<number>`count(*)`,
      })
      .from(letters)
      .groupBy(letters.constituency)
      .orderBy(sql`count(*) DESC`);

    // Get letters by postcode (top 10 for brevity)
    const byPostcode = await db
      .select({
        postcode: letters.postcode,
        count: sql<number>`count(*)`,
      })
      .from(letters)
      .groupBy(letters.postcode)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // Fetch recent letters for detailed reporting
    const recentLetters = await db
      .select({
        postcode: letters.postcode,
        issue: letters.issue,
        customIssue: letters.customIssue,
        problemShort: letters.problemShort,
        solutionShort: letters.solutionShort,
        constituency: letters.constituency,
        sentAt: letters.sentAt,
      })
      .from(letters)
      .orderBy(sql`sent_at DESC`)
      .limit(50);

    return NextResponse.json({
      totalLetters: totalLetters[0].count,
      topIssues,
      byConstituency,
      byPostcode,
      recentLetters,
    });
  } catch (err) {
    console.error("Failed to fetch engagement data:", err);
    return NextResponse.json(
      { error: "Failed to fetch engagement data" },
      { status: 500 }
    );
  }
}