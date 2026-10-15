export type WeatherCondition = "sunny" | "cloudy" | "rainy";

export interface PredictionFactors {
  historicalAvg: number;
  dayOfWeekFactor: number;
  weatherFactor: number;
  trendFactor: number;
  dayOfWeek: string;
  weather: WeatherCondition;
  variance: number;
}

export interface PredictionResult {
  predicted: number;
  confidence: number;
  factors: PredictionFactors;
  recommendedPrepare: number;
  low: number;
  high: number;
}

const DAY_OF_WEEK_FACTORS: Record<number, number> = {
  0: 1.1,  // Sun
  1: 0.85, // Mon
  2: 0.9,  // Tue
  3: 0.95, // Wed
  4: 1.0,  // Thu
  5: 1.15, // Fri
  6: 1.25, // Sat
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WEATHER_FACTORS: Record<WeatherCondition, number> = {
  sunny: 1.1,
  cloudy: 1.0,
  rainy: 0.75,
};

// Deterministic weather for a given date (no external API)
export function getWeatherForDate(date: Date): WeatherCondition {
  const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear();
  const options: WeatherCondition[] = ["sunny", "sunny", "cloudy", "rainy", "sunny", "cloudy", "sunny"];
  return options[seed % options.length];
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function variance(nums: number[], avg: number): number {
  if (nums.length < 2) return 0;
  return nums.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / nums.length;
}

export function predictDemand(
  salesHistory: { date: Date; sold: number; prepared: number }[],
  targetDate: Date = new Date()
): PredictionResult {
  const now = targetDate;
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const last14 = salesHistory
    .filter((r) => new Date(r.date) >= fourteenDaysAgo && new Date(r.date) < now)
    .map((r) => r.sold);

  const last3 = salesHistory
    .filter((r) => new Date(r.date) >= threeDaysAgo && new Date(r.date) < now)
    .map((r) => r.sold);

  const historicalAvg = last14.length > 0 ? average(last14) : 20;
  const recentAvg = last3.length > 0 ? average(last3) : historicalAvg;
  const trendFactor = historicalAvg > 0 ? recentAvg / historicalAvg : 1.0;
  const clampedTrend = Math.max(0.6, Math.min(1.4, trendFactor));

  const dayOfWeek = now.getDay();
  const dayOfWeekFactor = DAY_OF_WEEK_FACTORS[dayOfWeek] ?? 1.0;

  const weather = getWeatherForDate(now);
  const weatherFactor = WEATHER_FACTORS[weather];

  const raw = historicalAvg * dayOfWeekFactor * weatherFactor * clampedTrend;
  const predicted = Math.max(1, Math.round(raw));

  const dataVariance = variance(last14, historicalAvg);
  const cv = historicalAvg > 0 ? Math.sqrt(dataVariance) / historicalAvg : 0.5;
  const confidence = Math.max(0.4, Math.min(0.98, 1 - cv * 0.8)) * 100;

  const spread = Math.ceil(predicted * cv * 0.5);
  const low = Math.max(1, predicted - spread);
  const high = predicted + spread;

  // Recommend slightly less than predicted to minimize waste
  const recommendedPrepare = Math.round(predicted * 0.95);

  return {
    predicted,
    confidence: Math.round(confidence),
    factors: {
      historicalAvg: Math.round(historicalAvg * 10) / 10,
      dayOfWeekFactor,
      weatherFactor,
      trendFactor: Math.round(clampedTrend * 100) / 100,
      dayOfWeek: DAY_NAMES[dayOfWeek],
      weather,
      variance: Math.round(dataVariance * 10) / 10,
    },
    recommendedPrepare,
    low,
    high,
  };
}
