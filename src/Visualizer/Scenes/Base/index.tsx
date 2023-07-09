import { motion } from "framer-motion";

const Scene = () => {
  return (
    <motion.div
      animate={{
        background: ["hsl(0, 100, 15)", "hsl(240, 100, 15)"],
      }}
      transition={{
        repeat: Infinity,
        duration: 300,
        repeatType: "reverse",
      }}
      style={{
        height: "100%",
        width: "100%",
      }}
    />
  );
};

export default {
  debug: null,
  scene: Scene,
};
