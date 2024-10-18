import { useQuery } from "@tanstack/react-query";
import { parseStellariumConstellations } from "../util/stellarium";
import { Constellation } from "../types";

export const kSkycultureUrls = {
  modern_st: {
    graphs:
      "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_st/constellationship.fab",
    names:
      "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_st/constellation_names.eng.fab",
  },
  modern_rey: {
    graphs:
      "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_rey/constellationship.fab",
    names:
      "https://raw.githubusercontent.com/Stellarium/stellarium/refs/heads/master/skycultures/modern_rey/constellation_names.eng.fab",
  },
};

const getConstellations = async (
  skyculture: keyof typeof kSkycultureUrls = "modern_rey"
): Promise<Record<string, Constellation>> => {
  const culture = kSkycultureUrls[skyculture];
  const { graphs: graphsUrl, names: namesUrl } = culture;

  // fetch in parallel
  const [graphs, names] = await Promise.all([
    fetch(graphsUrl).then((res) => res.text()),
    fetch(namesUrl).then((res) => res.text()),
  ]);
  try {
    const res = parseStellariumConstellations(graphs, names);
    return res;
  } catch (e) {
    return {};
  }
};

export const useConstellations = (
  skyculture: keyof typeof kSkycultureUrls = "modern_rey"
) => {
  return useQuery({
    queryKey: ["stellarium", "constellations", skyculture],
    queryFn: () => getConstellations(skyculture),
  });
};
