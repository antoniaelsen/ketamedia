import { ConfigProp } from "types";

export const CONFIG: Record<string, ConfigProp> = {
  orbiting: {
    label: "orbiting",
    initial: false,
  },
  // orbit_lock: {
  //   label: "orbit lock",
  //   initial: false,
  // },
  // orbit_wait_ms: {
  //   label: "orbit start timer (sec)",
  //   initial: 10,
  //   min: 0.5,
  //   max: 30,
  //   step: 0.5,
  // },
  skyculture: {
    label: "skyculture",
    initial: "modern_rey",
  },
  show_asterisms: {
    label: "show constellations",
    initial: true,
  },
  show_asterism_nametags: {
    label: "show constellation nametags",
    initial: false,
  },
  show_grid: {
    label: "show celestial grid",
    initial: true,
  },
  show_stars: {
    label: "show stars",
    initial: true,
  },
  show_star_nametags: {
    label: "show star nametags",
    initial: false,
  },
  scale_nametags: {
    label: "scale nametags",
    initial: false,
  },
};
