// api/openai.js
// Vercel serverless function that proxies requests to OpenAI REST API.
// Keeps the API key on the server (never exposed to the client).

import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // needed for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY not set on server");
    return res.status(500).json({ error: "Server misconfiguration: missing OpenAI key." });
  }

  // Check if task=transcribe query param is present
  const task = req.query.task;

  try {
    if (task === "transcribe") {
      // Handle audio transcription using Whisper
      const form = formidable({});
      const [fields, files] = await form.parse(req);
      const file = files.file?.[0];

      if (!file) {
        return res.status(400).json({ error: "No audio file uploaded" });
      }

      const fileStream = fs.createReadStream(file.filepath);

      const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: (() => {
          const fd = new FormData();
          fd.append("file", fileStream, file.originalFilename || "audio.webm");
          fd.append("model", "whisper-1");
          if (fields.language && fields.language[0] !== "auto") {
            fd.append("language", fields.language[0]);
          }
          return fd;
        })(),
      });

      if (!r.ok) {
        const text = await r.text();
        console.error("Whisper API error:", r.status, text);
        return res.status(502).json({ error: "OpenAI Whisper API error", detail: text });
      }

      const data = await r.json();
      return res.status(200).json(data);
    } else {
      // Handle chat/completion (default)
      const body = req.body || {};
      const { prompt, messages } = body;

      if (!prompt && !messages) {
        return res.status(400).json({ error: "Request must include `prompt` or `messages`." });
      }

      const payload = messages
        ? {
            model: "gpt-4o-mini",
            messages,
            max_tokens: 500,
          }
        : {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
          };

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const text = await r.text();
        console.error("Chat API error:", r.status, text);
        return res.status(502).json({ error: "OpenAI Chat API error", detail: text });
      }

      const data = await r.json();
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error("Server error calling OpenAI:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
