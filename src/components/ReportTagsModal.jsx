"use client";

import { useEffect, useState } from "react";

import {
  getReportTags
} from "../services/supabase/tagsService";

export default function ReportTagsModal({
  open,
  onClose,
  onSave
}) {

  const [tags, setTags] = useState([]);

  const [selectedTags, setSelectedTags] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {

    async function loadTags() {

      const data =
        await getReportTags();

      setTags(data || []);
    }

    if (open) {

      setSelectedTags([]);

      loadTags();
    }

  }, [open]);

  function toggleTag(tagId) {

    if (selectedTags.includes(tagId)) {

      setSelectedTags(
        selectedTags.filter(
          (id) => id !== tagId
        )
      );

      return;
    }

    if (selectedTags.length >= 3) {
      return;
    }

    setSelectedTags([
      ...selectedTags,
      tagId
    ]);
  }

  async function handleSubmit() {

    try {

      setLoading(true);

      await onSave(selectedTags);

      setSuccess(true);

      setTimeout(() => {

        setSelectedTags([]);

        setSuccess(false);

        onClose();

      }, 1200);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  }

  if (!open) return null;

  return (

    <div className="report-tags-overlay">

      <div className="report-tags-modal">

        <div className="report-tags-header">

          <h3>
            Escolha até 3 características
          </h3>

          <p>
            Como está o pico agora?
          </p>

        </div>

        <div className="report-tags-grid">

          {tags.map((tag) => (

            <button
              key={tag.id}
              type="button"
              onClick={() =>
                toggleTag(tag.id)
              }
              className={
                selectedTags.includes(tag.id)
                  ? "tag-btn active"
                  : "tag-btn"
              }
            >

              {tag.icone} {tag.nome}

            </button>

          ))}

        </div>

        <button
          className={`submit-report-btn ${
            success ? "success" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >

          {loading
            ? "Enviando..."
            : success
            ? "Report enviado 🌊"
            : "Enviar report"}

        </button>

      </div>

    </div>
  );
}