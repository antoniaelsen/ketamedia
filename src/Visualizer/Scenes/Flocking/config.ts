interface ConfigProp {
  label: string;
  initial: number | boolean | string | number[];
  min?: number | number[];
  max?: number | number[];
  step?: number | number[];
  legend?: string[];
}

export const CONFIG: Record<string, ConfigProp> = {
  n_boids: {
    label: "# boids",
    initial: 25000,
    min: 1,
    max: 50000,
  },
  sweep: {
    label: "sweep parameters",
    initial: true,
  },
  alignment_radius: {
    label: "alignment radius",
    initial: 20,
    min: 0.0,
    max: 50,
    step: 0.001,
  },
  cohesion_radius: {
    label: "cohesion radius",
    initial: 20,
    min: 0,
    max: 50,
    step: 0.5,
  },
  dispersion_radius: {
    label: "dispersion radius",
    initial: 50,
    min: 0,
    max: 50,
    step: 5,
  },
  gravity_position: {
    label: "gravity well position",
    initial: [0, 0, 0],
    max: [250, 250, 250],
    min: [-250, -250, -250],
    step: [5, 5, 5],
    legend: ["x", "y", "z"],
  },
  gravity_magnitude: {
    label: "gravity magnitude",
    initial: 6.0,
    min: 0.0,
    max: 10,
    step: 0.5,
  },
  gravity_radius: {
    label: "gravity radius",
    initial: 250,
    min: 0,
    max: 1000,
    step: 5,
  },
  separation_radius: {
    label: "separation radius",
    initial: 20,
    min: 0,
    max: 50,
    step: 0.5,
  },
  max_velocity: {
    label: "max velocity",
    initial: 9.0,
    min: 1,
    max: 20,
    step: 0.5,
  },
  dispersion_enabled: {
    label: "dispersion",
    initial: false,
  },
  fps_camera: {
    label: "fps camera",
    initial: false,
  },
};
