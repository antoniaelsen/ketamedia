uniform float delta;
uniform float time;

uniform float alignment_radius;
uniform float cohesion_radius;
uniform bool dispersion_enabled;
uniform vec3 dispersion_position;
uniform float dispersion_radius;
uniform float separation_radius; 
uniform float gravity;
uniform float gravity_radius;
uniform float max_velocity;


const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

float thresh_align = 0.0;
float thresh_separate = 0.0;

const float UPPER_BOUNDS = BOUNDS;
const float LOWER_BOUNDS = -UPPER_BOUNDS;

const vec3 ZERO = vec3(0.0);


vec3 velocity_alignment(float percent, vec3 other_velocity) {
  float range = thresh_align - thresh_separate;
  percent = (percent - thresh_separate) / range;


  float f = (0.5 - cos(percent * PI_2) * 0.5 + 0.5) * delta;
  return normalize(other_velocity) * f;
}

vec3 velocity_cohesion(float percent, vec3 d) {
  float range = 1.0 - thresh_align;

  if (range == 0.0) {
    percent = 1.0;
  } else {
    percent = (percent - thresh_align) / range;
  }

  float f = (0.5 - (cos(percent * PI_2) * -0.5 + 0.5)) * delta;

  return normalize(d) * f;
}

vec3 velocity_disperse(vec3 this_position) {
  vec3 d = dispersion_position - this_position;
  d.z = 0.;
  float dist = length(d);
  float dist_2 = dist * dist;
  float dispersion_radius_2 = dispersion_radius * dispersion_radius;

  if (!dispersion_enabled || dist > dispersion_radius) {
    return ZERO;
  }

  float f = (dist_2 / dispersion_radius_2 - 1.0) * delta * 100.0;
  return normalize(d) * f;
}

vec3 velocity_gravity(vec3 this_position) {
  vec3 center = vec3(0.0, 0.0, 0.0);
  vec3 d = this_position - center;
  float dist = length(d);

  if (dist < gravity_radius) {
    return ZERO;
  }

  return normalize(d) * delta * gravity;
}

vec3 velocity_separation(float percent, vec3 d) {
  float f = (thresh_separate / percent - 1.0) * delta;
  return  normalize(d) * f;
}

void main() {
  float zone_radius = separation_radius + alignment_radius + cohesion_radius;
  float zone_radius_2 = zone_radius * zone_radius;

  thresh_separate = separation_radius / zone_radius;
  thresh_align = (separation_radius + alignment_radius ) / zone_radius;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 this_position = texture2D(texturePosition, uv).xyz;
  vec3 this_veloicty = texture2D(textureVelocity, uv).xyz;
  vec3 other_position, other_velocity;

  vec3 d; // direction
  float dist;
  float dist_2;

  float f;
  float percent;

  vec3 velocity = this_veloicty;
  float max_velocity_situational = max_velocity;

  // Disperse from disruption
  vec3 accel = velocity_disperse(this_position);
  velocity += accel;
  if (length(velocity) > 0.0001) {
    max_velocity_situational += 5.0;
  }

  // Attract boid to center
  velocity -= velocity_gravity(this_position);

  for (float y = 0.0; y < height; y++) {
    for (float x = 0.0; x < width; x++) {
      vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
      other_position = texture2D(texturePosition, ref).xyz;
      other_velocity = texture2D(textureVelocity, ref).xyz;

      d = other_position - this_position;
      dist = length(d);

      if (dist < 0.0001) continue;
      dist_2 = dist * dist;

      if (dist_2 > zone_radius_2) continue;
      percent = dist_2 / zone_radius_2;


      // If too close -- separate from other boid
      if (percent < thresh_separate) {
        velocity -= velocity_separation(percent, d);

      // If just right - steer towards same direction as other boid
      } else if (percent < thresh_align) {
        velocity += velocity_alignment(percent, other_velocity);

      // If too far - fly towards other boid
      } else {
         velocity += velocity_cohesion(percent, d);
      }
    }
  }

  // Limit Velocity
  if (length(velocity) > max_velocity_situational) {
    velocity = normalize(velocity) * max_velocity_situational;
  }

  gl_FragColor = vec4( velocity, 1.0 );
}