
import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiter: max 5 requests per IP per hour
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 3600, // 1 hour
});

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    await rateLimiter.consume(ip);
  } catch {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // Optional: Add reCAPTCHA verification if desired
  /*
  const recaptchaToken = req.headers.get("X-Recaptcha-Token");
  if (!recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA token missing" }, { status: 400 });
  }

  const recaptchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    { method: "POST" }
  );
  const recaptchaData = await recaptchaResponse.json();

  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 403 });
  }
  */

  try {
    const { letter, name, address, email } = await req.json();

    if (!letter || !name || !address || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const header = `\n${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}\n\n`;
    const closing = `\n\n`;

    const prompt = `You are a professional editor assisting a constituent. Rephrase the following letter to be simple, concise, polite, and professional, suitable for addressing a Member of Parliament. Use formal language, keep short, remove unnecessary words. Focus only on the body of the letter. Include an appropriate salutation as they appear in the original letter based on the context of the original letter.

    Original Letter:
    ${letter}

    Rephrased Letter Body (under 500 words, clear and concise):`;

    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

      try {
        console.log("MISTRAL_API_KEY in process.env:", process.env.MISTRAL_API_KEY || "undefined");
        if (!process.env.MISTRAL_API_KEY) {
          console.error("MISTRAL_API_KEY is not defined in environment variables");
          throw new Error("MISTRAL_API_KEY is not defined");
        }
        console.log(`Attempt ${attempt}: Fetching from Mistral API`);
        response = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral-small",
            messages: [
              { role: "system", content: "You are a professional editor." },
              { role: "user", content: prompt },
            ],
            max_tokens: 400,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) break;
        const errorResponse = response.clone();
        const errorText = await errorResponse.text();
        console.error(`Mistral API error (attempt ${attempt}):`, response.status, errorText);
        if (response.status !== 429) break; // Don't retry on non-rate-limit errors
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      } catch (err) {
        clearTimeout(timeoutId);
        console.error(`Fetch attempt ${attempt} failed:`, err instanceof Error ? err.message : String(err));
        if (attempt === 3) throw err;
      }
    }

    if (!response || !response.ok) {
      const errorResponse = response?.clone() || { text: () => Promise.resolve("No response") };
      const errorText = await errorResponse.text();
      console.error("Final Mistral API failure:", response?.status, errorText);
      throw new Error(`Mistral API request failed: ${errorText}`);
    }

    const outputResponse = response.clone();
    const output = await outputResponse.json();
    console.log("API Response:", output);
    const generatedText = output.choices[0]?.message?.content || "";
    const tidiedBody = generatedText.trim();

    if (!tidiedBody || tidiedBody.length < 10 || !tidiedBody.includes(".")) {
      throw new Error("No valid tidied letter body generated.");
    }

    const tidiedLetter = `${header}${tidiedBody}${closing}`;
    return NextResponse.json({ tidiedLetter });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("API Error:", errorMessage, "Stack:", err instanceof Error ? err.stack : "N/A");
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}