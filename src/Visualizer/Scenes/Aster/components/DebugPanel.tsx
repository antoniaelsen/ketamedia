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
import { useOnZenith } from "../util/hooks";

const kSkycultureOptions = Object.keys(kSkycultureUrls).map((key) => ({
  label: humanize(key),
  value: key,
}));

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
