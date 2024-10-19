import { CONFIG } from "../config";
import { DebugPanel as BaseDebugPanel } from "../../../../components/DebugPanel";
import { useAsterStore } from "../store";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { kSkycultureUrls } from "../api/stellarium";
import { humanize } from "util/string";
import { useCallback } from "react";
import { requestLocation } from "util/location";
import { gpsToCelestial } from "../util/celestial";
import { Vector3 } from "three";
import { toDegrees, toRadians } from "util/coordinates";

const kSkycultureOptions = Object.keys(kSkycultureUrls).map((key) => ({
  label: humanize(key),
  value: key,
}));

const useOnZenith = () => {
  const state = useAsterStore((s) => s);
  const { camera, controls } = state;

  return useCallback(async () => {
    if (!camera || !controls) {
      return;
    }

    try {
      const position = await requestLocation();

      const { latitude, longitude } = position.coords;
      const { ra, dec } = gpsToCelestial(latitude, longitude);
      console.log(
        `Current celestial coordinates: (ra: ${toDegrees(ra)}, dec: ${toDegrees(
          dec
        )})`
      );

      const radius = 1; // Unit sphere
      const x = radius * Math.cos(dec) * Math.cos(ra);
      const y = radius * Math.cos(dec) * Math.sin(ra);
      const z = radius * Math.sin(dec);
      const lookAtPosition = new Vector3(x, y, z);

      const cameraDistance = 1;
      const cameraPosition = lookAtPosition
        .clone()
        .multiplyScalar(-cameraDistance);

      camera.position.copy(cameraPosition);

      camera.up.set(0, 0, 1); // Set z as up
      camera.lookAt(0, 0, 0);

      controls.target.set(0, 0, 0);

      controls.update();
    } catch (error) {
      console.error("Error getting location", error);
    }
  }, [camera, controls]);
};

export const DebugPanel = () => {
  const state = useAsterStore((s) => s);
  const { skyculture, setVariable } = state;
  const onZenith = useOnZenith();

  return (
    <BaseDebugPanel
      config={CONFIG}
      state={state as any}
      setVariable={state.setVariable}
      header={
        <Stack spacing={1} sx={{ pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="select-skyculture" size="small">
              Skyculture
            </InputLabel>
            <Select
              labelId="select-skyculture"
              label="Skyculture"
              size="small"
              value={skyculture}
              onChange={(e) => setVariable("skyculture", e.target.value)}
            >
              {kSkycultureOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      }
      footer={
        <Button size="small" onClick={onZenith}>
          Zenith
        </Button>
      }
    />
  );
};
