import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import Auth from "./components/auth";
import Content from "./components/content";
import Footer from "./components/footer";
import Header from "./components/header";
import HowTo from "./components/howto";
import Logout from "./components/logout";
import Privacy from "./components/privacy";
import "./index.scss";
import store, { persistor } from "./redux";

function Page() {
  return (
    <Router>
      <Routes>
        <Route path="/howto" element={<HowTo />} />

        <Route path="/logout" element={<Logout />} />

        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="*"
          element={
            <>
              <Header mainPage />
              <Content />
            </>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Page />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
