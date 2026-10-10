import { createApp } from "vue";
import App from "./App.vue";
import "./styles/global.css";
import { initMotion, vReveal, vTilt, vMagnetic } from "./lib/motion.js";

initMotion();

createApp(App)
  .directive("reveal", vReveal)
  .directive("tilt", vTilt)
  .directive("magnetic", vMagnetic)
  .mount("#app");
