import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import Home from "./Scene/Home/Home";
import Login from "./Scene/Login/Login";

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));


serviceWorker.unregister();