export interface ConfigProp {
  label: string;
  initial: number | boolean | string | number[];
  min?: number | number[];
  max?: number | number[];
  step?: number | number[];
  legend?: string[];
}
