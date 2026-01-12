import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://2bfdd09fd38a84cb2ff44fc7a82b6c6a@o4510501449826304.ingest.de.sentry.io/4510501458083920",
  sendDefaultPii: true,
});


createRoot(document.getElementById("root")!).render(
  <App />
);