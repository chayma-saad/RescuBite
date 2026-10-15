"use client";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";

interface ChartRow {
  date: string;
  predicted: number;
  actual: number;
  accuracy: number;
}

export function HistoryCharts({ data }: { data: ChartRow[] }) {
  const avgAccuracy = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.accuracy, 0) / data.length) : 0;

  return (
    <div className="space-y-6">
      {/* Accuracy score */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "#4A7C4E" }}>{avgAccuracy}%</div>
          <div className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Average forecast accuracy (14 days)</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-primary)" }}>
            {data.length > 0 ? Math.round(data.reduce((s, d) => s + d.actual, 0) / data.length) : 0}
          </div>
          <div className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Avg. daily portions sold</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: "Fraunces, serif", color: "var(--color-accent)" }}>
            {data.filter(d => d.accuracy >= 80).length}/{data.length}
          </div>
          <div className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Days with ≥80% accuracy</div>
        </div>
      </div>

      {/* Predicted vs Actual */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4" style={{ color: "var(--color-text)" }}>Predicted vs Actual Demand</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6B6B" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} />
            <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E8E3DC", fontFamily: "Inter, sans-serif", fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="predicted" stroke="#3D5A3D" strokeWidth={2} dot={false} name="Predicted" />
            <Line type="monotone" dataKey="actual" stroke="#E07856" strokeWidth={2} dot={false} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy bars */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4" style={{ color: "var(--color-text)" }}>Daily Forecast Accuracy</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6B6B" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B6B6B" }} unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, "Accuracy"]} contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E8E3DC", fontSize: "12px" }} />
            <ReferenceLine y={80} stroke="#E8A54B" strokeDasharray="4 4" label={{ value: "80% target", fill: "#E8A54B", fontSize: 11 }} />
            <Bar dataKey="accuracy" fill="#3D5A3D" radius={[3, 3, 0, 0]} name="Accuracy" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
