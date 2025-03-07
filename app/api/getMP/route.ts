import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get("postcode")?.toUpperCase().replace(/\s/g, "");

  if (!postcode) {
    return NextResponse.json({ error: "No postcode provided" }, { status: 400 });
  }

  try {
    // Step 1: Query Postcodes.io for constituency
    const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    if (!postcodeResponse.ok) {
      return NextResponse.json({ error: "Invalid postcode or service unavailable" }, { status: 404 });
    }
    const postcodeData = await postcodeResponse.json();
    const constituency = postcodeData.result?.parliamentary_constituency;
    if (!constituency) {
      return NextResponse.json({ error: "No constituency found for this postcode" }, { status: 404 });
    }

    // Step 2: Load MP data from CSV
    const filePath = path.join(process.cwd(), "data/mp_data.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    // Step 3: Find MP for the constituency
    const mpData = records.find((record: any) => 
      record.Constituency.toLowerCase() === constituency.toLowerCase()
    );

    if (!mpData) {
      return NextResponse.json({ error: "No MP found for this constituency" }, { status: 404 });
    }

    // Step 4: Format response
    const formattedData = [
      `name: ${mpData["Name (Display as)"]}`,
      `party: ${mpData.Party}`,
      `constituency: ${mpData.Constituency}`,
      `email: ${mpData.Email || "Not available"}`
    ].join("\n");

    return NextResponse.json({ mpDetails: formattedData });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to fetch MP data" }, { status: 500 });
  }
}