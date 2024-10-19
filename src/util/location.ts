export const checkLocationPermissions = () => {
  return new Promise((resolve) => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(true);
    }
  });
};

export const requestLocation = async (): Promise<GeolocationPosition> => {
  return new Promise(async (resolve, reject) => {
    try {
      const allowed = await checkLocationPermissions();
      if (!allowed) {
        reject(new Error("location permission denied"));
      }

      if (!navigator.geolocation) {
        reject(new Error("geolocation not supported"));
      }

      // Save to localstorage because subsequent requests are too slow
      const geostr = localStorage.getItem("geo");
      if (geostr) {
        const geo = JSON.parse(geostr);
        if (geo.position && Date.now() - geo.t! < 1000 * 60 * 30) {
          resolve(geo.position);
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geo = {
            t: Date.now(),
            position,
          };

          localStorage.setItem("geo", JSON.stringify(geo));

          resolve(position);
        },
        (error) => {
          reject(error);
        },
        { maximumAge: 0 }
      );
    } catch (error) {
      reject(new Error("location permission denied"));
    }
  });
};
