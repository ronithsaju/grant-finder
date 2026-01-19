import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Supabase Client
// Ensure these are in your .env.local file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for backend access
);

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Retrieve Data from Supabase
    // We fetch all grants (or a filtered subset) to give Gemini context
    const { data: grants, error } = await supabase
      .from("grants") // Ensure your table is named 'grants'
      .select("*");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 400 });
    }

    // 2. Construct the Prompt for Gemini
    // We inject the retrieved grants into the prompt as "Context"    
    const systemPrompt = `
      You are an expert grant consultant for Singaporean organisations.
      
      USER ORGANISATION DESCRIPTION:
      "${prompt}"
      
      AVAILABLE GRANTS DATABASE (JSON):
      ${JSON.stringify(grants)}
      
      TASK:
      1. Analyze the user's description and needs.
      2. Select the most relevant grants from the database provided above.
      3. Return a JSON array of the selected grants with an extra "reasoning" field explaining why it fits. The other fields should remain unchanged.
      4. Limit the output to a maximum of 8 grants.

      OUTPUT FORMAT (JSON ONLY):
      [ { "grant_name": "...", "reasoning": "..." }, ... ]
    `;

    // 3. Generate Recommendations
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });
    const text = response.text;

    if (!text) {
      return NextResponse.json({ error: "No content generated" }, { status: 100 });
    }

    // Clean markdown formatting if Gemini adds it (e.g. ```json ... ```)
    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 300 });
  }
}