import * as DC from "npm:discord-api-types@^0.37.67/v10";
import { verifyKey } from "npm:discord-interactions@^3.4.0";
import { getTarget, setTarget } from "./common.ts";

function verifyRequest(
  body: string,
  signature: string | null,
  timestamp: string | null,
): boolean {
  const key = Deno.env.get("DISCORD_PUBLIC_KEY");
  if (!key) {
    console.error("Missing DISCORD_PUBLIC_KEY environment variable");
    return false;
  }
  if (!signature || !timestamp) return false;
  return verifyKey(body, signature, timestamp, key);
}

function createResponse(status: number, content: object): Response {
  return new Response(JSON.stringify(content), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default async function (req: Request): Promise<Response> {
  const body = await req.text();
  const signature = req.headers.get("X-Signature-Ed25519");
  const timestamp = req.headers.get("X-Signature-Timestamp");
  if (!verifyRequest(body, signature, timestamp)) {
    return createResponse(401, { error: "Invalid request" });
  }
  const interaction = JSON.parse(body) as DC.APIInteraction;
  switch (interaction.type) {
    case DC.InteractionType.Ping:
      return createResponse(200, { type: DC.InteractionResponseType.Pong });
    case DC.InteractionType.ApplicationCommand: {
      const data = interaction
        .data as DC.APIChatInputApplicationCommandInteractionData;
      console.log(data);
      if (
        data.name !== "target" ||
        data.options?.[0].type !== DC.ApplicationCommandOptionType.Number
      ) {
        return createResponse(200, {
          type: DC.InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Recieved unknown command object\n\`\`\`json\n
            ${JSON.stringify(data)}
            \n\`\`\``,
          },
        });
      }
      await setTarget(data.options?.[0].value);
      return createResponse(200, {
        type: DC.InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Target is set to ${await getTarget()}`,
        },
      });
    }
    default:
      return createResponse(400, { error: "Invalid request" });
  }
}
