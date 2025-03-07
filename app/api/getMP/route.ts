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
    const filePath = path.join(process.cwd(), "app/data/mp_data.csv");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    const mpData = records.find((record: any) => record.postcode === postcode);

    if (!mpData) {
      return NextResponse.json({ error: "No MP found for this postcode" }, { status: 404 });
    }

    return NextResponse.json({ mpDetails: mpData });
  } catch (error) {
    console.error("Error reading MP data:", error);
    return NextResponse.json({ error: "Failed to fetch MP data" }, { status: 500 });
  }
}