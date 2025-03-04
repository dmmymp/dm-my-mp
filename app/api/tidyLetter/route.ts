import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { letter, name, address, email } = await req.json();

    if (!letter || !name || !address || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const scriptPath = path.join(process.cwd(), "mistral_tidy_letter.py");
    const pythonProcess = spawn("python3", [
      scriptPath,
      JSON.stringify({ letter, name, address, email }),
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    const code = await new Promise((resolve) => {
      pythonProcess.on("close", resolve);
    });

    if (code !== 0) {
      console.error("Python script error:", errorOutput);
      return NextResponse.json({ error: "Error in Python script." }, { status: 500 });
    }

    // Extract tidied letter between ===BEGIN=== and ===END===
    const match = output.match(/===BEGIN===([\s\S]*?)===END===/);
    const tidiedLetter = match ? match[1].trim() : null;

    if (!tidiedLetter) {
      console.warn("No tidied letter found in output.");
      return NextResponse.json({ tidiedLetter: "⚠️ Model returned no response." });
    }

    return NextResponse.json({ tidiedLetter });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}