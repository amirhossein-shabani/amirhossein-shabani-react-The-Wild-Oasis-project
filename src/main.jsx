import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback";
import "./index.css";
import GlobalSyles from "./styles/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <GlobalSyles />
    <React.StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.replace("/")}
      >
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </>
);
