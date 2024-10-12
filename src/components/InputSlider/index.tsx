import { InputBase, Slider, SliderProps, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent } from "react";

const BarSlider = styled(Slider)({
  borderRadius: 0,
  height: "1.25rem",
  paddingBottom: 8,
  paddingTop: 8,

  "& .MuiSlider-track": {
    border: "none",
  },

  "& .MuiSlider-thumb": {
    backgroundColor: "#444",
    border: 0,
    borderRadius: 0,
    height: "1.25rem",
    width: 4,
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
});

const Input = styled(InputBase)({
  "& .MuiInputBase-input": {
    fontSize: "0.75rem",
    padding: "2px",
  },
});

interface InputSliderProps extends SliderProps {
  value: number;
  setValue: (value: number) => void;
}

export const InputSlider = (props: InputSliderProps) => {
  const { value, setValue, ...rest } = props;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "") {
      return;
    }
    setValue(Number(event.target.value));
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    setValue(value as number);
  };

  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{
        alignItems: "center",
      }}
    >
      <BarSlider
        sx={{ flex: 2 }}
        value={typeof value === "number" ? value : 0}
        onChange={handleSliderChange}
        {...rest}
      />
      <Input
        sx={{ flex: 1, textAlign: "right" }}
        inputMode="numeric"
        margin="none"
        size={rest.size}
        value={value}
        onChange={handleInputChange}
      />
    </Stack>
  );
};
