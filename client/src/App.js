import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./style/output.css";
import "./App.css";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import CreateMuiTheme from "@material-ui/core/styles/createMuiTheme";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// AXIOS
import axios from "axios";

//Components
import Home from "./pages/home";
import Frontpage from "./pages/frontpage";

import TempLogin from "./pages/logincopy";
import Signup from "./pages/signup";
import themeFile from "./components/util/theme";
import AuthRoute from "./components/util/authRoute";
import User from "./pages/user";
import Wishlist from "./pages/wishlist";
import Chat from "./pages/chat";

//other
import jwtDecode from "jwt-decode";
import Navbar from "./components/header/navbar";
import NotificationProvider from "./components/provider/notification.provider";

const theme = CreateMuiTheme(themeFile);

const token = localStorage.user_token;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <div className="sharex-layout">
            <NotificationProvider />
            <Navbar />

            <div className="content-container">
              <React.StrictMode>
                <Switch>
                  <Route exact path="/" component={Frontpage} />
                  <Route exact path="/home/:page" component={Home} />
                  {/* <Route exact path="/home/Gallery" component={Gallery} /> */}
                  <AuthRoute exact path="/login" component={TempLogin} />
                  <AuthRoute exact path="/signup" component={Signup} />
                  <Route exact path="/users/:handle" component={User} />
                  <Route
                    exact
                    path="/users/:handle/scream/:screamId"
                    component={User}
                  />
                  <Route exact path="/wishlist" component={Wishlist} />
                  <Route exact path="/chat" component={Chat} />
                </Switch>
              </React.StrictMode>
            </div>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
