import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Col } from 'react-bootstrap';
import { Authenticator } from 'aws-amplify-react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Navigator, Main } from './components';
import store from './store';
import aws_exports from './aws-exports';
import BootstrapFile from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./fontello/css/fontello.css"
import './styles/App.css';

Amplify.configure({...aws_exports, API: {
    endpoints: [
        {
            name: "Metrics",
            endpoint: ""
        }
    ]
}});

class App extends Component {
  constructor(props) {
    super(props);
    this.loadUser = this.loadUser.bind(this);
    Hub.listen('auth', this, 'navigator'); // Add this component as listener of auth event.
    this.state = {
      user: null,
    }
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
    return (
      <Provider store={store}>
        <div className="App">
        <link
        rel="stylesheet"
        href={BootstrapFile}
        crossOrigin="anonymous"
        />
        <Navigator user={user}/>
        { !user &&
          <Col className="Flex TenColumn TenRow JustC AlC">
            <Authenticator
            onStateChange={(authState) => {
              if (authState === 'signedIn') {
                this.loadUser();
              }
            }}/>
          </Col>
        }
        { user && <Main user={user}/>}

        </div>
      </Provider>
    );
  }
}

export default App;
