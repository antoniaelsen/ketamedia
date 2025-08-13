import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MeshStandardMaterial,
  InstancedMesh,
  Vector3,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Raycaster,
  Vector2,
} from "three";
import { StarMetadata } from "../types";
import { getColorFromBV } from "../util/celestial";

export const InstancedStarField = ({
  stars,
  scale = 1,
}: {
  stars: StarMetadata[];
  scale?: number;
}) => {
  const ref = useRef<InstancedMesh>(null);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        emissive: "rgb(255, 255, 225)",
        emissiveIntensity: 0.25,
        transparent: false,
      }),
    []
  );
  const geometry = useMemo(
    () => new SphereGeometry(scale / 10, 24, 24),
    [scale]
  );

  useEffect(() => {
    if (!ref.current) return;

    stars.forEach((star, index) => {
      if (!ref.current) return;

      const { x, y, z } = star.position;
      const position = new Vector3(x, y, z);
      const scale = Math.max(0.1, 1 - star.magnitude / 8);
      const matrix = new Matrix4().compose(
        position,
        new Quaternion(),
        new Vector3(scale, scale, scale)
      );
      ref.current.setMatrixAt(index, matrix);
      ref.current.setColorAt(index, getColorFromBV(star.ci));
    });

    if (ref.current) {
      ref.current.instanceMatrix.needsUpdate = true;

      if (ref.current.instanceColor) {
        ref.current.instanceColor.needsUpdate = true;
      }
    }
  }, [stars]);

  const camera = useThree((state) => state.camera);

  const [_, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (ref.current) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(ref.current);

        if (intersects.length > 0) {
          const instanceId = intersects[0].instanceId;
          setHovered(instanceId !== undefined ? instanceId : null);
        } else {
          setHovered(null);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, stars.length]}
      frustumCulled={true}
    />
  );
};
