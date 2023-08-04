import { Line } from "@react-three/drei";
import { Color, Vector3 } from "three";
import { useAudioStore } from "../../../store/audio";

export const TimeDomain = (props) => {
  const time = useAudioStore((state: any) => state.time);

  const sample = time[0] || [];

  const points = sample.map((value: number, i: number) => {
    return new Vector3(i / sample.length, value, 0);
  });

  const vertexColors = sample.map((value: number, i: number) => {
    return new Color(`hsl(${(value * 360 + 180) % 360}, 100%, 50%)`).toArray();
  });

  return (
    <group {...props}>
      <group scale={[5, 2, 1]} position={[-2.5, -1, 0]}>
        <Line
          points={[
            [1, 1, 0],
            [1, 0, 0],
            [0, 0, 0],
            [0, 1, 0],
            [1, 1, 0],
          ]}
          color="rgb(75, 75, 75)"
          lineWidth={2}
        />
        {points.length && (
          <Line
            color="white"
            position={[0, 0, 0]}
            points={points}
            vertexColors={vertexColors}
          />
        )}
      </group>
    </group>
  );
};
