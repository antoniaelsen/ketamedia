import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { uniqBy } from "lodash";
import { Vector3 } from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import { Constellation, Position } from "../types";
import { Nametag } from "./Nametags";

const edgesToVector3 = (edges: [Position, Position][]) => {
  return edges
    .filter(([start, end]) => start && end)
    .map(([start, end]) => {
      return [
        new Vector3(start.x, start.y, start.z),
        new Vector3(end.x, end.y, end.z),
      ];
    });
};

const useHoverSelect = () => {
  const [selected, setSelected] = useState<boolean>(false);
  const onPointerEnter = useCallback(() => {
    setSelected(true);
  }, []);
  const onPointerLeave = useCallback(() => {
    setSelected(false);
  }, []);

  return { selected, onPointerEnter, onPointerLeave };
};

const Asterism = (props: {
  constellation: Constellation;
  opacity: number;
  showNametag: boolean;
}) => {
  const { constellation, opacity = 0.25, showNametag } = props;
  const { proper } = constellation;
  const { selected, onPointerEnter, onPointerLeave } = useHoverSelect();

  const color = "rgb(0, 200, 200)";

  const edges = useMemo(() => {
    const { edges } = constellation;
    if (!edges) return [];

    return edgesToVector3(edges);
  }, [constellation]);

  const center = useMemo(() => {
    const flat = edges.flat();
    const deduplicated = uniqBy(flat, (p: Vector3) => p.toString());
    const center = deduplicated.reduce(
      (acc: Vector3, p: Vector3) => acc.add(p),
      new Vector3(0, 0, 0)
    );

    return center.divideScalar(deduplicated.length);
  }, [edges]);

  return (
    <>
      {edges.map((pair, i) => (
        <group key={i}>
          <Line
            lineWidth={2}
            opacity={selected ? 0.25 : opacity}
            color={color}
            transparent
            points={pair}
          />
          <Line
            lineWidth={10}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            opacity={0}
            transparent
            points={pair}
          />

          {!!proper && (selected || showNametag) && (
            <Nametag
              key={i}
              color={color}
              proper={proper}
              position={center}
              transform={false}
            />
          )}
        </group>
      ))}
    </>
  );
};

export const Asterisms = (props: {
  constellations: Record<string, Constellation>;
  showNametags: boolean;
}) => {
  const { constellations, showNametags } = props;

  const opacity = useRef(0.1);
  useFrame((state) => {
    const { camera } = state;
    const dist = camera.position.distanceTo(new Vector3(0, 0, 0));

    opacity.current = Math.max(0.01, 0.1 - dist / 1000);
  });

  return (
    <>
      {Object.values(constellations)
        .filter((constellation) => constellation.edges?.length)
        .map((constellation) => (
          <Asterism
            key={constellation.key}
            showNametag={showNametags}
            constellation={constellation}
            opacity={opacity.current}
          />
        ))}
    </>
  );
};
