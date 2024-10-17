import { useQuery } from "@tanstack/react-query";
import { parseStellariumConstellations } from "../util/lib";
import { Constellation } from "../types";

const getConstellations = async (): Promise<Record<string, Constellation>> => {
  const kUrlConstellationGraphs =
    "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_st/constellationship.fab";
  const kUrlConstellationNames =
    "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_st/constellation_names.eng.fab";

  // fetch in parallel
  const [graphs, names] = await Promise.all([
    fetch(kUrlConstellationGraphs).then((res) => res.text()),
    fetch(kUrlConstellationNames).then((res) => res.text()),
  ]);
  try {
    return parseStellariumConstellations(graphs, names);
  } catch (e) {
    console.error("Error parsing stellarium constellations", e);
    return {};
  }
};

export const useConstellations = () => {
  return useQuery({
    queryKey: ["stellarium", "constellations"],
    queryFn: getConstellations,
  });
};
