"use client";
import { useState } from "react";
import { Info, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import type { PredictionResult } from "@/lib/prediction";

interface ForecastItem {
  menuItemId: string;
  menuItemName: string;
  category: string | null;
  typicalPortions: number;
  prediction: PredictionResult;
  todayPrepared?: number | null;
  todaySold?: number | null;
}

interface ForecastDashboardProps {
  forecasts: ForecastItem[];
  weather: string;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? "#4A7C4E" : value >= 60 ? "#E8A54B" : "#C0504D";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--color-bg)" }}>
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

function WhyTooltip({ factors }: { factors: PredictionResult["factors"] }) {
  const [open, setOpen] = useState(false);
  const weatherEmoji = { sunny: "☀️", cloudy: "⛅", rainy: "🌧️" }[factors.weather] ?? "🌤️";
  const trendIcon = factors.trendFactor > 1.05 ? <TrendingUp size={12} style={{ color: "#4A7C4E" }} /> : factors.trendFactor < 0.95 ? <TrendingDown size={12} style={{ color: "#C0504D" }} /> : <Minus size={12} style={{ color: "var(--color-text-secondary)" }} />;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>
        <Info size={12} /> Why?
      </button>
      {open && (
        <div className="absolute right-0 top-6 z-20 w-64 p-4 rounded-xl shadow-lg border text-xs space-y-2" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Prediction Factors</p>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>14-day avg sales</span>
              <span className="font-medium" style={{ color: "var(--color-text)" }}>{factors.historicalAvg} portions</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>Day of week ({factors.dayOfWeek})</span>
              <span className="font-medium" style={{ color: factors.dayOfWeekFactor >= 1 ? "#4A7C4E" : "#C0504D" }}>×{factors.dayOfWeekFactor}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>Weather {weatherEmoji}</span>
              <span className="font-medium" style={{ color: factors.weatherFactor >= 1 ? "#4A7C4E" : "#C0504D" }}>×{factors.weatherFactor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: "var(--color-text-secondary)" }}>3-day trend</span>
              <span className="font-medium flex items-center gap-1" style={{ color: factors.trendFactor >= 1 ? "#4A7C4E" : "#C0504D" }}>
                {trendIcon} ×{factors.trendFactor}
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t" style={{ borderColor: "var(--color-border)" }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Higher variance in your data reduces confidence. Variance: {factors.variance}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ForecastCard({ item }: { item: ForecastItem }) {
  const [expanded, setExpanded] = useState(false);
  const { prediction } = item;
  const surplus = item.todayPrepared ? item.todayPrepared - (item.todaySold ?? 0) : null;
  const hasSurplus = surplus !== null && surplus > 0;

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{item.menuItemName}</h3>
            {item.category && <span className="badge badge-gray">{item.category}</span>}
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Typical: {item.typicalPortions} portions
          </p>
        </div>
        <WhyTooltip factors={prediction.factors} />
      </div>

      {/* Prediction numbers */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
            {prediction.predicted}
          </div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Predicted</div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: "var(--color-bg)" }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: "#E8A54B", fontFamily: "Fraunces, serif" }}>
            {prediction.recommendedPrepare}
          </div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Recommend</div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: hasSurplus ? "#fde8e8" : "var(--color-bg)" }}>
          <div className="text-xl font-bold tabular-nums" style={{ color: hasSurplus ? "var(--color-danger)" : "var(--color-text-secondary)", fontFamily: "Fraunces, serif" }}>
            {item.todayPrepared ?? "—"}
          </div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Prepared</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>
          <span>Confidence</span>
          <span>Range: {prediction.low}–{prediction.high}</span>
        </div>
        <ConfidenceBar value={prediction.confidence} />
      </div>

      {/* Surplus alert */}
      {hasSurplus && (
        <div className="mt-3 p-2.5 rounded-lg flex items-center gap-2" style={{ background: "#fef0e6" }}>
          <span className="text-xs font-medium" style={{ color: "#b35a1f" }}>
            ⚠️ {surplus} portion{surplus !== 1 ? "s" : ""} surplus today
          </span>
          <a href="/restaurant/surplus" className="ml-auto text-xs font-semibold hover:underline" style={{ color: "#b35a1f" }}>Log →</a>
        </div>
      )}
    </div>
  );
}

export function ForecastDashboard({ forecasts, weather }: ForecastDashboardProps) {
  const weatherNote = {
    sunny: "Good turnout expected — sunny weather drives foot traffic.",
    cloudy: "Average demand expected today.",
    rainy: "Lower turnout expected — rainy weather reduces demand by ~25%.",
  }[weather] ?? "";

  const totalPredicted = forecasts.reduce((s, f) => s + f.prediction.predicted, 0);
  const totalRecommended = forecasts.reduce((s, f) => s + f.prediction.recommendedPrepare, 0);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="card p-4 flex flex-wrap gap-6 items-center">
        <div>
          <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-primary)" }}>{totalPredicted}</div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Total portions predicted</div>
        </div>
        <div>
          <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "#E8A54B" }}>{totalRecommended}</div>
          <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Recommended to prepare</div>
        </div>
        <div className="flex-1 ml-2">
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>💡 {weatherNote}</p>
        </div>
      </div>

      {/* Item cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {forecasts.map((item) => (
          <ForecastCard key={item.menuItemId} item={item} />
        ))}
      </div>
    </div>
  );
}
