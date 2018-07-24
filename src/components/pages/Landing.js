import React from 'react'
import { Container, Dropdown, Input, Button, Grid } from 'semantic-ui-react'

// custom components
import Loader from '../Loader';

// requires
let logoContrast = require('../../images/howdoi.svg');
const axios = require('axios');
var AU = require('ansi_up');
var ansi_up = new AU.default;

const options = [
  { key: 'javascript', text: 'javascript', value: 'javascript' },
  { key: 'css', text: 'css', value: 'css' },
  { key: 'html', text: 'html', value: 'html' },
  { key: 'react', text: 'react', value: 'react' },
  { key: 'vue', text: 'vue', value: 'vue' },
  { key: 'typescript', text: 'typescript', value: 'typescript' },
  { key: 'python', text: 'python', value: 'python' },
  { key: 'postgresql', text: 'postgresql', value: 'postgresql' },
  { key: 'mysql', text: 'mysql', value: 'mysql' },
  { key: 'mongodb', text: 'mongodb', value: 'mongodb' },
  { key: 'kubernetes', text: 'kubernetes', value: 'kubernetes' },
  { key: 'docker', text: 'docker', value: 'docker' },
  { key: 'nginx', text: 'nginx', value: 'nginx' },
  { key: 'bash', text: 'bash', value: 'bash' },
  { key: 'ruby', text: 'ruby', value: 'ruby' },
  { key: 'perl', text: 'perl', value: 'perl' }
]

