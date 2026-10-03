// Boid velocity update shader — Craig Reynolds' flocking algorithm (1987).
//
// Each boid's interaction zone is divided into three concentric rings based
// on squared distance to a neighbor, expressed as a normalized percent of the
// total zone radius squared:
//
//   0 ─── thresh_separate ─── thresh_align ─── 1.0
//         │   SEPARATION   │   ALIGNMENT   │  COHESION  │
//
// Separation:  too close  → push away (avoid collision)
// Alignment:   mid range  → steer to match neighbor's heading
// Cohesion:    far range  → steer toward neighbor (flock together)
//
// Two extra forces act independently of neighbors:
//   Dispersion: explosive radial push from a disruption point
//   Gravity:    soft pull toward a central anchor point

uniform float delta;
uniform float time;

uniform float alignment_radius;
uniform float cohesion_radius;
uniform bool dispersion_enabled;
uniform vec3 dispersion_position;
uniform float dispersion_radius;
uniform float separation_radius;
uniform float gravity_magnitude;
uniform vec3 gravity_position;
uniform float gravity_radius;
uniform float max_velocity;


const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

// Normalized distance thresholds within the zone (set in main)
float thresh_align = 0.0;
float thresh_separate = 0.0;


const vec3 ZERO = vec3(0.0);


// Steer toward the heading of a neighbor in the alignment band.
// percent is re-normalized to [0,1] within the alignment range, then
// smoothed with a cosine bell so influence peaks in the middle of the band.
vec3 velocity_alignment(float percent, vec3 other_velocity) {
  float range = thresh_align - thresh_separate;
  percent = (percent - thresh_separate) / range;

  float f = (0.5 - cos(percent * PI_2) * 0.5 + 0.5) * delta;
  return normalize(other_velocity) * f;
}

// Steer toward a distant neighbor to maintain flock cohesion.
// percent is re-normalized to [0,1] within the cohesion range, then
// smoothed with an inverted cosine so influence ramps up with distance.
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

// Push boid away from a disruption point (e.g. a mouse/touch interaction).
// Force is quadratic: strongest at the center, zero at the dispersion radius.
// Operates only in the XY plane (z=0).
vec3 velocity_disperse(vec3 this_position) {
  vec3 d = dispersion_position - this_position;
  d.z = 0.;
  float dist = length(d);
  float dist_2 = dist * dist;
  float dispersion_radius_2 = dispersion_radius * dispersion_radius;

  if (!dispersion_enabled || dist > dispersion_radius) {
    return ZERO;
  }

  // (dist²/r² - 1) is negative inside the radius → force points away from center
  float f = (dist_2 / dispersion_radius_2 - 1.0) * delta * 100.0;
  return normalize(d) * f;
}

// Pull boid toward a gravity anchor. Force is constant outside the dead-zone
// radius and zero inside it (prevents jitter when very close to the anchor).
vec3 velocity_gravity(vec3 this_position) {
  vec3 d = this_position - gravity_position;
  float dist = length(d);

  if (dist < gravity_radius) {
    return ZERO;
  }

  return normalize(d) * delta * gravity_magnitude;
}

// Push boid away from a neighbor that is inside the separation band.
// Force is inversely proportional to proximity — stronger when closer.
vec3 velocity_separation(float percent, vec3 d) {
  float f = (thresh_separate / percent - 1.0) * delta;
  return  normalize(d) * f;
}

void main() {
  // Total interaction zone: the three radii sum to one continuous sphere.
  // Thresholds are expressed as fractions of zone_radius² for cheap comparison
  // against squared distances (avoids sqrt in the inner loop).
  float zone_radius = separation_radius + alignment_radius + cohesion_radius;
  float zone_radius_2 = zone_radius * zone_radius;

  thresh_separate = separation_radius / zone_radius;
  thresh_align = (separation_radius + alignment_radius ) / zone_radius;

  // Each texel stores one boid; uv identifies which boid this invocation owns.
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

  // Disperse from disruption — raise the speed cap briefly so the boid can
  // actually escape the disruption zone at full force.
  vec3 accel = velocity_disperse(this_position);
  velocity += accel;
  if (length(velocity) > 0.0001) {
    max_velocity_situational += 5.0;
  }

  // Attract boid to center (subtracted because d points outward from anchor)
  velocity -= velocity_gravity(this_position);

  // Iterate over every other boid stored in the position/velocity textures.
  // This is O(n²) but runs entirely on GPU so n can be in the hundreds.
  for (float y = 0.0; y < height; y++) {
    for (float x = 0.0; x < width; x++) {
      vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
      other_position = texture2D(texturePosition, ref).xyz;
      other_velocity = texture2D(textureVelocity, ref).xyz;

      d = other_position - this_position;
      dist = length(d);

      // Skip self (dist ≈ 0) and boids outside the interaction zone
      if (dist < 0.0001) continue;
      dist_2 = dist * dist;

      if (dist_2 > zone_radius_2) continue;

      // Normalized squared distance within the zone [0, 1]
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

  // Clamp to max speed (raised if currently dispersing)
  if (length(velocity) > max_velocity_situational) {
    velocity = normalize(velocity) * max_velocity_situational;
  }

  gl_FragColor = vec4( velocity, 1.0 );
}