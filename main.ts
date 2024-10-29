import { loadDotEnv } from "./common.ts";
import discordHandler from "./discord.ts";

await loadDotEnv({ export: true });

Deno.serve(async (req) => {
  const url = new URL(req.url);
  switch (url.pathname) {
    case "/discord":
      return await discordHandler(req);
    case "/api": // TODO: Implement API endpoints for drawing rates
    default:
      return new Response("Not Found", { status: 404 });
  }
});
