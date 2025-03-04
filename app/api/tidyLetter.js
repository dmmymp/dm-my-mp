import { exec } from "child_process";
import path from "path";

export async function POST(req) {
  try {
    const { letter } = await req.json();

    if (!letter) {
      return new Response(JSON.stringify({ error: "Letter content is required." }), { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), "mistral_tidy_letter.py");
    const safeLetter = JSON.stringify(letter);
    const command = `python3 "${scriptPath}" ${safeLetter}`;

    return new Promise((resolve) => {
      exec(command, (error, stdout) => {// Removed stderr from callback
        if (error) {
          console.error("Execution error:", error);
          return resolve(new Response(JSON.stringify({ error: "Failed to tidy the letter." }), { status: 500 }));
        }

        if (!stdout.trim()) {
          return resolve(new Response(JSON.stringify({ error: "No response from Mistral model." }), { status: 500 }));
        }

        resolve(new Response(JSON.stringify({ tidiedLetter: stdout.trim() }), { status: 200 }));
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    return new Response(JSON.stringify({ error: "Server error while processing the letter." }), { status: 500 });
  }
}