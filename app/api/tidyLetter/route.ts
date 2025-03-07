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

    const prompt = `Rephrase the following letter to be concise, polite, and professional, suitable for addressing a Member of Parliament. Include the constituent's name, address, and email at the top, followed by a formal salutation (e.g., "Dear [MP's Name],"). Use formal language, clear structure (e.g., introduction, concern, request, closing), and keep it under 300 words. End with "Yours sincerely, [Name]".

    Constituent Details:
    Name: ${name}
    Address: ${address}
    Email: ${email}

    Original Letter:
    ${letter}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", response.status, errorText);
      throw new Error(`Hugging Face API request failed with status ${response.status}: ${errorText}`);
    }

    const output = await response.json();
    console.log("API Response:", output); // Debug the raw response
    const generatedText = output[0]?.generated_text || "";
    let tidiedLetter = generatedText.trim();

    if (!tidiedLetter || tidiedLetter.length < 10) {
      console.warn("No valid tidied letter generated. Falling back.");
      tidiedLetter = `${name}\n${address}\n${email}\n\nDear [MP's Name],\n\n${letter.trim()}\n\nYours sincerely,\n${name}`;
    }

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