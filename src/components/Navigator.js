import React, { Component } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import '../styles/Navigator.css';

const HomeItems = ({activeTab}) => (
  <React.Fragment>
    <Nav.Item>
      <Nav.Link
      href="#/"
      className="NavLink"
      eventKey="home"
      active={activeTab === 'home' ? true : false}
      >Tester</Nav.Link>
    </Nav.Item>
  </React.Fragment>
);

const LoginItems = ({activeTab}) => (
  <React.Fragment>
    <Nav.Item>
      <Nav.Link
      href="#/"
      className="NavLink"
      eventKey="home"
      active
      >Tester</Nav.Link>
    </Nav.Item>
  </React.Fragment>
);

export default class Navigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'null',
      activeTab: 'home'
    }
  }

  componentDidMount() {
  this.loadUser(); // The first check
}

  onHubCapsule(capsule) {
  this.loadUser(); // Triggered every time user sign in / out.
}

  loadUser() {
  Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({ user: user });
    })
    .catch(err => this.setState({ user: null }));
}

  render() {
    const { activeTab } = this.state;
    const { user } = this.props;
    //User not found
    if(!user) {
      return (
        <Navbar
        expand="md"
        bg="dark"
        variant="dark"
        className="NavigatorLogin"
        >
          <Navbar.Brand
            href="#/"
            className="NavLogoLogin"
            onClick={() => {
              this.setState({
                activeTab: 'home'
              })
          }}
          >
          </Navbar.Brand>
          <Nav
          justify
          variant="tabs"
          defaultActiveKey="/"
          className="NavTabsLogin"
          onSelect={selectedKey => {
            this.setState({
              activeTab: selectedKey
            })
          }}
          >
          <HashRouter>
            <Switch>
              <Route
                path="/"
                render={(props) => <LoginItems
                                    {...this.props}
                                    activeTab={activeTab}
                                    />
                       }
              />
            </Switch>
          </HashRouter>
            </Nav>
          <Navbar.Text
          mr="2"
          className="NavNameLogin"
          >
            { user ? 'Usuario: ' + user.username: '' }
          </Navbar.Text>
        </Navbar>
      );
    }
    return (
      <Navbar
      expand="md"
      bg="dark"
      variant="dark"
      className="Navigator"
      >
        <Navbar.Brand
          href="#/"
          className="NavLogo"
          onClick={() => {
            this.setState({
              activeTab: 'home'
            })
        }}
        >
        </Navbar.Brand>
        <Nav
        justify
        variant="tabs"
        defaultActiveKey="/"
        className="NavTabs"
        onSelect={selectedKey => {
          this.setState({
            activeTab: selectedKey
          })
        }}
        >
        <HashRouter>
          <Switch>
            <Route
              path="/"
              render={(props) => <HomeItems
                                  {...this.props}
                                  activeTab={activeTab}
                                  />
                     }
            />
          </Switch>
        </HashRouter>
        </Nav>
        <div className="NavName">
          <Navbar.Text className="NavUserText">
            { user ? user.username: 'Please sign in' }
          </Navbar.Text>
            { user &&
              <Button
              className="NavButon"
              onClick={() => {
                Auth.signOut()
                .then(data => console.log(data))
                .catch(err => console.log(err));
              }
              }
              >
                Cerrar Sesión
              </Button>
            }
        </div>
      </Navbar>
    );
  }
}
