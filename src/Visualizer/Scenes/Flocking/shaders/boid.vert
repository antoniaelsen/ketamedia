attribute vec2 reference;
attribute float boidGeometry;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

varying float z;

uniform float time;

void main() {
  vec4 tmpPos = texture2D(texturePosition, reference);
  vec3 pos = tmpPos.xyz;
  vec3 velocity = normalize(texture2D(textureVelocity, reference).xyz);

  vec3 next_position = position;

  // Flap wings
  if (boidGeometry == 4.0 || boidGeometry == 7.0) {
    next_position.y = sin(tmpPos.w / 2.0) * 5.;
  }

  next_position = mat3(modelMatrix) * next_position;

  velocity.z *= -1.;
  float xz = length( velocity.xz );
  float xyz = 1.;
  float x = sqrt( 1. - velocity.y * velocity.y );

  float cosry = velocity.x / xz;
  float sinry = velocity.z / xz;

  float cosrz = x / xyz;
  float sinrz = velocity.y / xyz;

  mat3 maty = mat3(
    cosry, 0, -sinry,
    0    , 1, 0     ,
    sinry, 0, cosry
  );

  mat3 matz = mat3(
    cosrz , sinrz, 0,
    -sinrz, cosrz, 0,
    0     , 0    , 1
  );

  next_position = maty * matz * next_position;
  next_position += pos;

  z = next_position.z;

  gl_Position = projectionMatrix *  viewMatrix  * vec4(next_position, 1.0);
}