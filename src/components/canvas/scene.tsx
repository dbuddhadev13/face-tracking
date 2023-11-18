"use client";
import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { FunctionComponent } from "react";
import { r3fTunnel } from "@/helper/tunnel";

const Scene: FunctionComponent<any> = ({ ...props }) => {
  return (
    <Canvas {...props}>
      <r3fTunnel.Out />
      <Preload all />
    </Canvas>
  );
};

export default Scene;
