import React, { Component } from 'react';
import './styles/App.css';

// custom components
import HowDoI from './components/pages/HowDoI';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <div>
        <HowDoI/>
        <Footer/>
      </div>
    );
  }
}

export default App;


    