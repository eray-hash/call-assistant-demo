import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const ProtocolSchema = z.object({
  kernthemen: z.array(z.string()),
  vereinbarungen: z.array(z.string()),
  offene_punkte: z.array(z.string()),
  stimmung: z.string(),
  zusammenfassung: z.string(),
});

const SYSTEM_PROMPT = `Du unterstützt einen Berater bei der Dokumentation eines Beratungs- bzw. Verkaufstelefonats (Immobilien- und Finanzierungsberatung).
Lies das Gesprächstranskript, das dir als Nachricht geschickt wird, und leite daraus die strukturierten Felder eines Gesprächsprotokolls ab. Antworte auf Deutsch.
Wenn ein Punkt aus dem Transkript nicht hervorgeht, gib für Listenfelder ein leeres Array zurück bzw. für Textfelder einen kurzen Hinweis wie "nicht ersichtlich".`;

const client = new Anthropic();

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "invalid_request", message: "Ungültiges JSON" });
      return;
    }
  }

  const transcript = typeof body?.transcript === "string" ? body.transcript.trim() : "";
  if (!transcript) {
    res.status(400).json({ error: "invalid_request", message: "Transkript fehlt" });
    return;
  }
  if (transcript.length > 20000) {
    res.status(400).json({ error: "invalid_request", message: "Transkript zu lang" });
    return;
  }

  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: transcript }],
      output_config: { format: zodOutputFormat(ProtocolSchema) },
    });

    if (!response.parsed_output) {
      res.status(502).json({ error: "invalid_json" });
      return;
    }

    res.status(200).json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      res.status(500).json({ error: "server_misconfigured" });
    } else if (error instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "rate_limited" });
    } else if (error instanceof Anthropic.APIError) {
      res.status(502).json({ error: "upstream_error", status: error.status });
    } else {
      res.status(502).json({ error: "upstream_error" });
    }
  }
}
