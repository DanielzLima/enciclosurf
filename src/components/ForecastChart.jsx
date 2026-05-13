"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function ForecastChart({ data }) {
  return (
    <div style={{ marginTop: "20px" }}>

      <h3>Previsão de Ondas</h3>

      <div className="chart-wrapper">

        <ResponsiveContainer width="100%" height={220}>

          <LineChart data={data}>

            <XAxis dataKey="dia" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="onda"
              stroke="#0ea5e9"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}