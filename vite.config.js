import reactRefresh from '@vitejs/plugin-react-refresh'
import resolve from '@rollup/plugin-node-resolve'

/**
 * Allow for JS imports in TS files for pure ESM.
 * https://github.com/vitejs/vite/issues/3040
 */

export default {
  plugins: [reactRefresh(), resolve({extensions: ['.js', '.ts']})],
  mode: "development",
  build: {
    minify: false,
  }
}