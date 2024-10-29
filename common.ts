import { DAY } from "jsr:@std/datetime/constants";

export interface Rate {
  bank: "esun" | "sinopac";
  rate: number;
  time: number;
}

export { load as loadDotEnv } from "jsr:@std/dotenv";

const kv = await Deno.openKv(Deno.env.get("KV_PATH"));

export async function saveRate(_rate: Rate): Promise<void> {
  const { bank, rate, time } = _rate;
  await kv.set(["rate", bank, time], rate, { expireIn: 30 * DAY });
}

export async function setTarget(target: number): Promise<void> {
  await kv.set(["config", "target"], target);
}

/**
 * @returns `null` if target is not set, otherwise the target rate
 */
export async function getTarget(): Promise<number | null> {
  const target = await kv.get<number>(["config", "target"]);
  return target.value;
}

export async function updateRecent(_rate: Rate): Promise<void> {
  const { bank, rate } = _rate;
  const { value } = await kv.get<number>(["recent", bank]);
  if (value === null || rate !== value) {
    await kv.set(["recent", bank], rate);
  }
}
