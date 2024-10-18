import { toLower, upperFirst } from "lodash";

export const humanize = (str: string) => {
  return str
    ?.replace(/\"/g, "")
    .split(/[\s\t_]+/)
    .map((s) => upperFirst(toLower(s)))
    .join(" ");
};
