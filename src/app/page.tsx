"use client";
import Avatar from "@/components/avatar";
import CanvasView from "@/components/canvas-view";
import DataDetector from "@/components/data-detector";
import WebcamVideo from "@/components/webcam-video";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useRef } from "react";
import { useBoolean } from "react-use";

const HomePage = () => {
  const webcamRef = useRef<HTMLVideoElement>(null!);
  const dataDetectorRef = useRef<{
    getPrediction: () => FaceLandmarkerResult | undefined;
  }>(null!);
  const avatarRef = useRef<{
    updatePredictionResult: (data: FaceLandmarkerResult | undefined) => void;
  }>(null!);
  const [isLoaded, setIsLoaded] = useBoolean(false);

  const updatePrediction = (data: FaceLandmarkerResult) => {
    avatarRef.current?.updatePredictionResult(data);
  };

  return (
    <div className="w-full min-h-screen h-full bg-emerald-300">
      <WebcamVideo ref={webcamRef} setIsLoaded={setIsLoaded} />
      {webcamRef.current && isLoaded && webcamRef.current && (
        <DataDetector
          webcamRef={webcamRef.current}
          ref={dataDetectorRef}
          updatePrediction={updatePrediction}
        />
      )}
      <CanvasView className="fixed top-0 left-0 w-full h-full min-h-screen">
        <ambientLight intensity={2} />
        <Avatar ref={avatarRef} />
      </CanvasView>
    </div>
  );
};

export default HomePage;
