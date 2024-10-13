export interface StarMetadata {
  // id in the ATHYG database
  id: number;

  // id in the Tycho-2 catalog
  idTycho: string;

  // right ascension in degrees
  ra: number;

  // declination in degrees
  dec: number;

  // distance in parsecs from sol
  distance: number;

  // magnitude (brightness)
  magnitude: number;

  // color index
  ci: number;

  // Cartesian coordinates
  position: {
    x: number;
    y: number;
    z: number;
  };

  // proper name of the star
  proper: string;
}
