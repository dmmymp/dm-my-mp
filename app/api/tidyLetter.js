import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { letter, name, address, email } = await req.json();

  if (!letter || !name || !address || !email) {
    return NextResponse.json({ error: "Letter and user details are required." }, { status: 400 });
  }

  // Simple tidying: preserve the letter structure but ensure name, address, and email are included
  const tidiedLetter = letter
    .replace(/\n\s*\n/g, "\n\n") // Clean up extra newlines
    .trim()
    .replace("[Your Name]", name)
    .replace("[Your Address]", address)
    .replace("[Your Email]", email);

  return NextResponse.json({ tidiedLetter });
}