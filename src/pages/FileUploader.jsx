import { useRef } from "react";

export function FileUploader({
  accept,
  label,
  helper,
  onFile,
  file,
}) {
  const inputRef = useRef(null);

  function handleFile(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFile(selectedFile);
    }
  }

  return (
    <div
      className="upload-box"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleFile}
      />

      <div className="upload-content">
        <div className="upload-icon">☁</div>

        <h3>
          {file ? file.name : label}
        </h3>

        <p>
          {file
            ? `Selected file: ${file.name}`
            : helper}
        </p>
      </div>
    </div>
  );
}