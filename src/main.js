import "./assets/style.scss";
import { createApp } from "vue";
import App from "./App.vue";
import apiService from "./utils/ApiService";

apiService.init(import.meta.env.VITE_API_URL);
createApp(App).mount("#app");
