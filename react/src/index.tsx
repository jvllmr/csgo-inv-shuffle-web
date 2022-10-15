import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import Auth from "./components/auth";
import Content from "./components/content";

import { MantineProvider, MantineProviderProps, Paper } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import * as ReactDOM from "react-dom/client";
import HowTo from "./components/howto";
import Logout from "./components/logout";
import Privacy from "./components/privacy";
import Shell from "./components/shell";
import "./index.css";
import store, { persistor } from "./redux";
function Index() {
  const colorScheme = useColorScheme();

  const mantineSettings: Omit<MantineProviderProps, "children"> = {
    theme: {
      colorScheme: colorScheme,
      primaryColor: "dark",
      cursorType: "pointer",
    },
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS {...mantineSettings}>
      <Paper p={0} m={0} radius={0} sx={{ width: "100vw", height: "100vh" }}>
        <Router>
          <Routes>
            <Route path="/howto" element={<HowTo />} />

            <Route path="/logout" element={<Logout />} />

            <Route path="/auth" element={<Auth />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="*"
              element={
                <Shell mainPage>
                  <Content />
                </Shell>
              }
            />
          </Routes>
        </Router>
      </Paper>
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Index />
    </PersistGate>
  </Provider>
);
