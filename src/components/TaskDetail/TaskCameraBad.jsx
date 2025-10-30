import React, { useEffect, useRef } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

export default function TaskCamera({ handleCameraCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert(err);
      }
    };
    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      handleCameraCapture(blob);
    }, "image/png");
  };

  return (
    <Card sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Camera Preview</Typography>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", maxHeight: 400, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={captureImage}>
          Capture & Upload
        </Button>
      </CardContent>
    </Card>
  );
}
