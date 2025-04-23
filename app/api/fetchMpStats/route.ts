import { getVotingAlignments } from "@/lib/getVotingAlignments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const constituency = searchParams.get("constituency");

  if (!name || !constituency) {
    console.log("fetchMpStats API: Missing name or constituency", { name, constituency });
    return NextResponse.json({ error: "Missing name or constituency" }, { status: 400 });
  }

  try {
    console.log("fetchMpStats API: Calling getVotingAlignments for", { name, constituency });
    const data = await getVotingAlignments(name, constituency);
    console.log("fetchMpStats API: getVotingAlignments response", data);
    if (!data.profileSummary) {
      console.log("fetchMpStats API: profileSummary is undefined, data:", data);
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("fetchMpStats API: Error in getVotingAlignments:", error);
    return NextResponse.json({ error: "Failed to fetch MP stats" }, { status: 500 });
  }
}