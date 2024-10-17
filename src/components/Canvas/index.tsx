import { Canvas as RTFCanvas, CanvasProps } from "@react-three/fiber";
import { useMemo } from "react";
import { getIsMobile } from "util/hooks/use-is-mobile";

export const useGlProps = () => {
  return useMemo(() => {
    if (getIsMobile()) {
      return {
        antialias: false,
        powerPreference: "default",
      };
    }
    return {};
  }, []);
};

export const Canvas = (props: CanvasProps) => {
  const gl = useGlProps();

  return <RTFCanvas id="visualizer" gl={gl} {...props} />;
};
