import React, { useRef, useState } from "react";
import "./KYC.css";

interface KYCProps {
  onSubmit: (files: { video?: Blob; image?: Blob }) => void;
}

const KYC: React.FC<KYCProps> = ({ onSubmit }) => {
  const [mode, setMode] = useState<"video" | "image" | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: mode === "video",
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error accessing camera. Please check your permissions.");
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "vieo/webm" });
      setVideoBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setImageBlob(blob);
          }
        },
        "image/jpeg",
        0.95
      );
    }
  };

  const handleSubmit = () => {
    if (mode === "video" && !videoBlob) {
      setErrorMessage("please record a video first");
      return;
    }

    if (mode === "image" && !imageBlob) {
      setErrorMessage("Please capture an image first");
      return;
    }

    onSubmit({
      video: mode === "video" ? videoBlob! : undefined,
      image: mode === "image" ? imageBlob! : undefined,
    });
  };

  const selectMode = (selectedMode: "video" | "image") => {
    setMode(selectedMode);
    setVideoBlob(null);
    setImageBlob(null);
    startCamera();
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="kyc-container">
      <h2>Video /Image KYC</h2>

      {!mode && (
        <div className="mode-selection">
          <button onClick={() => selectMode("video")} className="mode-button">
            Video KYC
          </button>
          <button onClick={() => selectMode("image")} className="mode-button">
            Image KYC
          </button>
        </div>
      )}

      {mode && (
        <>
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-feed"
            />

            {mode === "video" && videoBlob && (
              <div className="preview-container">
                <h3>Video Preview</h3>
                <video
                  src={URL.createObjectURL(videoBlob)}
                  controls
                  className="preview-video"
                />
              </div>
            )}

            {mode === "image" && imageBlob && (
              <div className="preview-container">
                <h3>Image Preview</h3>
                <img
                  src={URL.createObjectURL(imageBlob)}
                  alt="Captured"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div className="control-panel">
            {mode === "video" && (
              <>
                {!recording ? (
                  <button
                    onClick={startRecording}
                    disabled={!stream}
                    className="control-button record"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="control-button stop"
                  >
                    Stop Recording
                  </button>
                )}
              </>
            )}

            {mode === "image" && (
              <button
                onClick={captureImage}
                disabled={!stream}
                className="control-button capture"
              >
                Capture Image
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={
                (mode === "video" && !videoBlob) ||
                (mode === "image" && !imageBlob)
              }
              className="control-button submit"
            >
              Submit
            </button>

            <button
              onClick={() => {
                stopCamera();
                setMode(null);
              }}
              className="control-button cancel"
            >
              Cancel
            </button>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </>
      )}
    </div>
  );
};

export default KYC;
