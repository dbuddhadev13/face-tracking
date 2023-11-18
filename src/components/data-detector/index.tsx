import {
  FaceLandmarker,
  FaceLandmarkerResult,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { forwardRef, useEffect, useState } from "react";

const DataDetector = forwardRef<
  any,
  {
    webcamRef: HTMLVideoElement | null;
    updatePrediction: (data: FaceLandmarkerResult) => void;
  }
>(({ webcamRef, updatePrediction }, ref) => {
  const [faceLandmarkerInstance, setFaceLandmarkerInstance] = useState<
    FaceLandmarker | undefined
  >(undefined);

  const setup = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
        delegate: "CPU",
      },
      runningMode: "VIDEO",
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: true,
      numFaces: 10,
    });
    setFaceLandmarkerInstance(faceLandmarker);
  };

  useEffect(() => {
    if (webcamRef) {
      setup();
    }
  }, [webcamRef]);

  useEffect(() => {
    const predict = () => {
      if (faceLandmarkerInstance && !!webcamRef && !webcamRef.paused) {
        let nowInMs = Date.now();

        const predictionResult = faceLandmarkerInstance.detectForVideo(
          webcamRef,
          nowInMs
        );
        updatePrediction(predictionResult);
      }
      requestAnimationFrame(predict);
    };
    if (faceLandmarkerInstance) {
      predict();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceLandmarkerInstance, webcamRef]);

  return null;
});

DataDetector.displayName = "Data Detector";

export default DataDetector;
