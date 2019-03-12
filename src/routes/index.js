import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Switch } from "react-router-dom";

import SignIn from "../pages/SignIn";

import dashboard from "./dashboard";
import history from "./history";

import Private from "./private";
import Guest from "./guest";


import DivStyled from "./DivStyled";

const Routes = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Guest path="/admin" component={SignIn} />
      <DivStyled>
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
      </DivStyled>
    </Switch>
  </ConnectedRouter>
);

export default Routes;
