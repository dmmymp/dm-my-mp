import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json({ error: "No postcode provided" }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "gpt4all_script.py");
    const pythonProcess = spawn("python3", [scriptPath, postcode]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (err) => {
      console.error("Python error:", err.toString());
      reject(new Error("Python script error")); // Reject on error
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else if (!data.trim()) {
        resolve(NextResponse.json({ error: "No data received from Python script" }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ mpDetails: data.trim() }));
      }
    });
  });
}