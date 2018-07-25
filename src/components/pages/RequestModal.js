import React from 'react'
import { Modal, Form, Header, Icon, Message, Button } from 'semantic-ui-react'

var validator = require("email-validator");
const axios = require('axios');

class RequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sRequestLanguage: "",
      sRequestEmail: "",
      bLanguageEmpty: false,
      bEmailEmpty: false,
      bLanguageError: false,
      bEmailError: false,
      bResponseModalOpen: false,
      sResponseHeaderText: "",
      sResponseText: ""
    }
    this.checkForm = this.checkForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.handleConfirmationModalClose = this.handleConfirmationModalClose.bind(this);
  }
  handleInputChange(oEvent) {
      this.setState({ [oEvent.target.name]: oEvent.target.value });
  }
  checkForm() {
    this.setState({bLanguageEmpty: false, bEmailEmpty: false, bLanguageError: false, bEmailError: false}); // initialize form state
    const { sRequestLanguage, sRequestEmail } = this.state;
    let bLanguageEmpty = false;
    let bEmailEmpty = false;
    let bLanguageError = false;
    let bEmailError = false;
    // first check if fields are full
    if (sRequestLanguage === "") {
      bLanguageEmpty = true;
    }
    if (sRequestEmail === "") {
      bEmailEmpty = true;
    }
    if (bLanguageEmpty === true || bEmailEmpty === true) {
      this.setState({bLanguageEmpty: bLanguageEmpty, bEmailEmpty: bEmailEmpty});
      return;
    }
    // first check that the requested language is not in
    this.props.options.forEach((oOption) => {
      if (sRequestLanguage === oOption.key) {
        bLanguageError = true;
      }
    });
    if (!validator.validate(sRequestEmail)) {
       bEmailError = true;
    }
    if (bLanguageError === true || bEmailError === true) {
      this.setState({bLanguageError: bLanguageError, bEmailError: bEmailError});
      return;
    } else {
      this.sendEmail(); // send email
    }
  }
  sendEmail() {
    const { sRequestLanguage, sRequestEmail } = this.state;
    axios.post(process.env.REACT_APP_ROOT_URL + '/request', {
      sRequestEmail: sRequestEmail,
      sRequestLanguage: sRequestLanguage
    })
    .then((oResponse) => {
      console.log("ehre!!!")
      // let aResponses = oResponse.data.sResponse.split(sEQUALS);
      this.props.closeModalFunction(); // change the modal state from the parent
      this.setState({ bResponseModalOpen: true, sResponseHeaderText: "Thanks!", sResponseText: "Your request was successfully sent!"});
      console.log("here too");
    })
    .catch((error) => {
      this.setState({ bResponseModalOpen: true, sResponseHeaderText: "Uh oh...", sResponseText: "There was an error with your request. Perhaps our server exploded :("})
    });
  }
  handleConfirmationModalClose() {
    this.setState({ bResponseModalOpen: false });
  }
  render () {
    const { sRequestLanguage, sRequestEmail, bLanguageEmpty, bEmailEmpty, bLanguageError, bEmailError, bResponseModalOpen, sResponseHeaderText, sResponseText } = this.state;
    return (
      <div>
      <Modal
         open={this.props.bModalOpen}
         onClose={this.props.closeModalFunction}
         size='small'
       >
         <Header icon='send' content='Request a language / framework / tool' />
         <Modal.Content>
           <h3>Request a language, framework, or tool to be added to the dropdown! I'll get back to you as soon as possible!</h3>
             <Form error={bLanguageError}>
               <Form.Field error={bLanguageEmpty}>
                 <label>language / framework / tool</label>
                 <input onChange={this.handleInputChange} name="sRequestLanguage" placeholder='python' value={sRequestLanguage}/>
               </Form.Field>
               <Message
                 error
                 header='Duplicate Language'
                 content='This language is already in the dropdown!'
               />
             </Form>
            <Form error={bEmailError}>
               <Form.Field error={bEmailEmpty}>
                 <label>your email</label>
                 <input onChange={this.handleInputChange} name="sRequestEmail" placeholder='you@yours.com' value={sRequestEmail}/>
               </Form.Field>
               <Message
                 error
                 header='Invalid Email Address'
                 content='Please enter a valid email in the dropdown.'
               />
             </Form>
         </Modal.Content>
         <Modal.Actions>
           <Button color='green' onClick={this.checkForm} inverted>
             <Icon name='checkmark' /> Send!
           </Button>
         </Modal.Actions>
       </Modal>
       <Modal
          open={bResponseModalOpen}
          onClose={this.handleConfirmationModalClose}
          size='small'
        >
          <Header icon='check circle' content={sResponseHeaderText} />
          <Modal.Content>
            <h3>{sResponseText}</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.handleConfirmationModalClose} inverted>
              <Icon name='checkmark' /> OK
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default RequestModal;