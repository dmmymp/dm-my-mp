import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { issue, constituency } = await req.json();

  if (!issue || !constituency) {
    return NextResponse.json({ error: "Issue and constituency are required." }, { status: 400 });
  }

  // Handle Government Overreach with multiple national suggestions
  if (issue === "Government Overreach – (Free speech restrictions, arrests for criticizing policies, hate speech laws)") {
    const problems = [
      "Across the UK, free speech restrictions under laws like the Online Safety Act 2023 and Public Order Act 1986 have led to arrests for social media posts criticizing government policies, raising concerns about censorship.",
      "Nationwide, the government’s broad interpretation of hate speech laws has resulted in prosecutions for peaceful protests and online criticism, threatening free speech across the UK.",
      "Throughout the UK, the Online Safety Act 2023’s content moderation rules have led to the removal of valid political speech, causing widespread concern about government control over online expression.",
    ];
    const solutions = [
      "Advocate for clearer definitions of hate speech and amendments to national laws to protect free expression for all UK citizens.",
      "Call for a review of national hate speech laws to ensure they don’t infringe on legitimate expression and protect democratic rights.",
      "Urge the government to revise the Online Safety Act 2023 to safeguard free speech while addressing harmful content, ensuring a national balance.",
    ];
    return NextResponse.json({
      problem: getRandomItem(problems),
      solution: getRandomItem(solutions),
    });
  }

  // Handle Government Accountability with multiple national suggestions
  else if (issue === "Government Accountability – (Policy transparency, Online Safety Act concerns, government oversight)") {
    const problems = [
      "Nationally, there’s a lack of transparency in government policies like the Online Safety Act 2023, leading to concerns about unchecked authority and censorship across the UK.",
      "Across the UK, the government’s lack of accountability in implementing the Online Safety Act 2023 has raised fears of overreach, with little public input on censorship rules.",
      "Nationwide, the government’s opaque decision-making on free speech laws, including the Public Order Act 1986 updates, has eroded trust in democratic processes across the UK.",
    ];
    const solutions = [
      "Push for greater transparency in national policy-making, including public consultations and independent oversight of laws affecting free speech.",
      "Demand public accountability mechanisms, such as parliamentary reviews and citizen panels, to oversee national policies like the Online Safety Act 2023.",
      "Advocate for national transparency reforms, including open policy drafts and public hearings, to restore trust in government accountability.",
    ];
    return NextResponse.json({
      problem: getRandomItem(problems),
      solution: getRandomItem(solutions),
    });
  } else {
    // For all other issues (local), use the Mistral AI suggestions via Python script
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), "get_suggestions.py");

      const pythonProcess = spawn("python3", [scriptPath, issue, constituency]);

      let data = "";
      pythonProcess.stdout.on("data", (chunk) => {
        data += chunk.toString();
      });

      pythonProcess.stderr.on("data", (err) => {
        console.error("Python error:", err.toString());
        reject(new Error("Python script error"));
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`));
        } else if (!data.trim()) {
          resolve(NextResponse.json({ error: "No suggestions generated." }, { status: 500 }));
        } else {
          const [problem, solution] = data.split("Solution:").map((str) => str.trim());
          resolve(
            NextResponse.json({
              problem: problem || "No problem description provided.",
              solution: solution || "No solution provided.",
            })
          );
        }
      });
    });
  }
}