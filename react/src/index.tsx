import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/header";

import Content from "./components/content";
import "./index.scss";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/auth";
import Logout from "./components/logout";
import HowTo from "./components/howto";
import { Provider } from "react-redux";
import Privacy from "./components/privacy";
import store from "./redux";
import Footer from "./components/footer";
class Page extends React.Component {
  render() {
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
}

ReactDOM.render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById("root")
);
