import { Box, Card, FormLabel, Switch } from "@mui/material";
import { InputSlider } from "../InputSlider";

const ValueControl = (props: any) => {
  const { config, type, value, setValue } = props;

  if (type === "boolean") {
    return (
      <Switch checked={value} onChange={(e) => setValue(e.target.checked)} />
    );
  }

  const { min, max, step } = config;
  return (
    <InputSlider
      size="small"
      max={max}
      min={min}
      step={step}
      value={value}
      setValue={setValue}
    />
  );
};
export interface DebugPanelProps {
  config: {
    [key: string]: { label: string; min?: number; max?: number; step?: number };
  };
  state: { [key: string]: number };
  setVariable: (key: string, value: number) => void;
}

export const DebugPanel = (props: DebugPanelProps) => {
  const { config, state, setVariable } = props;

  return (
    <Card sx={{ maxWidth: "320px", background: "rgba(255, 255, 255, 0.5)" }}>
      {Object.entries(config).map(([key, config]) => {
        const { label } = config;
        const value = state[key];
        const setValue = (value: number) => setVariable(key, value);

        const type = typeof value;

        return (
          <Box
            key={key}
            sx={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "5fr 7fr",
            }}
          >
            <FormLabel key={key} sx={{ fontSize: "0.75rem" }}>
              {label}
            </FormLabel>
            <ValueControl
              config={config}
              type={type}
              value={value}
              setValue={setValue}
            />
          </Box>
        );
      })}
    </Card>
  );
};
