export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Constellation {
  // 3-char stellarium key
  key: string;

  // proper name
  proper?: string;

  // hipparcos star ID pairs
  connections: [number, number][];

  // star metadata
  edges?: [Position, Position][];
}

export interface StarMetadata {
  // id in the ATHYG database
  id: number;

  // id in the Hipparcos catalog
  idHIP: number;

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
  position: Position;

  // proper name of the star
  proper: string;
}
