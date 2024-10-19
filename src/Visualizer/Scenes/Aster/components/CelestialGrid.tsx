import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Color, Vector3, Matrix4 } from "three";
import { GroupProps } from "@react-three/fiber";
import { Nametag } from "./Nametags";

const kBaseScaleFactor = 1000;
const kLineWidth = 1.5;
const kRotationMatrix = new Matrix4().set(
  1,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  1
);
export interface CelestialGridProps extends GroupProps {
  color?: string | Color;
}

const useGridlines = () => {
  return useMemo(() => {
    const rotationMatrix = new Matrix4().makeRotationX(-Math.PI / 2);

    const lats = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      const linePoints: Vector3[] = [];

      for (let lon = 0; lon <= 360; lon += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lon * (Math.PI / 180);
        const x = kBaseScaleFactor * Math.sin(phi) * Math.cos(theta);
        const y = kBaseScaleFactor * Math.cos(phi);
        const z = kBaseScaleFactor * Math.sin(phi) * Math.sin(theta);
        const point = new Vector3(x, y, z).applyMatrix4(rotationMatrix);
        linePoints.push(point);
      }
      lats.push(linePoints);
    }

    const lons = [];

    for (let lon = 0; lon < 360; lon += 15) {
      const linePoints: Vector3[] = [];

      for (let lat = -90; lat <= 90; lat += 5) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = lon * (Math.PI / 180);
        const x = kBaseScaleFactor * Math.sin(phi) * Math.cos(theta);
        const y = kBaseScaleFactor * Math.cos(phi);
        const z = kBaseScaleFactor * Math.sin(phi) * Math.sin(theta);
        const point = new Vector3(x, y, z).applyMatrix4(rotationMatrix);
        linePoints.push(point);
      }
      lons.push(linePoints);
    }

    return { lats, lons };
  }, []);
};

const useNametags = () => {
  const hourTags = Array.from({ length: 24 }, (_, i) => i * 15).map((lon) => {
    const hours = lon / 15;
    const proper = `${hours.toString().padStart(2, "0")}h`;
    const tagPosition = new Vector3(
      kBaseScaleFactor * Math.cos(lon * (Math.PI / 180)),
      0,
      kBaseScaleFactor * Math.sin(lon * (Math.PI / 180))
    ).applyMatrix4(kRotationMatrix);
    return { proper, position: tagPosition, type: "hour" };
  });

  const latitudeTags = [
    -90, -75, -60, -45, -30, -15, 15, 30, 45, 60, 75, 90,
  ].map((lat) => {
    const proper = `${Math.abs(lat)}°${lat >= 0 ? "N" : "S"}`;
    const tagPosition = new Vector3(
      kBaseScaleFactor * Math.sin((90 - lat) * (Math.PI / 180)),
      kBaseScaleFactor * Math.cos((90 - lat) * (Math.PI / 180)),
      0
    ).applyMatrix4(kRotationMatrix);
    return { proper, position: tagPosition, type: "latitude" };
  });

  return [...hourTags, ...latitudeTags];
};

export const CelestialGrid = (props: CelestialGridProps) => {
  const { color = "rgb(0, 75, 75)", scale = 1, ...rest } = props;

  const { lats, lons } = useGridlines();
  const nametags = useNametags();

  return (
    <group {...rest} scale={scale}>
      {lats.map((points, index) => (
        <Line
          key={`lat-${index}`}
          points={points}
          color={color}
          lineWidth={kLineWidth}
          transparent
          opacity={0.3}
        />
      ))}
      {lons.map((points, index) => (
        <Line
          key={`lon-${index}`}
          points={points}
          color={color}
          lineWidth={kLineWidth}
          transparent
          opacity={0.3}
        />
      ))}

      {nametags.map(({ proper, position }, index) => (
        <Nametag
          key={`tag-${index}`}
          proper={proper}
          position={position}
          transform={false}
          color={color}
          opacity={0.75}
        />
      ))}
    </group>
  );
};
