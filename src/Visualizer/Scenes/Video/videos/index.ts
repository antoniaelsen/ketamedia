import d_caress from "./vampire_hunter_d/d_caress.mov";
import d_carmilla from "./vampire_hunter_d/d_carmilla.mov";
import d_caroline_1 from "./vampire_hunter_d/d_caroline_1.mov";
import d_caroline_2 from "./vampire_hunter_d/d_caroline_2.mov";
import d_carriage_1 from "./vampire_hunter_d/d_carriage_1.mov";
import d_castle_1 from "./vampire_hunter_d/d_castle_1.mov";
import d_castle_2 from "./vampire_hunter_d/d_castle_2.mov";
import d_castle_3 from "./vampire_hunter_d/d_castle_3.mov";
import d_castle_4 from "./vampire_hunter_d/d_castle_4.mov";
import d_castle_5 from "./vampire_hunter_d/d_castle_5.mov";
import d_castle_6 from "./vampire_hunter_d/d_castle_6.mov";
import d_castle_7 from "./vampire_hunter_d/d_castle_7.mov";
import d_horse_slaughter from "./vampire_hunter_d/d_horse_slaughter.mov";
import d_horses_1 from "./vampire_hunter_d/d_horses_1.mov";
import d_mantas_1 from "./vampire_hunter_d/d_mantas_1.mov";
import d_mantas_2 from "./vampire_hunter_d/d_mantas_2.mov";
import d_riding_1 from "./vampire_hunter_d/d_riding_1.mov";
import d_riding_3 from "./vampire_hunter_d/d_riding_3.mov";
import d_riding_4 from "./vampire_hunter_d/d_riding_4.mov";
import d_riding_5 from "./vampire_hunter_d/d_riding_5.mov";
import d_swordfight_1 from "./vampire_hunter_d/d_swordfight_1.mov";
import d_swordfight_2 from "./vampire_hunter_d/d_swordfight_2.mov";
import d_window from "./vampire_hunter_d/d_window.mov";

export interface Video {
  name: string;
  url: string;
  series: string;
  tags?: string[];
}

const VIDEOS: Video[] = [
  {
    name: "d_caress.mov",
    url: d_caress,
    series: "Vampire Hunter D",
  },
  {
    name: "d_carmilla.mov",
    url: d_carmilla,
    series: "Vampire Hunter D",
  },
  {
    name: "d_caroline_1.mov",
    url: d_caroline_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_caroline_2.mov",
    url: d_caroline_2,
    series: "Vampire Hunter D",
  },
  {
    name: "d_carriage_1.mov",
    url: d_carriage_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_1.mov",
    url: d_castle_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_2.mov",
    url: d_castle_2,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_3.mov",
    url: d_castle_3,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_4.mov",
    url: d_castle_4,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_5.mov",
    url: d_castle_5,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_6.mov",
    url: d_castle_6,
    series: "Vampire Hunter D",
  },
  {
    name: "d_castle_7.mov",
    url: d_castle_7,
    series: "Vampire Hunter D",
  },
  {
    name: "d_horse_slaughter.mov",
    url: d_horse_slaughter,
    series: "Vampire Hunter D",
  },
  {
    name: "d_horses_1.mov",
    url: d_horses_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_mantas_1.mov",
    url: d_mantas_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_mantas_2.mov",
    url: d_mantas_2,
    series: "Vampire Hunter D",
  },
  {
    name: "d_riding_1.mov",
    url: d_riding_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_riding_3.mov",
    url: d_riding_3,
    series: "Vampire Hunter D",
  },
  {
    name: "d_riding_4.mov",
    url: d_riding_4,
    series: "Vampire Hunter D",
  },
  {
    name: "d_riding_5.mov",
    url: d_riding_5,
    series: "Vampire Hunter D",
  },
  {
    name: "d_swordfight_1.mov",
    url: d_swordfight_1,
    series: "Vampire Hunter D",
  },
  {
    name: "d_swordfight_2.mov",
    url: d_swordfight_2,
    series: "Vampire Hunter D",
  },
  {
    name: "d_window.mov",
    url: d_window,
    series: "Vampire Hunter D",
  },
];

export default VIDEOS;
