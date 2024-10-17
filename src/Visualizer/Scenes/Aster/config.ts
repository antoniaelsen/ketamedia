import { ConfigProp } from "types";

export const CONFIG: Record<string, ConfigProp> = {
  show_asterisms: {
    label: "show constellations",
    initial: true,
  },
  show_nametags: {
    label: "show nametags",
    initial: false,
  },
  scale_nametags: {
    label: "scale nametags",
    initial: false,
  },
};
