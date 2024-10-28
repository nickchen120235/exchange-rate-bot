import { Rate } from "./common.ts";

interface _Rate {
  Name: string;
  SBoardRate: string;
  SellDecreaseRate?: string;
}
interface ApiData {
  Date: string;
  Rates: _Rate[];
}

export async function fetchRate(): Promise<Rate> {
  const res = await fetch(
    "https://www.esunbank.com/api/client/ExchangeRate/LastRateInfo",
    { method: "POST" },
  );
  if (!res.ok) throw new Error(`Esun backend returned status ${res.status}`);
  const data: ApiData = await res.json();
  const rate = data.Rates.find((r) => r.Name === "日圓");
  if (!rate) throw new Error("Failed to find Esun rate for 日圓");
  return {
    bank: "esun",
    rate: parseFloat(rate.SellDecreaseRate ?? rate.SBoardRate),
    time: Date.now(),
  };
}
