import { Line, Sphere } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

export const Axes = (props: GroupProps) => {
  const { ...rest } = props;

  return (
    <group {...rest}>
      <Line
        points={[
          [0, 0, 0],
          [1, 0, 0],
        ]}
        color="red"
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 1, 0],
        ]}
        color="green"
      />
      <Sphere position={[0, 0, 0]} scale={[2.5, 2.5, 2.5]}>
        <meshBasicMaterial
          attach="material"
          color={"white"}
          transparent
          opacity={0.5}
        />
      </Sphere>
    </group>
  );
};
