import React, { Fragment } from "react";
import { ConnectedRouter } from "connected-react-router";
import { Switch } from "react-router-dom";

import SignIn from "../pages/SignIn";

import dashboard from "./dashboard";
import history from "./history";

import Private from "./private";
import Guest from "./guest";

const Routes = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Guest path="/admin" component={SignIn} />
      <div className="flexible-content">
        {dashboard.map((route, index) => (
          <Private
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.sidebar}
          />
        ))}
        <main id="content" className="p-5">
          {dashboard.map((route, index) => (
            <Private
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </main>
      </div>
    </Switch>
  </ConnectedRouter>
);

export default Routes;
