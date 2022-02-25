import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { versionName } from './src/manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  define: {
    __VERSION__: JSON.stringify(versionName)
  }
});
