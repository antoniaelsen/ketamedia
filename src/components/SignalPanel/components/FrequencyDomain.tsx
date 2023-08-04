import { Line } from "@react-three/drei";
import { useAudioStore } from "../../../store/audio";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { LineGeometry } from "three-stdlib";

const DB_OFFSET = 200;
const DB_RANGE = 200;

export const FrequencyDomain = (props: GroupProps) => {
  const ref = useRef<any>();

  const nodes = useAudioStore((state: any) => state.nodes);
  const { analyser } = nodes;

  const { points, vertexColors } = useMemo(() => {
    return {
      points: Array.from(new Array(1024), (_, i) => {
        return new THREE.Vector3(i / 1024, 0, 0);
      }),
      vertexColors: Array.from({ length: 1024 }, (_, i) => {
        return new THREE.Color("white").toArray();
      }),
    };
  }, [analyser]);

  useFrame(() => {
    if (!ref.current) return;
    if (!analyser) return;

    const n = analyser.frequencyBinCount;

    const freq = new Float32Array(n);
    analyser.getFloatFrequencyData(freq);

    const positions = [];
    for (let i = 0; i < n; i++) {
      positions.push(i / n, (freq[i] + DB_OFFSET) / DB_RANGE, 0);
    }

    const colors = [];
    for (let i = 0; i < n; i++) {
      const v = (freq[i] + DB_OFFSET) / DB_RANGE;
      const h = (1 - v) * 60;
      const color = new THREE.Color(`hsla(${h}, 100%, 50%)`).toArray();
      colors.push(...color);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    ref.current.geometry = geometry;
  });

  return (
    <group {...props}>
      <group scale={[5, 2, 1]} position={[-2.5, -1, 0]}>
        <Line
          ref={ref}
          color="white"
          lineWidth={2}
          points={points}
          vertexColors={vertexColors}
        />
      </group>
    </group>
  );
};
