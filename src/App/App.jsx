import React from "react";
import { Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Auditpage } from "../Audit";
import { history } from "../_helpers";
import { alertActions } from "../_actions";
import { PrivateRoute } from "../_components";
import { HomePage } from "../HomePage";
import { LoginPage } from "../LoginPage";
import { RegisterPage } from "../RegisterPage";
import { useEffect } from "react";

function App(props) {
  const { alert } = props;

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      props.clearAlerts();
    });
  }, []);

  return (
    <div className="jumbotron">
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2">
          {alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
          <Router history={history}>
            <div>
              <PrivateRoute exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/audit" component={Auditpage} />
            </div>
          </Router>
        </div>
      </div>
    </div>
  );
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const actionCreators = {
  clearAlerts: alertActions.clear,
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };
