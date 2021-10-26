import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/header";

import Content from "./components/content";
import "./index.scss";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "./components/auth";
import Logout from "./components/logout";
import HowTo from "./components/howto"
class Page extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/howto">
            <HowTo />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route exact path="/auth">
            <Auth />
          </Route>
          <Route path="*">
            <Header />
            <Content />
            
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Page />, document.getElementById("root"));
