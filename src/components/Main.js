import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { TesterDash } from '../pages';
import { Hub, Auth } from 'aws-amplify';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.loadUser = this.loadUser.bind(this);
    Hub.listen('auth', this, 'navigator'); // Add this component as listener of auth event.
    this.state = { user: null }
  }
  componentDidMount() {
    this.loadUser(); // The first check
  }

  loadUser() {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ user: user });
      })
      .catch(err => {
        console.log('err: ', err);
        this.setState({ user: null })
      });
  }

  onHubCapsule(capsule) {
    this.loadUser(); // Triggered every time user sign in / out
  }
  render() {
    const { user } = this.state;
    if(!user) {
      return(
        <div className="Main">
          <HashRouter>
            <Switch>
              <Route
                path="/"
                render={(props) => <TesterDash user={user}/>}
              />
            </Switch>
          </HashRouter>
        </div>
      );
    }
    return (
        <div className="Main">
          <HashRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <TesterDash user={user}/>}
              />
            </Switch>
          </HashRouter>
        </div>
    );
  }
}
