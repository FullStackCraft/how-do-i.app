import React from 'react'

// custom components
import Loader from '../Loader';
let logoContrast = require('../../images/howdoi.svg');

// requires
const axios = require('axios')

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sInput: "",
      bLoading: false,
      aQuestionResponse: []
    }
    this.goToPage = this.goToPage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);  
  }
  goToPage(sPage) {
    this.props.history.push({
      pathname: sPage
    });
  }
  handleInputChange(i) {
      this.setState({ [i.target.name]: i.target.value });
  }
  handleKeyPress(event) {
    const { sInput, aQuestionResponse } = this.state;
    if (event.key === 'Enter') {
      this.setState({bLoading: true});
      axios.post(process.env.REACT_APP_ROOT_URL + '/howdoi', {
        sInput: sInput
      })
      .then((oResponse) => {
        console.log(oResponse.data);
        aQuestionResponse.unshift({sQuestion: sInput, sResponse: oResponse.data.sResponse});
        this.setState({bLoading: false, aQuestionResponse: aQuestionResponse, sInput: ""});
      })
      .catch((error) => {
        aQuestionResponse.unshift({sQuestion: sInput + " ERROR", sResponse: "error"});
        this.setState({bLoading: false, aQuestionResponse: aQuestionResponse, sInput: ""});
      });
    }
  }
  render () {
    const { sInput, bLoading, aQuestionResponse } = this.state;
    let aRunningList = [];
    aQuestionResponse.forEach((oElement, iIndex) => {
      aRunningList.push(<div key={iIndex}>
        <p className="response-field">{aQuestionResponse[iIndex].sQuestion}:</p>
        <pre className="response-field">
          {aQuestionResponse[iIndex].sResponse}
        </pre>
      </div>);
    });
    return (
      <div className="transition-item">
        <section id="products" className="full-page">
          <div className="container">
            <div className="section-header contact-head">
              <br/>
              <br/>
              <br/>
              <img className="text-center" style={{display: "block", margin:"0 auto"}} src={logoContrast} width="100px" alt="logo" />
              <br/>
              <h2 className="light-text text-center">How Do I...</h2>
              <br/>
              <p className="light-text text-center">Type any coding question into the form and press enter!</p>
              <br/>
              <input className="text-center form-control" placeholder="'write file python'" type="text" name="sInput" value={sInput} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress}/>
                <br/>
                <br/>
                { bLoading === true && <Loader/> }
                { aRunningList.length > 0 && 
                aRunningList }
                <br/>
            </div>{/*/.section-header*/}
          </div>{/*/.container*/}
        </section>{/*/.story*/}
      </div>
    )
  }
}

export default Landing;