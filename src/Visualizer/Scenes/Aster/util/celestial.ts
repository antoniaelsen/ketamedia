import { Color } from "three";
import { toDegrees, toRadians } from "util/coordinates";

export const getColorFromBV = (bv: number) => {
  const t = 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62));

  let x = 0;
  let y = 0;

  if (t >= 1667 && t <= 4000) {
    x =
      (-0.2661239 * Math.pow(10, 9)) / Math.pow(t, 3) +
      (-0.234358 * Math.pow(10, 6)) / Math.pow(t, 2) +
      (0.8776956 * Math.pow(10, 3)) / t +
      0.17991;
  } else {
    x =
      (-3.0258469 * Math.pow(10, 9)) / Math.pow(t, 3) +
      (2.1070379 * Math.pow(10, 6)) / Math.pow(t, 2) +
      (0.2226347 * Math.pow(10, 3)) / t +
      0.24039;
  }

  if (t >= 1667 && t <= 2222) {
    y =
      -1.1063814 * Math.pow(x, 3) -
      1.3481102 * Math.pow(x, 2) +
      2.18555832 * x -
      0.20219683;
  } else if (t > 2222 && t <= 4000) {
    y =
      -0.9549476 * Math.pow(x, 3) -
      1.37418593 * Math.pow(x, 2) +
      2.09137015 * x -
      0.16748867;
  } else {
    y =
      3.081758 * Math.pow(x, 3) -
      5.8733867 * Math.pow(x, 2) +
      3.75112997 * x -
      0.37001483;
  }

  const Y = 1.0;
  const X = y == 0 ? 0 : (x * Y) / y;
  const Z = y == 0 ? 0 : ((1 - x - y) * Y) / y;

  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const b = 0.0557 * X - 0.204 * Y + 1.057 * Z;

  const R = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 0.5) - 0.055;
  const G = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 0.5) - 0.055;
  const B = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 0.5) - 0.055;

  return new Color(R, G, B);
};

export const gpsToCelestial = (
  latitude: number,
  longitude: number,
  date = new Date()
) => {
  const calculateJulianDay = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return (
      day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045
    );
  };

  const jd = calculateJulianDay(date);
  const t = (jd - 2451545.0) / 36525;

  // Calculate Greenwich Mean Sidereal Time (GMST)
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;

  // Calculate Local Sidereal Time (LST)
  const lst = (gmst + longitude + 360) % 360;

  const ra = lst;

  const dec = toDegrees(Math.asin(Math.sin(toRadians(latitude))));

  return { ra, dec };
};
