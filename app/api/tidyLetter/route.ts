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

    const prompt = `Rephrase the following letter to be concise, polite, and professional, suitable for addressing a Member of Parliament. Include the constituent's name, address, and email at the top, followed by a formal salutation (e.g., "Dear [MP's Name],"). Keep the letter under 300 words and end with a closing like "Yours sincerely, [Name]".

Constituent Details:
Name: ${name}
Address: ${address}
Email: ${email}

Original Letter:
${letter}

Tidied Letter (output between ===BEGIN=== and ===END===):
===BEGIN===
[Tidied letter here]
===END===`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/t5-base",
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
      throw new Error("Hugging Face API request failed");
    }

    const output = await response.json();
    const generatedText = output[0]?.generated_text || "";
    const match = generatedText.match(/===BEGIN===([\s\S]*?)===END===/);
    const tidiedLetter = match ? match[1].trim() : null;

    if (!tidiedLetter) {
      console.warn("No tidied letter found in output.");
      return NextResponse.json({
        tidiedLetter: "⚠️ Model returned no response.",
      });
    }

    return NextResponse.json({ tidiedLetter });
  } catch (err) {
    console.error("API Error:", err.message || err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}