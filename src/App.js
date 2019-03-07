import React, { Component, Fragment } from "react";
import Routes from "../src/routes/index";
import "./index.css";

import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Fragment>
          <Routes />
          <ReduxToastr />
        </Fragment>
      </Provider>
    );
  }
}

export default App;
