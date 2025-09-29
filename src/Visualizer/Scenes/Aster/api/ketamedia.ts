import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StarMetadata } from "../types";

const kUrlStars = [
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-0.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-1.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-2.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-3.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-4.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-5.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-6.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-7.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-8.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-9.json",
  "https://raw.githubusercontent.com/antoniaelsen/ketamedia/refs/heads/feature/aster-better-loading/src/Visualizer/Scenes/Aster/hyglike_from_athyg/hyglike_from_athyg-10.json",
  // Add more URLs here as needed
];

const getStars = async (queryClient: any): Promise<StarMetadata[]> => {
  const queryKey = ["ketamedia", "stars"];

  // Start with existing data or empty array
  let accumulatedStars: StarMetadata[] =
    queryClient.getQueryData(queryKey) || [];

  // Fetch all URLs in parallel
  const fetchPromises = kUrlStars.map(async (url) => {
    try {
      const response = await fetch(url);
      const stars: StarMetadata[] = await response.json();

      // Update cache with accumulated data as each response comes in
      accumulatedStars = [...accumulatedStars, ...stars];
      queryClient.setQueryData(queryKey, accumulatedStars);

      return stars;
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error);
      return [];
    }
  });

  // Wait for all fetches to complete
  const results = await Promise.allSettled(fetchPromises);

  // Return final accumulated data
  return accumulatedStars;
};

export const useStars = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["ketamedia", "stars"],
    queryFn: () => getStars(queryClient),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
