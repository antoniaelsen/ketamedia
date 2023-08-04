import { useEffect, useState } from "react";

export const useDevices = () => {
  const [devices, setDevices] = useState<{ [key: string]: MediaDeviceInfo[] }>({
    inputs: [],
    outputs: [],
    sources: [],
  });

  const onDevices = (devices: MediaDeviceInfo[]) => {
    const inputs = devices.filter(
      (device) =>
        device.kind === "audioinput" &&
        device.deviceId !== "" &&
        !device.label.startsWith("Default - ")
    );

    const outputs = devices.filter(
      (device) =>
        device.kind === "audiooutput" &&
        device.deviceId !== "" &&
        !device.label.startsWith("Default - ")
    );

    const sources = [...inputs, ...outputs];

    setDevices({
      inputs,
      outputs,
      sources,
    });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(onDevices);
  }, []);

  return devices;
};
