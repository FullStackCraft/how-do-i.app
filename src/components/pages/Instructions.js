import React from 'react'
import Emoji from 'react-emoji-render';

let logoContrast = require('../../images/logo/logo_contrast.svg');

class Instructions extends React.Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }
  render () {
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
                          <img src={logoContrast} width="150px" alt="logo" />
                          <h2 className="light-text">Instructions</h2>
                            <p className="light-text">Whispy is based off the well known game 'Telephone', also known as 'Chinese Whispers' in the UK.</p>
                            <p className="light-text">You will start with 50 points and can modify words on the network as they come. Pick a word you like and modify it for points. The more creative you are with your modification, the more points you will earn!</p>
                            <p className="light-text">The more creative you are, the more points you will earn. Once you earn at least 100 points, you can start putting words on the network - and in turn earn some points passively if lots of people like your word and try to modify it themselves!</p>
                            <p className="light-text">But watch out! It costs 10 points to place a word - so don't try spamming the network with too many points, or you'll run out of points <Emoji text=":wink:"/>! </p>
                            <p className="light-text">You can always check the real-time. So, get creative, modify some words, and let's play Whispy!</p>
                          <li className="smooth-menu" style={{listStyle: 'none'}}>
                              <button type="button" className="slide-btn" onClick={this.goBack}>
                                OK, got it!
                              </button>            
                          </li>
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

export default Instructions;