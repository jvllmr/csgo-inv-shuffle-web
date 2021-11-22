import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/header";

import Content from "./components/content";
import "./index.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./components/auth";
import Logout from "./components/logout";
import HowTo from "./components/howto";
class Page extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/howto" element={<HowTo />} />

          <Route path="/logout" element={<Logout />} />

          <Route path="/auth" element={<Auth />} />

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
      </Router>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
