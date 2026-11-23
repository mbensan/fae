import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { applyPreferences } from "./lib/preferences";
import "./styles/app.css";

applyPreferences();

createApp(App).use(createPinia()).use(router).mount("#app");
