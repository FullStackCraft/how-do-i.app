import React, { Component } from 'react';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/App.css';

// custom components
import Landing from './components/pages/Landing';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Landing/>
        <Footer/>
      </div>
    );
  }
}

export default App;


    