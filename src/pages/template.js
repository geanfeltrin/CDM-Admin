import React, { Component } from "react";
import Routes from "../src/routes/index";
// import TopNavigation from './components/topNavigation';
import SideNavigation from "./components/sideNavigation";
import Footer from "./components/Footer";
import "./index.css";

import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./store";

class App extends Component {
  render() {
    return (
      <div className="flexible-content">
        <SideNavigation />
        <main id="content" className="p-5">
          <Routes />
        </main>
      </div>
    );
  }
}

export default App;
