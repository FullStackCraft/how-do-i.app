import React from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import Emoji from 'react-emoji-render';


class CreateUserOrSignIn extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      username: cookies.get('username') || "",
      bUserError: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.verifyUserAvailable = this.verifyUserAvailable.bind(this);
    this.goToGame = this.goToGame.bind(this);
  }
  handleNameChange(i) {
      const { cookies } = this.props;
      cookies.set('username', i.target.value, { path: '/' });
      this.setState({ [i.target.name]: i.target.value });
      this.verifyUserAvailable()
  }
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.goToGame();
    }
  }
  verifyUserAvailable() {
    // TODO
  }
  goToGame() {
    if (this.state.username !== "") {
      this.props.history.push({
        pathname: "/game"
      });
    } else {
      this.setState({bUserError: true});
    }
  }
  render () {
    const { username } = this.state;
    return (
      <div className="transition-item detail-page">
        {/* header-slider-area start */}
        <section className="header-slider-area">
          <div id="home" className="carousel slide carousel-fade" data-ride="carousel">
            {/* Wrapper for slides */}
            <div className="carousel-inner" role="listbox">
              <div className="item active">
                <div className="single-slide-item slide-1">
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="single-slide-item-content ">
                          <h2 className="light-text">Pick a username!</h2>
                          <p className="light-text">Don't worry about logging in or closing the browser, your username will be stored in a cookie! <Emoji text=":wink:"/></p>
                          <input type="text" name="username" class="form-control" value={username} onChange={this.handleNameChange} onKeyPress={this.handleKeyPress}/>
                        </div>{/* /.single-slide-item-content*/}
                      </div>{/* /.col*/}
                    </div>{/* /.row*/}
                  </div>{/* /.container*/}
                </div>{/* /.single-slide-item*/}
              </div>{/* /.item .active*/}
            </div>{/* /.carousel-inner*/}
          </div>{/* /.carousel*/}
        </section>{/* /.header-slider-area*/}
        {/* header-slider-area end */}
      </div>
    );
  }
}

export default withCookies(CreateUserOrSignIn);