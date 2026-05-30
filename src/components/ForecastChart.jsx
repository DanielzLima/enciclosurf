"use client";

import { useState, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getDirectionFull } from "../utils/surfFormatters";

function SurfTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const dir = getDirectionFull(Number(d.direcao ?? 0));
  const windDir = getDirectionFull(Number(d.windDir ?? 0));

  return (
    <div style={{
      background: "rgba(10,15,30,0.97)",
      border: "1px solid rgba(56,189,248,0.25)",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 13,
      lineHeight: 1.8,
      minWidth: 160,
      pointerEvents: "none",
    }}>
      <p style={{ color: "#38bdf8", fontWeight: 700, marginBottom: 4 }}>{d.hora}</p>
      <p>🌊 {Number(d.swell).toFixed(1)}m · {d.periodo}s</p>
      <p>🧭 {dir.short} {dir.full}</p>
      {d.windSpeed && <p>💨 {d.windSpeed} km/h {windDir.short}</p>}
    </div>
  );
}

export default function ForecastChart({ data }) {
  const [diaAtivo, setDiaAtivo] = useState(0);

  if (!data?.length) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: 40 }}>
        Carregando previsão...
      </div>
    );
  }

  // Agrupa por dia
  const diasMap = {};
  data.forEach((d) => {
    const [datePart] = d.dataCompleta.split(" ");
    if (!diasMap[datePart]) diasMap[datePart] = [];
    diasMap[datePart].push(d);
  });
  const dias = Object.entries(diasMap);
  const dadosDia = dias[diaAtivo]?.[1] ?? [];
  const maxSwell = Math.max(...dadosDia.map((d) => d.swell ?? 0), 0.5);

  const hoje = new Date();
  function labelDia(index) {
    if (index === 0) return "Hoje";
    if (index === 1) return "Amanhã";
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + index);
    return d.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  }

  return (
    <div style={{ width: "100%" }}>

      {/* Seletor de dias */}
      <div style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 4,
        marginBottom: 14,
        scrollbarWidth: "none",
      }}>
        {dias.map(([datePart], i) => (
          <button
            key={datePart}
            onClick={() => setDiaAtivo(i)}
            style={{
              flexShrink: 0,
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              border: diaAtivo === i
                ? "1.5px solid #0ea5e9"
                : "1px solid rgba(255,255,255,0.1)",
              background: diaAtivo === i
                ? "rgba(14,165,233,0.15)"
                : "rgba(255,255,255,0.04)",
              color: diaAtivo === i ? "#38bdf8" : "#64748b",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {labelDia(i)}
          </button>
        ))}
      </div>

      {/* Info rápida */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 12,
        flexWrap: "wrap",
        fontSize: 12,
        color: "#64748b",
      }}>
        <span>🌊 Máx {Math.max(...dadosDia.map(d => d.swell)).toFixed(1)}m</span>
        <span>⏱️ {Math.round(dadosDia.reduce((a, d) => a + d.periodo, 0) / dadosDia.length)}s médio</span>
        {dadosDia[0]?.windSpeed && <span>💨 {dadosDia[0].windSpeed} km/h</span>}
      </div>

      {/* Gráfico — ResponsiveContainer adapta ao container pai */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={dadosDia}
          margin={{ top: 6, right: 6, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="swellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />

          <XAxis
            dataKey="hora"
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />

          <YAxis
            domain={[0, Math.ceil(maxSwell + 0.3)]}
            tickFormatter={(v) => `${v}m`}
            tick={{ fill: "#475569", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />

          <Tooltip content={<SurfTooltip />} />

          <Area
            type="monotone"
            dataKey="swell"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#swellGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#0ea5e9", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Mini cards dos 7 dias */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6,
        marginTop: 14,
      }}>
        {dias.slice(0, 7).map(([datePart, items], i) => {
          const maxH = Math.max(...items.map(d => d.swell));
          const isAtivo = i === diaAtivo;
          return (
            <button
              key={datePart}
              onClick={() => setDiaAtivo(i)}
              style={{
                background: isAtivo
                  ? "rgba(14,165,233,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: isAtivo
                  ? "1px solid rgba(14,165,233,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "6px 4px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 3, lineHeight: 1.2 }}>
                {labelDia(i).split(",")[0]}
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: maxH >= 1.5 ? "#0ea5e9" : maxH >= 0.8 ? "#94a3b8" : "#475569",
              }}>
                {maxH.toFixed(1)}m
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}