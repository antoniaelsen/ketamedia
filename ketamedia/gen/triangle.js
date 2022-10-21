let T_SIDE = 100;
let T_HEIGHT = T_SIDE * Math.sqrt(3) / 2;
let T_DIVIS = T_SIDE / 5 ;
let ROWS = 10;
let COLS = ROWS * 2;

const RENDER_COLOR = false
const RENDER_ROTATE = false
const RENDER_OUTLINE = true
const COLORS = [{ h: 35, s: 30, l: 50, a: 0.5 }, { h: 10, s: 80, l: 25, a: 0.5 }];
const COLOR_STROKE = "#222";

let grid = [];
let t_start = null;
let t_now = null;

const ARC_PATTERNS = [
  (pts, colors) => {
    noStroke();
    fill(colors[1]);
    
    stroke(COLOR_STROKE);
    arc(pts[0].x, pts[0].y, 2 * T_DIVIS, 2 * T_DIVIS, 0, PI / 3);
    arc(pts[1].x, pts[1].y, 2 * T_DIVIS, 2 * T_DIVIS, 2 * PI / 3, 3 * PI / 3);
    arc(pts[2].x, pts[2].y, 2 * T_DIVIS, 2 * T_DIVIS, 4 * PI / 3, 5 * PI / 3);
  },
  (pts, colors) => {
    noStroke();
    fill(colors[1]);
    triangle(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y);

    stroke(COLOR_STROKE);

    fill(colors[0]);
    arc(pts[0].x, pts[0].y, 4 * T_DIVIS, 4 * T_DIVIS, 0, PI / 3);
    arc(pts[1].x, pts[1].y, 4 * T_DIVIS, 4 * T_DIVIS, 2 * PI / 3, 3 * PI / 3);
    arc(pts[2].x, pts[2].y, 4 * T_DIVIS, 4 * T_DIVIS, 4 * PI / 3, 5 * PI / 3);

    ARC_PATTERNS[0](pts, colors);
  },
    (pts, colors) => {
    stroke(COLOR_STROKE);
    fill(colors[1]);
    arc((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2, T_DIVIS, T_DIVIS, 0 * PI / 3, 3 * PI / 3);
    arc((pts[1].x + pts[2].x) / 2, (pts[1].y + pts[2].y) / 2, T_DIVIS, T_DIVIS, 2 * PI / 3, -1 * PI / 3);
    arc((pts[2].x + pts[0].x) / 2, (pts[2].y + pts[0].y) / 2, T_DIVIS, T_DIVIS, 4 * PI / 3, 1 * PI / 3);

    ARC_PATTERNS[0](pts, colors);
  },
  (pts, colors) => {
    stroke(COLOR_STROKE);
    fill(colors[1]);
    arc((pts[1].x + pts[2].x) / 2, (pts[1].y + pts[2].y) / 2, T_DIVIS, T_DIVIS, 2 * PI / 3, -PI / 3);
    
    fill(colors[1]);
    arc(pts[0].x, pts[0].y, 6 * T_DIVIS, 6 * T_DIVIS, 0, PI / 3);

    fill(colors[0]);
    arc(pts[0].x, pts[0].y, 4 * T_DIVIS, 4 * T_DIVIS, 0, PI / 3);
    
    ARC_PATTERNS[0](pts, colors);
  }
];

const getRandomPattern = () => int(random() * ARC_PATTERNS.length - 1) + 1;

const genGrid = (rows, cols) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push([getRandomPattern(), getRandomPattern()]);
    }
    grid.push(row);
  }
  return grid;
}

const toColorString = ({ h, s, l, a }) => `hsla(${h}, ${s}%, ${l}%, ${a !== undefined ? a : 1})`;

function setup() {
  // noLoop();
  t_start = new Date().getTime();
  createCanvas(T_SIDE * (COLS / 2), T_HEIGHT * ROWS, WEBGL);
  strokeWeight(3);

  grid = genGrid(ROWS, COLS);
}

function draw() {
  translate(-width / 2, -height / 2);
  fill('#fff');
  rect(0, 0, width, height);
  

  let offset = 0;
  if (RENDER_ROTATE) {
    const t_now = new Date().getTime();
    const t_diff = t_now - t_start;
    if (t_diff < 2000) {
    } else if (t_diff < 4000) {
      offset = (t_diff - 2000) / 2000 * PI;
    } else if (t_diff < 6000) {
      offset = PI;
    } else if (t_diff < 8000) {
      offset = (t_diff - 6000) / 2000 * PI + PI;
    } else {
      t_start = t_now;
    }
  }
  if (RENDER_COLOR) {
    COLORS.forEach((_, i) => {
      COLORS[i].h = (COLORS[i].h + 2) % 360;
    })
  }
  
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * T_SIDE + (r % 2 === 0 ?  - T_SIDE / 2 : 0);
      const y = (r + 0.5) * T_HEIGHT;
      const p = grid[r][c];

      drawTile(x, y, T_SIDE, 0 + offset, p[0]);
      drawTile(x + T_SIDE / 2, y, T_SIDE, PI + offset, p[1]);
    }
  }
}

function getTriangle(side) {
  return [
    { x: -side / 2, y: -T_HEIGHT / 2 },
    { x: side / 2, y: -T_HEIGHT / 2 },
    { x: 0, y: T_HEIGHT / 2 }
  ];
}

function drawTile(x, y, side, rot, pattern) {
  push();

  const pts = getTriangle(side);
  
  translate(x, y);
  rotate(rot);
  
  const colors = COLORS.map(toColorString);
  fill(colors[0]);
  if (RENDER_OUTLINE) {
    stroke('hsla(0,0%,0%,0.5)');
  } else {
    noStroke();
  }
  triangle(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y);
  stroke('hsla(0,100%,50%,1)');
  circle(x, y, 10);

  ARC_PATTERNS[pattern](pts, colors);

  pop()
}
