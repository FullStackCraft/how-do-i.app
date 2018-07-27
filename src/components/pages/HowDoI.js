import React from 'react'
import { Container, Dropdown, Input, Button, Checkbox, Icon, Divider } from 'semantic-ui-react'

// custom components
import Loader from '../Loader';
import RequestModal from './RequestModal';

// requires
let logoContrast = require('../../images/howdoi.svg');
const axios = require('axios');
var AU = require('ansi_up');
var ansi_up = new AU.default();

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
  { key: 'perl', text: 'perl', value: 'perl' },
  { key: 'request', text: '(Request a language / framework / tool)!', value: '(Request a language / framework / tool)!' }  
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

class HowDoI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sInput: "",
      sLanguage: "javascript",
      bIgnoreLanguage: false,
      iNumberAnswers: 1,
      bLoading: false,
      aQuestionResponse: [],
      aBackupQuestionResponse: [],
      bShowUndo: false,
      aFavorites: [],
      sHelpActive: "",
      sColorizeActive: "",
      sFullTextActive: "",
      sShowLinkActive: "",
      sFavoritesActive: ""
    }
    this.hydrateStateWithLocalStorage = this.hydrateStateWithLocalStorage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);  
    this.handleToggleCheck = this.handleToggleCheck.bind(this);
    this.toggleOption = this.toggleOption.bind(this);
    this.howDoI = this.howDoI.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleDropdownCountChange = this.handleDropdownCountChange.bind(this);
    this.clearQuestionResponseArray = this.clearQuestionResponseArray.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.handleDeleteFromFavorites = this.handleDeleteFromFavorites.bind(this);
    this.restoreOldQuestionResponseArray = this.restoreOldQuestionResponseArray.bind(this);
  }
  // tasty function from https://hackernoon.com/how-to-take-advantage-of-local-storage-in-your-react-projects-a895f2b2d3f2 - thanks to Ryan Yost
  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }
  handleInputChange(oEvent) {
      this.setState({ [oEvent.target.name]: oEvent.target.value });
  }
  handleDropdownChange(oEvent) {
    const { sLanguage } = this.state;
    let sTextContent;
    if (oEvent.target.textContent.length > 50) { // when user 'anti' clicks not on the dropdown - just keep current language as defined by state
      sTextContent = sLanguage;
    } else if (oEvent.target.textContent === "(Request a language / framework / tool)!") {
      this.setState({bModalOpen: true});
      sTextContent = sLanguage;
    } else {
      sTextContent = oEvent.target.textContent;
    }
    this.setState({ sLanguage: sTextContent });
  }
  handleModalClose() {
      this.setState({bModalOpen: false});
  }
  handleDropdownCountChange(oEvent) {
    const { iNumberAnswers } = this.state;
    let sTextContent;
    if (oEvent.target.textContent.length > 2) { // when user 'anti' clicks not on the dropdown - just keep current language as defined by state
      sTextContent = iNumberAnswers;
    } else {
      sTextContent = oEvent.target.textContent;
    }
    this.setState({ iNumberAnswers: parseInt(sTextContent,0) });
  }
  handleToggleCheck() {
    this.setState({ bIgnoreLanguage: !this.state.bIgnoreLanguage });
  }
  handleKeyPress(event) {
    const { sInput } = this.state;
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
    this.setState({bLoading: true});
    const { sInput, sLanguage, bIgnoreLanguage, iNumberAnswers, aQuestionResponse, aFavorites, sColorizeActive, sFullTextActive, sShowLinkActive } = this.state;
    let sInputMod = sInput.trim(); // remove leading and trailing space
    if (!bIgnoreLanguage) {
      sInputMod = sInputMod + " " + sLanguage; // append language to end of query
    }
    if (sColorizeActive === sON) {
      sInputMod = sInputMod + " -c"; // append colorize flag to command
    }
    if (sFullTextActive === sON) {
      sInputMod = sInputMod + " -a"; // append full text flag to command
    }
    if (sShowLinkActive === sON) {
      sInputMod = sInputMod + " -l"; // append link flag to command
    }
    sInputMod = sInputMod + " -n " + iNumberAnswers.toString(); // and number of answers, even if it is one
    axios.post(process.env.REACT_APP_ROOT_URL + '/howdoi', {
      sInput: sInputMod
    })
    .then((oResponse) => {
      let aResponses = oResponse.data.sResponse.split(sEQUALS);
      let sResponse = "";
      let sFavoriteIconName = "star outline";
      let sFavoriteText = "favorite";
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
        aFavorites.forEach(oElement => {
          if (oElement.sQuestion === sInputMod && oElement.iIndex === 0) {
            sFavoriteIconName = "star"; // if the user has already saved this exact response in their favorites (maybe they forgot), mark it as such
            sFavoriteText = "saved in favorites";
          }
        });
        aQuestionResponse.unshift({sQuestion: sInputMod, iIndex: 0, sResponse: sResponse, sFavoriteIconName: sFavoriteIconName, sFavoriteText: sFavoriteText, bError: false});
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
          aFavorites.forEach(oElement => {
            if (oElement.sQuestion === sInputMod && oElement.iIndex === iIndex) { // TODO: handle looped responses!!! the 
              sFavoriteIconName = "star"; // if the user has already saved this exact response in their favorites (maybe they forgot), mark it as such
              sFavoriteText = "saved in favorites";
            }
          });
          // BUG: this assigning of squest to each is WRONG or at least not unique, will mess with favorites
          aQuestionResponse.unshift({sQuestion: sInputMod, iIndex: iIndex, sResponse: sResponse, sFavoriteIconName: sFavoriteIconName, sFavoriteText: sFavoriteText, bError: false });
        });
      }
      this.setState({bLoading: false, aQuestionResponse: aQuestionResponse, sInput: ""});
    })
    .catch((error) => {
      aQuestionResponse.unshift({sQuestion: sInputMod, sResponse: "SERVER ERROR", bError: true});
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
    if (sOption === "sFullTextActive") {
      this.setState({sShowLinkActive: sOFF})
    }
    if (sOption === "sShowLinkActive") {
      this.setState({sFullTextActive: sOFF})
    }
  }
  handleToggleFavorite(iIndex) { // BUG: delete needs to work too!
    console.log("yahoooo");
    let aQuestionResponse = this.state.aQuestionResponse;
    let aFavorites = this.state.aFavorites;
    let bKeyExists = false;
    aFavorites.forEach(oElement => {
      if (oElement.sQuestion === aQuestionResponse[iIndex].sQuestion && oElement.iIndex === aQuestionResponse[iIndex].iIndex) {
        bKeyExists = true;
      }
    });
    if (!bKeyExists) { // only add it to the favorites if the key exists - removes any issue of seeing multiple identical responses when show favorites is selected
      aQuestionResponse[iIndex].sFavoriteIconName = aQuestionResponse[iIndex].sFavoriteIconName === "star outline" ? "star" : "star outline"; // toggle visual of if it is saved or not
      aQuestionResponse[iIndex].sFavoriteText = aQuestionResponse[iIndex].sFavoriteText === "favorite" ? "saved in favorites" : "favorite";
      aFavorites.push(aQuestionResponse[iIndex]); // push this response object to the favorites array
      localStorage.setItem("aFavorites", JSON.stringify(aFavorites)); // based on hydrateStateWithLocalStorage(), it is essential that the name of the item is the same as the state, i.e. "aFavorites"!!!
      this.setState({ aQuestionResponse: aQuestionResponse, aFavorites: aFavorites });
    }
  }
  handleDeleteFromFavorites(iIndex) {
    let aFavorites = this.state.aFavorites;
    aFavorites.splice(iIndex, 1); // remove the favorite at this position in the favorite array
    localStorage.setItem("aFavorites", JSON.stringify(aFavorites)); // based on hydrateStateWithLocalStorage(), it is essential that the name of the item is the same as the state, i.e. "aFavorites"!!!
    this.setState({ aFavorites: aFavorites });
  }
  clearQuestionResponseArray() {
    if (this.state.aQuestionResponse.length > 0) { // only make backup if there is actually something to backup
      this.setState({ aQuestionResponse: [], aBackupQuestionResponse: this.state.aQuestionResponse, bShowUndo: true}); // clear array, show
    } 
  }
  restoreOldQuestionResponseArray() {
    this.setState({ aQuestionResponse: this.state.aBackupQuestionResponse, aBackupQuestionResponse: [], bShowUndo: false}); // clear array, show
  }
  render () {
    const { sInput, sLanguage, bIgnoreLanguage, iNumberAnswers, bLoading, aQuestionResponse, aFavorites, sHelpActive, sColorizeActive, sFullTextActive, sShowLinkActive, sFavoritesActive, bModalOpen, bShowUndo } = this.state;
    let sHelpFieldClass = sHelpActive === sON ? "help-field__shown response-field" : "help-field__hidden response-field";
    let sDropdownDescriptionClass = bIgnoreLanguage ? "gray-text" : ""; // gray description text if the language dropdown is disabled
    let aRunningList = [];
    let aRunningFavoritesList = [];
    let sNumberDropdownText = 'No. answers (' + iNumberAnswers.toString() + ')';
    aQuestionResponse.forEach((oElement, iIndex) => {
      if (oElement.bError) { // no favoriting or answer number on an error element
        aRunningList.push(<div key={iIndex} className="responsive-width">
        <div style={{display: "block", margin:"0 auto"}}>
          <pre className="inline-pre">{aQuestionResponse[iIndex].sQuestion}</pre> 
        </div>
        <pre className="responsive-width">
            { sColorizeActive === sON ? <div dangerouslySetInnerHTML={{ __html: aQuestionResponse[iIndex].sResponse }} /> : aQuestionResponse[iIndex].sResponse }
          </pre>  
        </div>);
      } else {
        aRunningList.push(<div key={iIndex} className="responsive-width">
        <div style={{display: "block", margin:"0 auto"}} className="responsive-height">
          <pre className="inline-pre">{aQuestionResponse[iIndex].sQuestion}</pre> <pre className="inline-pre">Answer #{aQuestionResponse[iIndex].iIndex + 1}</pre> <Button className="pre-like button-offset" color='yellow' icon labelPosition="right" onClick={() => this.handleToggleFavorite(iIndex)}><Icon name={aQuestionResponse[iIndex].sFavoriteIconName}/>{aQuestionResponse[iIndex].sFavoriteText}</Button>
        </div>
        <pre className="responsive-width">
            { sColorizeActive === sON ? <div dangerouslySetInnerHTML={{ __html: aQuestionResponse[iIndex].sResponse }} /> : aQuestionResponse[iIndex].sResponse }
          </pre>  
        </div>);
      }
    });
    aFavorites.forEach((oElement, iIndex) => {
      aRunningFavoritesList.push(<div key={iIndex} className="responsive-width">
      <div style={{display: "block", margin:"0 auto"}}>
        <pre className="inline-pre">{aFavorites[iIndex].sQuestion}</pre> <pre className="inline-pre">Answer #{aFavorites[iIndex].iIndex + 1}</pre> <pre className="inline-pre">Favorite #{(iIndex + 1).toString()}</pre> <Button className="pre-like" icon labelPosition="right" onClick={() => this.handleDeleteFromFavorites(iIndex)} negative><Icon name="delete"/>delete from favorites</Button>
      </div>
      <pre className="responsive-width">
          { sColorizeActive === sON ? <div dangerouslySetInnerHTML={{ __html: aFavorites[iIndex].sResponse }} /> : aFavorites[iIndex].sResponse }
        </pre>  
      </div>);
    });
    let oFavorites = aRunningFavoritesList.length > 0 ? aRunningFavoritesList : <div><br/><p className="text-center">You haven't favorited anything! Star up some coolio code pieces!</p></div>;
    return (
      <div>
        <Container>
              <br/>
              <img className="text-center spin" style={{display: "block", margin:"0 auto"}} src={logoContrast} width="100px" alt="logo" />
              <h2 className="text-center">How Do I...</h2>
              <p className="text-center">Type any coding question into the form and press enter or submit!</p>
              <Input
                className="text-center input-width"
                style={{display: "block", margin:"0 auto"}}
                type="text"
                name="sInput"
                value={sInput}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder='your query here...'
              />
              <br/>
              <div className="text-center" style={{display: "block", margin:"0 auto"}}>
              <span className={sDropdownDescriptionClass}><i>fix language / tool / framework to: </i></span><Dropdown options={options} value={sLanguage} name="sLanguage" onChange={this.handleDropdownChange} disabled={bIgnoreLanguage}/>
              <br/>
              <br/>
              <Checkbox label="Ignore the dropdown, I'll type the language / tool / framework myself" checked={bIgnoreLanguage} onChange={this.handleToggleCheck} />
              <br/>
              <br/>
              <Button onClick={this.handleButtonPress} secondary>
                submit
              </Button>
              <br/>
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
              <Button onClick={this.clearQuestionResponseArray} negative>clear responses</Button> 
              { bShowUndo && <Button onClick={this.restoreOldQuestionResponseArray} positive>Undo?</Button> }
              </div>
              <br/>
              <p className="text-center">Other options (click to toggle):</p>
              <div className="text-center" style={{display: "block", margin:"0 auto"}}>
                  <Button className="pre-like" onClick={() => this.toggleOption("sHelpActive")}>show help{sHelpActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sColorizeActive")}>colorize responses{sColorizeActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sFullTextActive")}>show full text{sFullTextActive}</Button>
                  <Button className="pre-like" onClick={() => this.toggleOption("sShowLinkActive")}>show link only{sShowLinkActive}</Button>  
                  <Button className="pre-like" onClick={() => this.toggleOption("sFavoritesActive")}>show <span style={{color:"#fbbd08"}}>favorites</span>{sFavoritesActive}</Button>  
              </div>
                <div className="responsive-width">
                  { sHelpActive === sON && 
                  <div>
                    <pre className={sHelpFieldClass}>
                      {sHELP_STRING}
                    </pre> 
                    <span>***Any of these flags will still work in the query field, but note that all of them can also be handled by setting the various controls.</span>
                  </div>}
                </div>
                <Divider />
                <div className="responsive-width">
                  { sFavoritesActive === sON && oFavorites }      
                  { bLoading === true && <Loader/> }
                  { (sFavoritesActive === sOFF || sFavoritesActive === "") && aRunningList.length > 0 && aRunningList }    
                </div>
                <br/>
                <br/>  
                <br/>  
                <br/>  
                <br/>    
          </Container>
          <RequestModal bModalOpen={bModalOpen} options={options} closeModalFunction={this.handleModalClose}/>
        </div>
    )
  }
  componentDidMount() {
    this.hydrateStateWithLocalStorage();
  }
}

export default HowDoI;