/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "@/styles/index.scss";

async function bootstrap() {
  const useMSW =
    import.meta.env.MODE !== "test" &&
    (import.meta.env.DEV || import.meta.env.VITE_USE_MSW === "true");

  if (useMSW) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

bootstrap();
