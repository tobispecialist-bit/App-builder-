import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AdmZip from "adm-zip";

const router = express.Router();

const sysPrompt = `You are an expert code generator.
Task: Given user's requirements, return a JSON object strictly in this shape:
{
  "appName": "string",
  "summary": "short summary",
  "files": [
    {"path": "relative/path/filename.ext", "content": "file content as string"}
  ]
}
Rules:
- Only valid JSON. No markdown, no backticks, no commentary.
- Include a minimal README.md describing how to run the generated app.
- Keep paths within the project root, do not use absolute paths.
- If the user asks for a web app, ensure an index.html (or a framework bootstrap) exists.
- For Node/Express apps, include package.json/scripts if needed.
- Prefer lightweight, working starters. No external keys in code.
- If frameworks are requested (React, Flask, Express, Next.js, Tailwind), include the minimal setup.
- Keep the number of files reasonable for a quick demo.
`;

function safeJSONParse(text) {
  try { return JSON.parse(text); } catch (e) { return null; }
}

router.post("/", async (req, res) => {
  const { appName, description, target, frameworks, includeAuth } = req.body || {};
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing GEMINI_API_KEY on server" });

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = [
      sysPrompt,
      "User request:",
      JSON.stringify({ appName, description, target, frameworks, includeAuth }, null, 2)
    ].join("\n\n");

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = safeJSONParse(text);
    if (!data || !Array.isArray(data.files)) {
      return res.status(400).json({
        error: "Model returned unparseable output",
        raw: text
      });
    }

    const zip = new AdmZip();
    data.files.forEach(f => {
      const p = String(f.path || "").replace(/^\/+/, "");
      if (!p || p.includes("..")) return;
      zip.addFile(p, Buffer.from(String(f.content || ""), "utf-8"));
    });

    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${(data.appName||"app")}.zip"`);
    res.send(zipBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

export default router;
