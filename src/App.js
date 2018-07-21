import React, { Component } from 'react';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PageTransition from 'react-router-page-transition';
import './styles/App.css';

// custom components
import Landing from './components/pages/Landing';
import AboutTheCreators from './components/pages/AboutTheCreators';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div>
        <CookiesProvider>
          <Router>
              <Route
                render={({ location }) => (
                  <div>
                    <PageTransition timeout={500}>
                      <Switch location={location}>
                        <Route exact path="/" component={Landing} />
                        <Route path="/about-the-creators" component={AboutTheCreators} />  
                      </Switch>
                    </PageTransition>
                    <Footer/>
                  </div>
                )}
              />
          </Router>
        </CookiesProvider>
      </div>
    );
  }
}

export default App;


    