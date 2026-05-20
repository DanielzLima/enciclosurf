"use client";

import { useState } from "react";

import {
  createReport
} from "../services/supabase/reportsService";

import {
  getSessionId
} from "../utils/session";

import ReportTagsModal
  from "./ReportTagsModal";

import {
  saveReportTags
} from "../services/supabase/tagsService";

export default function ReportButtons({
  spotId
}) {

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [openTagsModal, setOpenTagsModal] =
    useState(false);

  const [selectedRating, setSelectedRating] =
    useState(null);

  // ABRE MODAL
  function handleVote(type) {

    let rating = 1;

    if (type === "good") {
      rating = 2;
    }

    if (type === "classic") {
      rating = 3;
    }

    setSelectedRating(rating);

    setOpenTagsModal(true);
  }

  // SALVA REPORT + TAGS
  async function handleSaveTags(
    selectedTags
  ) {

    try {

      setLoading(true);

      const sessionId =
        getSessionId();

      const response =
        await createReport(
          spotId,
          selectedRating,
          sessionId
        );

      if (!response.success) {

        setMessage(response.message);

        return;
      }

      await saveReportTags(
        response.report.id,
        selectedTags
      );

      setMessage(
        "Report enviado com sucesso 🌊"
      );

      setOpenTagsModal(false);

      setSelectedRating(null);

    } catch (err) {

      console.log(err);

      setMessage(
        "Erro ao enviar report."
      );

    } finally {

      setLoading(false);

      setTimeout(() => {
        setMessage("");
      }, 4000);
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

      <ReportTagsModal
        open={openTagsModal}
        onClose={() =>
          setOpenTagsModal(false)
        }
        onSave={handleSaveTags}
      />

    </div>

  );
}