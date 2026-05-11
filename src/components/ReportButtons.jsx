"use client";

import { useState } from "react";

import {
  createReport
} from "../services/supabase/reportsService";

import {
  getSessionId
} from "../utils/session";

export default function ReportButtons({
  spotId
}) {

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleVote(type) {

    try {

      setLoading(true);

      let rating = 1;

      if (type === "good") {
        rating = 2;
      }

      if (type === "classic") {
        rating = 3;
      }

      const sessionId =
        getSessionId();

      const response =
        await createReport(
          spotId,
          rating,
          sessionId
        );

      setMessage(response.message);

      setTimeout(() => {
        setMessage("");
      }, 4000);

    } catch (err) {

      console.log(err);

      setMessage(
        "Erro ao enviar report."
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="report-wrapper">

      <div className="report-buttons">

        <button
          className="report-btn classic"
          onClick={() =>
            handleVote("classic")
          }
          disabled={loading}
        >
          🌊 Clássico
        </button>

        <button
          className="report-btn good"
          onClick={() =>
            handleVote("good")
          }
          disabled={loading}
        >
          🟡 Boas
        </button>

        <button
          className="report-btn flat"
          onClick={() =>
            handleVote("flat")
          }
          disabled={loading}
        >
          🔴 Flat
        </button>

      </div>

      {message && (

        <div className="report-message">

          {message}

        </div>
      )}

    </div>
  );
}