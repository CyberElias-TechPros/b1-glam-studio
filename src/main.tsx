import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Self-hosted variable fonts: no third-party request, no layout shift, and the
// real Bodoni/Jost/Playfair cuts render even when a CDN is unreachable.
import "@fontsource-variable/bodoni-moda/wght.css";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource-variable/playfair-display/wght.css";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/jost/wght.css";
import "@fontsource-variable/jost/wght-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
