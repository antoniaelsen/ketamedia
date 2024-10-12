import {
  Box,
  CardProps,
  Card,
  FormLabel,
  Stack,
  Switch,
  BoxProps,
} from "@mui/material";
import { InputSlider } from "../InputSlider";

export type DebugValue = number | number[] | boolean;

const NumberControl = (props: any) => {
  const { config, value, setValue } = props;
  const { max, min, step } = config;

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

const ArrayControl = (props: any) => {
  const { config, value, setValue } = props;
  const { legend, max, min, step } = config;

  return (
    <Stack>
      {value.map((v: number, i: number) => {
        return (
          <ValueField
            key={legend?.[i] || i}
            config={{
              label: legend?.[i],
              max: max?.[i],
              min: min?.[i],
              step: step?.[i],
            }}
            value={v}
            setValue={(v) => {
              const updated = [...value];
              updated[i] = v;
              setValue(updated);
            }}
            sx={{
              gridTemplateColumns: "1fr 5fr",
            }}
          />
        );
      })}
    </Stack>
  );
};

const ValueControl = (props: any) => {
  const { config, value, setValue } = props;
  const type = typeof value;

  if (type === "boolean") {
    return (
      <Switch
        checked={value as boolean}
        onChange={(e) => setValue(e.target.checked)}
      />
    );
  } else if (type === "number") {
    return <NumberControl config={config} value={value} setValue={setValue} />;
  } else if (type === "object" && Array.isArray(value)) {
    return <ArrayControl config={config} value={value} setValue={setValue} />;
  } else {
    return null;
  }
};

export interface ValueFieldProps extends BoxProps {
  config: {
    label: string;
    min?: number | number[];
    max?: number | number[];
    step?: number | number[];
  };
  value: DebugValue;
  setValue: (value: DebugValue) => void;
}

const ValueField = (props: ValueFieldProps) => {
  const { config, value, setValue, sx } = props;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        ...sx,
      }}
    >
      <FormLabel sx={{ flex: 2, fontSize: "0.75rem" }}>
        {config.label}
      </FormLabel>
      <ValueControl
        sx={{ flex: 3 }}
        config={config}
        value={value}
        setValue={setValue}
      />
    </Stack>
  );
};

export interface DebugPanelProps extends CardProps {
  config: {
    [key: string]: {
      label: string;
      min?: number | number[];
      max?: number | number[];
      step?: number | number[];
    };
  };
  state: { [key: string]: DebugValue };
  setVariable: (key: string, value: DebugValue) => void;
}

export const DebugPanel = (props: DebugPanelProps) => {
  const { config, state, setVariable, ...rest } = props;

  return (
    <Card
      sx={{
        background: "transparent",
        backdropFilter: "blur(5px)",
        padding: "0.5rem",
        overflow: "hidden",
      }}
      {...rest}
    >
      <Box sx={{ overflowY: "scroll", height: "100%" }}>
        <Stack>
          {Object.entries(config).map(([key, config]) => {
            const value = state[key];
            const setValue = (value: DebugValue) => setVariable(key, value);

            return (
              <ValueField
                key={config.label}
                config={config}
                value={value}
                setValue={setValue}
              />
            );
          })}
        </Stack>
      </Box>
    </Card>
  );
};
