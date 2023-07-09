import { Box, InputBase, Slider, SliderProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent } from "react";

const BarSlider = styled(Slider)({
  borderRadius: 0,
  height: 24,
  paddingBottom: 8,
  paddingTop: 8,

  "& .MuiSlider-track": {
    border: "none",
  },

  "& .MuiSlider-thumb": {
    backgroundColor: "#444",
    border: 0,
    borderRadius: 0,
    height: 24,
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
    <Box
      component="div"
      sx={{
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "3fr 1fr",
        gridGap: "4px",
      }}
    >
      <BarSlider
        value={typeof value === "number" ? value : 0}
        onChange={handleSliderChange}
        {...rest}
      />
      <Input
        inputMode="numeric"
        margin="none"
        size={rest.size}
        value={value}
        onChange={handleInputChange}
      />
    </Box>
  );
};
