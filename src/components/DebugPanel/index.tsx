import { Box, BoxProps, FormLabel, Switch } from "@mui/material";
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
export interface DebugPanelProps extends BoxProps {
  config: {
    [key: string]: { label: string; min?: number; max?: number; step?: number };
  };
  state: { [key: string]: number };
  setVariable: (key: string, value: number) => void;
}

export const DebugPanel = (props: DebugPanelProps) => {
  const { config, state, setVariable, ...rest } = props;

  return (
    <Box {...rest} component="div">
      {Object.entries(config).map(([key, config]) => {
        const { label } = config;
        const value = state[key];
        const setValue = (value: number) => setVariable(key, value);

        const type = typeof value;

        return (
          <Box
            key={key}
            component="div"
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
    </Box>
  );
};
