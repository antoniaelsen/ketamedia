import { animated, useSpring } from "@react-spring/web";
import { Box as MuiBox, BoxProps } from "@mui/material";
import MuiHourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import MuiHourglassTopIcon from "@mui/icons-material/HourglassTop";

const Box = animated(MuiBox);
const HourglassBottomIcon = animated(MuiHourglassBottomIcon);
const HourglassTopIcon = animated(MuiHourglassTopIcon);

const kSpringConfig = { tension: 100, friction: 20, mass: 2 };

export const LoadingSpinner = (props: BoxProps) => {
  const top = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    loop: true,
    config: { duration: 1500, ...kSpringConfig },
  });
  const bottom = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    loop: true,
    config: { duration: 1500, ...kSpringConfig },
  });
  const rotate = useSpring({
    from: { rotate: 0 },
    to: [{ rotate: 360 }],
    loop: true,
    delay: 1250,
    config: { duration: 250, ...kSpringConfig },
  });

  return (
    <Box {...props} sx={{ position: "relative", ...props.sx }}>
      <Box style={rotate}>
        <HourglassBottomIcon
          style={bottom}
          sx={{
            fontSize: "7.5rem",
            position: "absolute",
            transform: "translate(-50%,-50%)",
          }}
        />
        <HourglassTopIcon
          style={top}
          sx={{
            fontSize: "7.5rem",
            position: "absolute",
            transform: "translate(-50%,-50%)",
          }}
        />
      </Box>
    </Box>
  );
};
