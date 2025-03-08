import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Define the interface for the MP data structure
interface MPRecord {
  Forename: string;
  Surname: string;
  "Name (Display as)": string;
  "Name (List as)": string;
  Party: string;
  Constituency: string;
  Email: string;
  "Address 1": string;
  "Address 2": string;
  Postcode: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get("postcode")?.toUpperCase().replace(/\s/g, "");

  if (!postcode) {
    return NextResponse.json({ error: "No postcode provided" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${postcode}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!postcodeResponse.ok) {
      return NextResponse.json({ error: "Invalid postcode or service unavailable" }, { status: 404 });
    }
    const postcodeData = await postcodeResponse.json();
    const constituency = postcodeData.result?.parliamentary_constituency;
    if (!constituency) {
      return NextResponse.json({ error: "No constituency found for this postcode" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "data/mp_data.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const records: MPRecord[] = parse(fileContent, { columns: true, skip_empty_lines: true });

    const mpData = records.find((record: MPRecord) => 
      record.Constituency.toLowerCase() === constituency.toLowerCase()
    );
    if (!mpData) {
      return NextResponse.json({ error: "No MP found for this constituency" }, { status: 404 });
    }

    const formattedData = [
      `name: ${mpData["Name (Display as)"]}`,
      `party: ${mpData.Party}`,
      `constituency: ${mpData.Constituency}`,
      `email: ${mpData.Email || "Not available"}`
    ].join("\n");

    return NextResponse.json({ mpDetails: formattedData });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error processing request:", errorMessage);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    return NextResponse.json({ error: "Failed to fetch MP data" }, { status: 500 });
  }
}