import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import TablesPage from "./pages/TablesPage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/tables" component={TablesPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/404" component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
