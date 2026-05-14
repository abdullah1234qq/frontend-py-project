import { useState } from "react";

import { API_URL, api } from "../api/client";
import { AudioPlayer } from "../components/AudioPlayer.jsx";
import { FileUploader } from "../components/FileUploader.jsx";
import { GlowButton } from "../components/GlowButton.jsx";
import { NeonHeroMark } from "../components/NeonHeroMark.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { DownloadButton } from "../components/DownloadButton.jsx";
import { TranscriptCard } from "../components/TranscriptCard.jsx";
import { StatusAlert } from "../components/StatusAlert.jsx";

export function PdfToAudio() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [busy, setBusy] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  async function convert() {
    if (!file) {
      setMessage("Choose a PDF first.");
      return;
    }
    setBusy(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const response = await api.post("/pdf-to-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = `${API_URL}${response.data.audio_url}`;
      setAudioUrl(url);
      setOriginalText(response.data.original_text || "");
      setTranslatedText(response.data.translated_text || "");
      setMessage("Audio ready.");
    } catch (error) {
      setMessage(
        error.response?.data?.detail || error.message || "Conversion failed.",
      );
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className="work-page">
      <PageHeader
        title="PDF to Audio"
        copy="Upload a PDF and listen to the extracted text."
      />
      <NeonHeroMark tone="green" />
      <FileUploader
  accept="application/pdf"
  label="Tap to upload PDF"
  helper="PDF up to 200MB"
  onFile={setFile}
  file={file}
/>
      <div className="form-grid one">
        <label>
          <span>Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option>English</option>
            <option>Urdu</option>
            <option>Hindi</option>
            <option>French</option>
            <option>Spanish</option>
            <option>German</option>
            <option>Arabic</option>
          </select>
        </label>
      </div>

      {audioUrl ? (
        <AudioPlayer
          sourceUrl={audioUrl}
          file={{ name: "voice2pdf-audio.mp3" }}
        />
      ) : null}

      <div className="action-row">
        <GlowButton tone="green" onClick={convert} disabled={busy}>
          {busy ? "Generating..." : "Generate Audio"}
        </GlowButton>

        <DownloadButton
          url={audioUrl}
          filename="voice2pdf-audio.mp3"
          tone="green"
        >
          Download Audio
        </DownloadButton>
      </div>


      {originalText ? (
        <TranscriptCard title="Original Text" content={originalText} />
      ) : null}
      {translatedText ? (
        <TranscriptCard title="Translated Text" content={translatedText} />
      ) : null}

      {message ? (
        <StatusAlert
          message={message}
          type={message.toLowerCase().includes("failed") ? "error" : "success"}
        />
      ) : null}
    </div>
  );
}
