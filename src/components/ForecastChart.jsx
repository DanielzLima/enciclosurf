"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { formatWave, getDirectionFull } from "../utils/surfFormatters";

export default function ForecastChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>

        <XAxis dataKey="hora" />
        <YAxis />

        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;

            const d = payload[0].payload;

            const swell = Number(d.swell ?? 0);
            const energia = Number(d.energia ?? 0);
            const periodo = Number(d.periodo ?? 0);
            const direcao = Number(d.direcao ?? 0);

            const dir = getDirectionFull(direcao);

            return (
              <div className="tooltip">
                <p>
                  🌊 Swell: {formatWave(swell)} ({swell.toFixed(2)}m)
                </p>
                <p>⚡ Energia: {energia.toFixed(1)}</p>
                <p>⏱️ Período: {periodo}s</p>
                <p>🧭 Direção: {dir.short} - {dir.full}</p>
              </div>
            );
          }}
        />

        <Line
          type="monotone"
          dataKey="swell"
          stroke="#0ea5e9"
          strokeWidth={3}
        />

      </LineChart>
    </ResponsiveContainer>
  );
}