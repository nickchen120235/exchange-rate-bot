import { Rate } from "./common.ts";

interface _Rate {
  DataValue3: string; // bank sell - we want this
  DataValue4: string; // key - we check this
}

interface ApiData {
  SubInfo: _Rate[];
}

/**
 * Note that this API may be unavailable outside of business hours.
 */
export async function fetchRate(): Promise<Rate> {
  const res = await fetch(
    "https://mma.sinopac.com/ws/share/rate/ws_exchange.ashx?exchangeType=REMIT",
  );
  if (!res.ok) throw new Error(`Sinopac backend returned status ${res.status}`);
  const [data] = (await res.json()) as [ApiData];
  const rate = data.SubInfo.find((r) => r.DataValue4 === "JPY");
  if (!rate) throw new Error("Failed to find Sinopac rate for 日圓");
  return {
    bank: "sinopac",
    rate: parseFloat(rate.DataValue3) - 0.0006,
    time: Date.now(),
  };
}
