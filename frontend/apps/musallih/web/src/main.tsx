import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initWebAnalytics } from "./analytics/analytics";

void initWebAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
