// src/lib/openaiService.js
// 🚫 Disabled real OpenAI API calls for demo
// ✅ This prevents "Missing credentials" error on Vercel

export async function askAI(prompt) {
  console.log("Mock OpenAI called with:", prompt);
  return "🤖 Demo response (no real API call)";
}
