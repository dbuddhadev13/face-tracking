"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useMeasure } from "react-use";

const WebcamVideo = forwardRef<
  HTMLVideoElement,
  { setIsLoaded: (data: boolean) => void }
>(({ setIsLoaded }, ref) => {
  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null!);
  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    if (width && height) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width,
            height,
            facingMode: "user",
          },
        })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsLoaded(true);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width]);

  return (
    <div
      className="fixed top-0 left-0 h-full w-full bg-white opacity-0"
      ref={containerRef}
    >
      <video
        ref={videoRef}
        muted={true}
        playsInline={true}
        controls={false}
        disablePictureInPicture={true}
        style={{
          objectFit: "cover",
          width,
          height,
        }}
        className={`absolute left-0 top-0 z-0 bg-transparent`}
      />
    </div>
  );
});

WebcamVideo.displayName = "WebcamVideo";

export default WebcamVideo;
