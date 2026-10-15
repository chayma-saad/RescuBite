"use client";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface WeeklyData {
  week: string;
  kgRescued: number;
  mealsRescued: number;
  revenueTND: number;
}

export function ImpactCharts({ data }: { data: WeeklyData[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Food rescued over time */}
      <div className="card p-6">
        <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Food Rescued (kg/week)</h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Weekly kg of food saved from waste</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3D5A3D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3D5A3D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6B6B6B" }} unit="kg" />
            <Tooltip formatter={(v) => [`${v}kg`, "Rescued"]} contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E8E3DC", fontSize: "12px" }} />
            <Area type="monotone" dataKey="kgRescued" stroke="#3D5A3D" fill="url(#greenGrad)" strokeWidth={2} name="kg Rescued" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue from surplus */}
      <div className="card p-6">
        <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Revenue from Surplus (TND/week)</h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Money earned from selling Rescue Bags</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6B6B6B" }} unit=" TND" />
            <Tooltip formatter={(v) => [`${v} TND`, "Revenue"]} contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E8E3DC", fontSize: "12px" }} />
            <Bar dataKey="revenueTND" fill="#E07856" radius={[4, 4, 0, 0]} name="Revenue (TND)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Meals rescued */}
      <div className="card p-6 lg:col-span-2">
        <h3 className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Meals Rescued vs Revenue</h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>Weekly meals saved alongside earnings</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#6B6B6B" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#6B6B6B" }} unit=" TND" />
            <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E8E3DC", fontSize: "12px" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar yAxisId="left" dataKey="mealsRescued" fill="#3D5A3D" radius={[3, 3, 0, 0]} name="Meals Rescued" />
            <Bar yAxisId="right" dataKey="revenueTND" fill="#E07856" radius={[3, 3, 0, 0]} name="Revenue (TND)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
