import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "react-query";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./lib/hooks/useApi.ts";
import { LayoutProvider } from "@/context/LayoutContext.tsx";
import AppConfigProvider from "@/components/layouts/AppConfigProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LayoutProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AppConfigProvider>
              <App />
            </AppConfigProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </LayoutProvider>
    </ThemeProvider>
  </React.StrictMode>
);
