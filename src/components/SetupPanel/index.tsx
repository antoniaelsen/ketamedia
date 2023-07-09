import {
  Box,
  BoxProps,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useAudioStore } from "../../store/audio";
import { useEffect, useState } from "react";

const useDevices = () => {
  const [devices, setDevices] = useState<{ [key: string]: MediaDeviceInfo[] }>({
    inputs: [],
    outputs: [],
    sources: [],
  });

  const onDevices = (devices: MediaDeviceInfo[]) => {
    const inputs = devices.filter(
      (device) =>
        device.kind === "audioinput" &&
        device.deviceId !== "" &&
        !device.label.startsWith("Default - ")
    );

    const outputs = devices.filter(
      (device) =>
        device.kind === "audiooutput" &&
        device.deviceId !== "" &&
        !device.label.startsWith("Default - ")
    );

    const sources = [...inputs, ...outputs];

    setDevices({
      inputs,
      outputs,
      sources,
    });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(onDevices);
  }, []);

  return devices;
};

export const SetupPanel = (props: BoxProps) => {
  const devices = useDevices();
  const device = useAudioStore((state: any) => state.device);
  const setDevice = useAudioStore((state: any) => state.setDevice);

  return (
    <Box {...props} component="div">
      <Typography variant="h5" component="div">
        Choose a device
      </Typography>

      <FormControl>
        <FormLabel>Device</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          {devices.inputs.map((d: MediaDeviceInfo) => {
            return (
              <FormControlLabel
                key={d.deviceId}
                control={<Radio />}
                label={d.label}
                value={d.deviceId}
                checked={d.deviceId === device?.deviceId}
                onChange={() => setDevice(d)}
              />
            );
          })}

          {devices.inputs.length === 0 && (
            <Typography variant="body2">No devices found</Typography>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
