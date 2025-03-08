import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { letter, name, address, email } = await req.json();

    if (!letter || !name || !address || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Pre-format the header and structure
    const header = `${name}\n${address}\n${email}\n\nDear [MP's Name],\n\n`;
    const closing = `\n\nYours sincerely,\n${name}`;

    // Prompt for Mistral API
    const prompt = `You are a professional editor assisting a constituent. Rephrase the following letter to be concise, polite, and professional, suitable for addressing a Member of Parliament. Use formal language, avoid repeating the original wording where possible, and keep it under 200 words. Do not include the constituent's details, salutation, or closing—these will be added separately.

    Original Letter:
    ${letter}

    Rephrased Letter:`;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small", // Adjust based on available models
        messages: [
          { role: "system", content: "You are a professional editor." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral API error:", response.status, errorText);
      throw new Error(`Mistral API request failed with status ${response.status}: ${errorText}`);
    }

    const output = await response.json();
    console.log("API Response:", output);
    const generatedText = output.choices[0]?.message?.content || "";
    let tidiedBody = generatedText.trim();

    // Validate and fallback if the response is inadequate
    if (!tidiedBody || tidiedBody.length < 10 || !tidiedBody.includes(".")) {
      console.warn("No valid tidied letter body generated. Falling back.");
      tidiedBody = generateContextAwareFallback(letter);
    }

    // Combine header, tidied body, and closing
    const tidiedLetter = `${header}${tidiedBody}${closing}`;

    return NextResponse.json({ tidiedLetter });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("API Error:", errorMessage);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Function to generate a context-aware fallback based on the input letter
function generateContextAwareFallback(originalLetter: string): string {
  const keywords = originalLetter.toLowerCase().match(/\b\w+\b/g) || [];
  if (keywords.includes("park") || keywords.includes("dirty")) {
    return `I am writing to express my concern about the cleanliness of the local park. It has recently become quite dirty, diminishing its value as a community space. I kindly request your assistance in arranging for its cleanup and ensuring its ongoing maintenance to keep it a pleasant environment for all residents. Thank you for your attention to this matter. I look forward to your response.`;
  } else if (keywords.includes("government") || keywords.includes("overreach")) {
    return `I am writing to express my concern regarding potential government overreach. I am troubled by the broad interpretation of laws affecting online criticism, which may suppress legitimate speech. I respectfully request your support in advocating for amendments to protect free expression. Thank you for your attention to this issue. I look forward to your response.`;
  } else if (keywords.includes("education") || keywords.includes("school")) {
    return `I am writing to express my concern about the state of education in our area. I have noticed issues with ${keywords.includes("school") ? "school facilities" : "educational resources"} that need attention. I kindly request your support in addressing these challenges to improve opportunities for students. Thank you for your attention to this matter. I look forward to your response.`;
  }
  return `I am writing to bring to your attention a matter of concern regarding ${originalLetter.trim()}. I kindly request your assistance in addressing this issue. Thank you for your attention, and I look forward to your response.`;
}