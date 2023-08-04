import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useDevices } from "../../hooks/useDevices";
import { useAudioStore } from "../../store/audio";
import { DragPanel } from "../DragPanel";

export const DevicePanel = () => {
  const devices = useDevices();
  const device = useAudioStore((state: any) => state.device);
  const setDevice = useAudioStore((state: any) => state.setDevice);

  return (
    <DragPanel name="Device">
      <Typography variant="h5">Choose a device</Typography>

      <FormControl>
        <FormLabel>Device</FormLabel>
        <RadioGroup defaultValue="female" name="radio-buttons-group">
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
    </DragPanel>
  );
};
