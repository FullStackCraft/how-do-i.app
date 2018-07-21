import React from 'react'

class AboutTheCreators extends React.Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }
  render () {
    return (
      <div className="transition-item">
        <section id="products" className="full-page">
          <div className="container">
            <div className="section-header contact-head">
              <br/>
              <br/>
              <br/>
              <p className="light-text text-center">Chris Frewin is a tinkerer, this UI was built by . He yeilds to the much smarter creator:</p>
              <br/>
              <br/>
              <p className="light-text text-center">Benjamin Gleitzman created howdoi. The code can be found here: <a href="https://github.com/gleitz/howdoi" target="_blank" rel="noopener noreferrer">https://github.com/gleitz/howdoi</a></p>
              <br/>
              <br/>
              <br/>
            </div>{/*/.section-header*/}
          </div>{/*/.container*/}
        </section>{/*/.story*/}
      </div>
    )
  }
}

export default AboutTheCreators;