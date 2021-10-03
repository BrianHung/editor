/**
 * Try to avoid importing entire katex library as module field not set in package.json.
 */
import katex from "katex";
export const renderToString = katex.renderToString;