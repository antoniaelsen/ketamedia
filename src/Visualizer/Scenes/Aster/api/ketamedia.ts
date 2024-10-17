import { useQuery } from "@tanstack/react-query";
import { StarMetadata } from "../types";

const getStars = async (): Promise<StarMetadata[]> => {
  // lol
  const kUrlStars =
    "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/main/src/Visualizer/Scenes/Aster/hyglike_from_athyg_24.json";

  return fetch(kUrlStars).then((res) => res.json());
};

export const useStars = () => {
  return useQuery({
    queryKey: ["ketamedia", "stars"],
    queryFn: getStars,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
