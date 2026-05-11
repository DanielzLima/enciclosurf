"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function ForecastChart({ data }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Previsão de Ondas</h3>

      <LineChart width={350} height={200} data={data}>
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
    </div>
  );
}