// program constants
const sEQUALS = "================================================================================"; // howdoi splits responses like this
const sON = " ON";
const sOFF = " OFF";
const sHELP_STRING = `usage: howdoi.py [-h] [-p POS] [-a] [-l] [-c] [-n NUM_ANSWERS] [-C] [-v] QUERY [QUERY ...]
    
instant coding answers via the command line

positional arguments:
  QUERY                 the question to answer

optional arguments:
  -h, --help            show this help message and exit
  -p POS, --pos POS     select answer in specified position (default: 1)
  -a, --all             display the full text of the answer
  -l, --link            display only the answer link
  -c, --color           enable colorized output
  -n NUM_ANSWERS, --num-answers NUM_ANSWERS
                        number of answers to return
  -C, --clear-cache     clear the cache
  -v, --version         displays the current version of howdoi`;

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sInput: "",
      sLanguage: "javascript",
      iNumberAnswers: 1,
      bLoading: false,
      aQuestionResponse: [],
      sHelpActive: "",
      sColorizeActive: "",
      sFullTextActive: "",
      sShowLinkActive: ""
    }
    this.goToPage = this.goToPage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);  
    this.toggleOption = this.toggleOption.bind(this);
    this.howDoI = this.howDoI.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleDropdownCountChange = this.handleDropdownCountChange.bind(this);
    this.clearAQuestionResponse = this.clearAQuestionResponse.bind(this);
  }
  goToPage(sPage) {
    this.props.history.push({
      pathname: sPage
    });
  }
  handleInputChange(oEvent) {
      this.setState({ [oEvent.target.name]: oEvent.target.value });
  }
  handleDropdownChange(oEvent) {
    const { sLanguage } = this.state;
    let sTextContent;
    if (oEvent.target.textContent.length > 50) { // when user 'anti' clicks not on the dropdown - just keep current language as defined by state
      sTextContent = sLanguage;
    } else {
      sTextContent = oEvent.target.textContent;
    }
    this.setState({ sLanguage: sTextContent });
  }
  handleDropdownCountChange(oEvent) {
    console.log('here');
    console.log(oEvent.target.textContent)
    const { iNumberAnswers } = this.state;
    let sTextContent;
    if (oEvent.target.textContent.length > 2) { // when user 'anti' clicks not on the dropdown - just keep current language as defined by state
      sTextContent = iNumberAnswers;
    } else {
      sTextContent = oEvent.target.textContent;
    }
    this.setState({ iNumberAnswers: parseInt(sTextContent) });
  }
  handleKeyPress(event) {
    const { aQuestionResponse, sColorizeActive, sShowLinkActive } = this.state;
    let { sInput } = this.state;
    if (event.key === 'Enter' && sInput !== "") {
      this.howDoI();
    }
  }
  handleButtonPress() {
    let { sInput } = this.state;
    if (sInput !== "") {
      this.howDoI();
    }
  }
  howDoI() {
    const { sLanguage, iNumberAnswers, aQuestionResponse, sColorizeActive, sFullTextActive, sShowLinkActive } = this.state;
    let { sInput } = this.state;
    sInput = sInput + " " + sLanguage; // append language to end of query
    sInput = sInput + " -n " + iNumberAnswers.toString(); // and number of answers, even if it is one
    this.setState({bLoading: true});
    if (sColorizeActive === sON) {
      sInput = sInput + " -c"; // append colorize flag to command
    }
    if (sFullTextActive === sON) {
      sInput = sInput + " -a"; // append full text flag to command
    }
    if (sShowLinkActive === sON) {
      sInput = sInput + " -l"; // append link flag to command
    }
    axios.post(process.env.REACT_APP_ROOT_URL + '/howdoi', {
      sInput: sInput
    })
    .then((oResponse) => {
      console.log(oResponse.data);
      let aResponses = oResponse.data.sResponse.split(sEQUALS);
      let sResponse = "";
      aResponses.reverse();
      if (aResponses.length === 1) {
        if (sColorizeActive === sON) {
          sResponse = ansi_up.ansi_to_html(aResponses[0]);
        } else {
          sResponse = aResponses[0];
        }
        if (sShowLinkActive === sON) {
          sResponse = '<a href="' + sResponse + '" target="_blank" rel="noopener noreferrer">' + sResponse + "</a>";
        }
        aQuestionResponse.unshift({sQuestion: sInput, iIndex: 0, sResponse: sResponse});
      } else {
        aResponses.forEach((sResponse, iIndex) => {
          if (sColorizeActive === sON) {
            sResponse = ansi_up.ansi_to_html(aResponses[iIndex]);
          } else {
            sResponse = aResponses[iIndex];
          }
          if (sShowLinkActive === sON) {
            sResponse = '<a href="' + sResponse + '" target="_blank" rel="noopener noreferrer">' + sResponse + "</a>";
          }
          aQuestionResponse.unshift({sQuestion: sInput, iIndex: iIndex, sResponse: sResponse});
        });
      }
      this.setState({bLoading: false, aQuestionResponse: aQuestionResponse, sInput: ""});
    })
    .catch((error) => {
      aQuestionResponse.unshift({sQuestion: sInput + " ERROR", sResponse: "error"});
      this.setState({bLoading: false, aQuestionResponse: aQuestionResponse, sInput: ""});
    });
  }
  toggleOption(sOption) {
    const sValue = this.state[sOption];
    if (sValue === "") { // initial state of the site
      this.setState({[sOption]: sON});
    }
    if (sValue === sON) {
      this.setState({[sOption]: sOFF});
    }
    if (sValue === sOFF) {
      this.setState({[sOption]: sON});
    }
  }
  clearAQuestionResponse() {
    console.log("clearing...")
    this.setState({ aQuestionResponse: []}); // clear array
  }
  render () {
    // <input className="form-control" placeholder="your query here..." type="text" name="sInput" value={sInput} onChange={this.handleInputChange} onKeyPress={this.handleKeyPress}/>
    const { sInput, sLanguage, iNumberAnswers, bLoading, aQuestionResponse, sHelpActive, sColorizeActive, sFullTextActive, sShowLinkActive } = this.state;
    let sHelpFieldClass = sHelpActive === sON ? "help-field__shown response-field" : "help-field__hidden response-field";
    let aRunningList = [];
    let sNumberDropdownText = 'No. answers (' + iNumberAnswers.toString() + ')';
    aQuestionResponse.forEach((oElement, iIndex) => {
      aRunningList.push(<div key={iIndex} className="response-field">
        <pre className="inline-pre">{aQuestionResponse[iIndex].sQuestion}</pre> <pre className="inline-pre">Position {aQuestionResponse[iIndex].iIndex + 1}</pre>
        <pre className="response-field">
          <div dangerouslySetInnerHTML={{ __html: aQuestionResponse[iIndex].sResponse }} />
        </pre>
        
      </div>);
    });
    return (
      <div>
        <Container>
              <br/>
              <img className="text-center spin" style={{display: "block", margin:"0 auto"}} src={logoContrast} width="100px" alt="logo" />
              <h2 className="text-center">How Do I...</h2>
              <p className="text-center">Type any coding question into the form and press enter or submit!</p>
              <Input
                className="text-center ui-input-overrides input-width"
                style={{display: "block", margin:"0 auto"}}
                type="text"
                name="sInput"
                value={sInput}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                label={<Dropdown options={options} value={sLanguage} name="sLanguage" onChange={this.handleDropdownChange}/>}
                labelPosition='right'
                placeholder='your query here...'
              />
              <div className="text-center" style={{display: "block", margin:"0 auto"}}>
              <Button onClick={this.handleButtonPress} secondary>
                submit
              </Button>
              <Dropdown text={sNumberDropdownText} floating labeled button className='icon' value={iNumberAnswers} >
                <Dropdown.Menu>
                  <Dropdown.Menu scrolling >
                    <Dropdown.Item key="1" text="1" value="1" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="2" text="2" value="2" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="3" text="3" value="3" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="4" text="4" value="4" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="5" text="5" value="5" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="6" text="6" value="6" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="7" text="7" value="7" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="8" text="8" value="8" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="9" text="9" value="9" onClick={this.handleDropdownCountChange}/>
                    <Dropdown.Item key="10" text="10" value="10" onClick={this.handleDropdownCountChange}/>
                  </Dropdown.Menu>
                </Dropdown.Menu>
              </Dropdown>
              <Button onClick={this.clearAQuestionResponse} negative>clear responses</Button> 
              </div>
              <br/>
              <p className="text-center">Other options (click to toggle):</p>
              <div className="text-center" style={{display: "block", margin:"0 auto"}}>
                  <Button className="pre-like" onClick={() => this.toggleOption("sHelpActive")}>show help{sHelpActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sColorizeActive")}>colorize responses{sColorizeActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sFullTextActive")}>show full text{sFullTextActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sShowLinkActive")}>show link only{sShowLinkActive}</Button>  
              </div>
                <div className="response-field">
                  { sHelpActive === sON && <pre className={sHelpFieldClass}>
                    {sHELP_STRING}
                  </pre> }
                </div>
                { bLoading === true && <Loader/> }
                { aRunningList.length > 0 && 
                aRunningList }      
          </Container>
        </div>
    )
  }
}

export default Landing;