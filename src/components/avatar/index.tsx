import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Euler, Matrix4, SkinnedMesh } from "three";

const Avatar = forwardRef<
  { updatePredictionResult: (data: FaceLandmarkerResult | undefined) => void },
  {}
>(({}, ref) => {
  const { scene } = useGLTF(
    "https://models.readyplayer.me/6507df7f6054ce87a8531101.glb?morphTargets=ARKit",
    undefined,
    true
  );
  const [faceLandmarkerResult, setFaceLandmarkerResult] = useState<
    FaceLandmarkerResult | undefined
  >(undefined);
  const { nodes } = useGraph(scene);

  useImperativeHandle(ref, () => ({
    updatePredictionResult(data) {
      setFaceLandmarkerResult(data);
    },
  }));

  useFrame((_, delta) => {
    if (
      faceLandmarkerResult &&
      faceLandmarkerResult.facialTransformationMatrixes &&
      faceLandmarkerResult.facialTransformationMatrixes.length > 0 &&
      faceLandmarkerResult.faceBlendshapes &&
      faceLandmarkerResult.faceBlendshapes.length > 0
    ) {
      const faceRotationMatrix = new Matrix4().fromArray(
        faceLandmarkerResult.facialTransformationMatrixes![0].data
      );
      const faceRotation = new Euler().setFromRotationMatrix(
        faceRotationMatrix
      );
      nodes.Head.rotation.set(
        faceRotation.x / 3,
        faceRotation.y / 3,
        faceRotation.z / 3
      );
      nodes.Neck.rotation.set(
        faceRotation.x / 3,
        faceRotation.y / 3,
        faceRotation.z / 3
      );
      const headMesh = nodes.Wolf3D_Head as SkinnedMesh;
      const teethMesh = nodes.Wolf3D_Teeth as SkinnedMesh;
      console.log(nodes);
      if (
        faceLandmarkerResult.faceBlendshapes[0].categories &&
        faceLandmarkerResult.faceBlendshapes[0].categories.length > 0 &&
        headMesh &&
        !!headMesh.morphTargetDictionary &&
        !!headMesh.morphTargetInfluences
      ) {
        faceLandmarkerResult.faceBlendshapes[0].categories.forEach(
          ({ categoryName, score }) => {
            let matchingHeadIndex =
              headMesh.morphTargetDictionary![categoryName];
            if (matchingHeadIndex >= 0) {
              headMesh.morphTargetInfluences![matchingHeadIndex] = score;
            }
            let matchingTeethIndex =
              teethMesh.morphTargetDictionary![categoryName];
            if (matchingTeethIndex >= 0) {
              teethMesh.morphTargetInfluences![matchingTeethIndex] = score;
            }
          }
        );
      }
    }
  });

  return <primitive object={scene} scale={10} position={[0, -16, 0]} />;
});

Avatar.displayName = "Avatar";

export default Avatar;
