import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

import Home from "./Scene/Home/Home";

const routing = (
  <Router>
    <div>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));


serviceWorker.unregister();