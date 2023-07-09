varying float z;

void main() {
  float z2 = (z  + 750.0) / 750.;
  gl_FragColor = vec4(
    z2,
    z2 / 2.0,
    1.0 - z2,
    1.0);
}