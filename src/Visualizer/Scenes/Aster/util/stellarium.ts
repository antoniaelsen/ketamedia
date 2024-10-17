import { Constellation, Position, StarMetadata } from "../types";
import kStarJson from "../hyglike_from_athyg_24.json";

const kStarFilter = ({ distance, id }: StarMetadata) => !!distance || id === 0;
export const kStars: StarMetadata[] = (kStarJson as StarMetadata[]).filter(
  kStarFilter
);

export const getConstellationStars = (
  constellations: Record<string, Constellation>
): Record<string, Constellation> => {
  const ids = Object.values(constellations)
    .map(({ connections }) => {
      return connections?.flat() ?? [];
    })
    .flat();

  const starMap = Object.fromEntries(
    kStars
      .filter(({ idHIP }) => idHIP && ids.includes(idHIP))
      .map((star) => [star.idHIP, star])
  );

  const updated = Object.fromEntries(
    Object.keys(constellations).map((key): [string, Constellation] => {
      const constellation = constellations[key];
      return [
        key,
        {
          ...constellation,
          edges: constellation.connections.map(
            ([a, b]): [Position, Position] => [
              starMap[a]?.position,
              starMap[b]?.position,
            ]
          ),
        },
      ];
    })
  );

  return updated;
};

export const parseStellariumConstellations = (
  graphsRaw: string,
  namesRaw: string
): Record<string, Constellation> => {
  const graphRows = graphsRaw.split("\n");
  const graphs = graphRows.map((row: string) => {
    const [key, ...star_ids] = row.split(" ");
    const ints = star_ids.map((id) => parseInt(id, 10)).filter(Boolean);
    const ids = ints.slice(1);
    const pairs = [];

    if (ids.length % 2 !== 0) {
    } else {
      for (let i = 0; i < ids.length - 1; i += 2) {
        pairs.push([ids[i], ids[i + 1]]);
      }
    }

    return [key, pairs];
  });

  const nameRows = namesRaw.split("\n");
  const names = nameRows
    .map((row: string) => {
      const [key, proper, ..._] = row.split("\t");
      return [key, proper?.replace(/\"/g, "")];
    })
    .filter(([_, proper]) => !!proper);

  const constellations = Object.fromEntries(
    graphs.map(([key, connections], i) => {
      const proper = names.find(([k, _]) => k === key)?.[1];
      return [key, { key, connections, proper, _raw: graphRows[i] }];
    })
  );

  return getConstellationStars(constellations);
};
