import React from 'react'
let logoContrast = require('../images/howdoi.svg');

class Nav extends React.Component {
  constructor() {
    super();
    this.goToPage = this.goToPage.bind(this);
  }
  goToPage(sPage) {
    this.props.history.push({
      pathname: sPage
    });
  }
  render () {
    return (
      <div>
        {/*menu start*/}
        <section id="menu">
          <div className="container">
            <div className="menubar">
              <nav className="navbar navbar-default">
                {/* Brand and toggle get grouped for better mobile display */}
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                  <li className="smooth-menu no-decoration">
                      <img src={logoContrast} width="45px" alt="logo" />
                      <p className="light-text">Howdoi</p>
                  </li>
                </div>{/*/.navbar-header */}
                {/* Collect the nav links, forms, and other content for toggling */}
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav navbar-right">
                    <li className="smooth-menu" onClick={() => this.goToPage("/about-the-creators")}><a href="">About the creators...</a></li>
                  </ul>{/* / ul */}
                </div>{/* /.navbar-collapse */}
              </nav>{/*/nav */}
            </div>{/*/.menubar */}
          </div>{/* /.container */}
        </section>{/*/#menu*/}
        {/*menu end*/}
      </div>
    )
  }
}

export default Nav;