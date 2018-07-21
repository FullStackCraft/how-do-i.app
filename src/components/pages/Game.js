import React from 'react'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Game extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      username: cookies.get('username') || ""
    };
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
                          <p className="light-text">Playing as {username}</p>
                          <p className="light-text">Your word:</p>
                          <input type="text" name="name" class="form-control" id="name" value="test"/>
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
    )
  }
}

export default withCookies(Game);