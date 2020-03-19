import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSignature, faLock, faUser, faEnvelope, faSearch, faGlobeAmericas, faBirthdayCake, faSkullCrossbones, faMapMarkedAlt, faPray, faUsers, faClock, faBookDead, faGlobeEurope, faGlobeAsia, faHome } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import StripeCheckout from "react-stripe-checkout";

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validNameRegex = RegExp(/^[a-z ,.'-]+$/i);

toast.configure();

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageFiles: [],
      videoFiles: [],
      selectedFile: null,
      loaded: 0,
      dob: '',
      dod: '',
      dof: '',
      currentStep: 1,
      firstname: '',
      lastname: '',
      pob: '',
      pod: '',
      alias: '',
      community: '',
      religion: '',
      residence: '',
      pof: '',
      deathreason: '',
      cfirstname: '',
      clastname: '',
      relationship: '',
      cemail: '',
      clocation: '',
      cphone: '',
      errors: {
        firstname: '',
        lastname: '',
        dob: '',
        dod: '',
        pob: '',
        pod: '',
        alias: '',
        community: '',
        religion: '',
        residence: '',
        dof: '',
        pof: '',
        deathreason: '',
        cfirstname: '',
        clastname: '',
        relationship: '',
        cemail: '',
        clocation: '',
        cphone: ''
      }
    }
  }

  onPhoneNumberChange = (status, value, countryData, number, id) => {
    const { errors } = this.state;
    this.state.errors.cphone = status ? '' : 'Phone number is not valid!';
    this.setState({ errors, cphone: number })
  }
  onSelectFlag = (value, countryData, number, status) => {
    const { errors } = this.state;
    this.state.errors.cphone = status ? '' : 'Phone number is not valid!';
    this.setState({ errors, cphone: number })
  }

  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = []
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif', 'video/mp4', 'video/3gpp', 'video/x-ms-wmv', 'image/apng', 'image/bmp', 'image/x-icon', 'image/svg+xml', 'image/tiff', 'image/webp', 'image/jpg', 'video/webm', 'video/ogg']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err[x] = files[x].type + ' is not a supported format.\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  maxSelectFile = (event) => {
    let files = event.target.files
    if (files.length > 5) {
      const msg = 'Only 5 images/videos can be uploaded at a time'
      event.target.value = null
      toast.warn(msg)
      return false;
    }
    return true;
  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 20000000 //in bytes
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + ' is too large, please pick a smaller file.\n';
      }
    };
    for (var z = 0; z < err.length; z++) {// if message not same old that mean has error 
      // discard selected file
      toast.error(err[z])
      event.target.value = null
    }
    return true;
  }
  onChangeHandler = event => {
    var files = event.target.files
    if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      })
    }
  }
  onClickHandler = () => {
    if (this.state.selectedFile !== null) {
      const data = new FormData()
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append('file', this.state.selectedFile[x])
      }
      axios.post("http://localhost:3000/upload", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          })
        },
      })
        .then(res => { // then print response status
          toast.success('Upload successful')
          this.setState({ selectedFile: null })
          console.log(res)
          for (var x = 0; x < res.data.length; x++) {
            if (res.data[x].mimetype === 'image/png' || res.data[x].mimetype === 'image/jpeg' || res.data[x].mimetype === 'image/gif' || res.data[x].mimetype === 'image/apng' || res.data[x].mimetype === 'image/bmp' || res.data[x].mimetype === 'image/x-icon' || res.data[x].mimetype === 'image/svg+xml' || res.data[x].mimetype === 'image/tiff' || res.data[x].mimetype === 'image/webp' || res.data[x].mimetype === 'image/jpg') {
              this.setState(prevState => ({
                imageFiles: [...prevState.imageFiles, res.data[x].filename]
              }))
            }
            if (res.data[x].mimetype === 'video/x-ms-wmv' || res.data[x].mimetype === 'video/3gpp' || res.data[x].mimetype === 'video/mp4' || res.data[x].mimetype === 'video/webm' || res.data[x].mimetype === 'video/ogg') {
              this.setState(prevState => ({
                videoFiles: [...prevState.videoFiles, res.data[x].filename]
              }))
            }
          }
          console.log("images: " + this.state.imageFiles)
          console.log("videos: " + this.state.videoFiles)
        })
        .catch(err => { // then print response status
          toast.error('Upload failed')
        })
    } else { toast.error('No file chosen to upload!') }
  }

  handleDateChangeBirth = date => {
    let errors = this.state.errors;
    errors.dob =
      date.length < 1 ?
        'Place of Birth field cannot be empty!'
        : '';
    this.setState({
      errors,
      dob: date
    });
  };

  handleDateChangeDeath = date => {
    let errors = this.state.errors;
    errors.dod =
      date.length < 1 ?
        'Place of Death field cannot be empty!'
        : '';
    this.setState({
      errors,
      dod: date
    });
  };

  handleDateChangeFuneral = date => {
    this.setState({
      dof: date
    });
  };

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'firstname':
        errors.firstname =
          value.length < 3 && value.length > 0
            ? 'Firstname atleast 3 characters long!'
            : errors.firstname =
            value.length < 1 ?
              'Firstname field cannot be empty!'
              : errors.firstname =
              validNameRegex.test(value)
                ? ''
                : 'Firstname is not valid!';
        break;
      case 'lastname':
        errors.lastname =
          value.length < 3 && value.length > 0
            ? 'Lastname atleast 3 characters long!'
            : errors.lastname =
            value.length < 1 ?
              'Lastname field cannot be empty!'
              : errors.lastname =
              validNameRegex.test(value)
                ? ''
                : 'Lastname is not valid!';
        break;
      case 'pob':
        errors.pob =
          value.length < 3 && value.length > 0
            ? 'Place of Birth must be atleast 3 characters long!'
            : errors.pob =
            value.length < 1 ?
              'Place of Birth field cannot be empty!'
              : '';
        break;
      case 'pod':
        errors.pod =
          value.length < 3 && value.length > 0
            ? 'Place of Death must be atleast 3 characters long!'
            : errors.pod =
            value.length < 1 ?
              'Place of Death field cannot be empty!'
              : '';
        break;
      case 'cfirstname':
        errors.cfirstname =
          value.length < 3 && value.length > 0
            ? 'Firstname atleast 3 characters long!'
            : errors.cfirstname =
            value.length < 1 ?
              'Firstname field cannot be empty!'
              : errors.cfirstname =
              validNameRegex.test(value)
                ? ''
                : 'Firstname is not valid!';
        break;
      case 'clastname':
        errors.clastname =
          value.length < 3 && value.length > 0
            ? 'Lastname atleast 3 characters long!'
            : errors.clastname =
            value.length < 1 ?
              'Lastname field cannot be empty!'
              : errors.clastname =
              validNameRegex.test(value)
                ? ''
                : 'Lastname is not valid!';
        break;
      case 'relationship':
        errors.relationship =
          value.length < 3 && value.length > 0
            ? 'Relationship must be atleast 3 characters long!'
            : errors.relationship =
            value.length < 1 ?
              'Relationship field cannot be empty!'
              : errors.relationship =
              validNameRegex.test(value)
                ? ''
                : 'Relationship is not valid!';
        break;
      case 'cemail':
        errors.cemail =
          value.length < 1 ?
            'Email field cannot be empty!'
            : errors.cemail =
            validEmailRegex.test(value)
              ? ''
              : 'Email address is not valid!';
        break;
      case 'clocation':
        errors.clocation =
          value.length < 3 && value.length > 0
            ? 'Location must be atleast 3 characters long!'
            : errors.clocation =
            value.length < 1 ?
              'Location field cannot be empty!'
              : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  validMemForm = () => {
    let age = parseInt(this.state.dod.toString().split(' ')[3]) - parseInt(this.state.dob.toString().split(' ')[3]);
    let dob1 = this.state.dob.toString().split(' ')[2] + ' ' + this.state.dob.toString().split(' ')[1] + ' ' + this.state.dob.toString().split(' ')[3]
    let dod1 = this.state.dod.toString().split(' ')[2] + ' ' + this.state.dod.toString().split(' ')[1] + ' ' + this.state.dod.toString().split(' ')[3]
    let dof1;
    if(this.state.dof===''){
    dof1=this.state.dof;
    }else{
    dof1 = this.state.dof.toString().split(' ')[2] + ' ' + this.state.dof.toString().split(' ')[1] + ' ' + this.state.dof.toString().split(' ')[3]
    }
    const personDetails = {
      age: age,
      imageFiles: this.state.imageFiles,
      videoFiles: this.state.videoFiles,
      dob: dob1,
      dod: dod1,
      dof: dof1,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      pob: this.state.pob,
      pod: this.state.pod,
      alias: this.state.alias,
      community: this.state.community,
      religion: this.state.religion,
      residence: this.state.residence,
      pof: this.state.pof,
      deathreason: this.state.deathreason,
      cfirstname: this.state.cfirstname,
      clastname: this.state.clastname,
      relationship: this.state.relationship,
      cemail: this.state.cemail,
      clocation: this.state.clocation,
      cphone: this.state.cphone
    }

    

    axios.post('http://localhost:3000/createMemorial', personDetails)
      .then((res) => {
        
        if (res.status) {
          this.setState({
            imageFiles: [],
            videoFiles: [],
            selectedFile: null,
            loaded: 0,
            dob: '',
            dod: '',
            dof: '',
            currentStep: 1,
            firstname: '',
            lastname: '',
            pob: '',
            pod: '',
            alias: '',
            community: '',
            religion: '',
            residence: '',
            pof: '',
            deathreason: '',
            cfirstname: '',
            clastname: '',
            relationship: '',
            cemail: '',
            clocation: '',
            cphone: '',
            errors: {
              firstname: '',
              lastname: '',
              dob: '',
              dod: '',
              pob: '',
              pod: '',
              alias: '',
              community: '',
              religion: '',
              residence: '',
              dof: '',
              pof: '',
              deathreason: '',
              cfirstname: '',
              clastname: '',
              relationship: '',
              cemail: '',
              clocation: '',
              cphone: ''
            }
          })

        }
      })
      .catch((error) => {

      })
  }

  _next = (event) => {
    event.preventDefault();
    let currentStep = this.state.currentStep
    let valid = true;
    const { errors } = this.state;
    if (currentStep === 1) {
      if (this.state.firstname === "") errors.firstname = "Firstname field cannot be empty!";
      if (this.state.lastname === "") errors.lastname = "Lastname field cannot be empty!";
      if (this.state.dob === "") errors.dob = "Date of Birth field cannot be empty!";
      if (this.state.dod === "") errors.dod = "Date of Death field cannot be empty!";
      if (this.state.pob === "") errors.pob = "Place of Birth field cannot be empty!";
      if (this.state.pod === "") errors.pod = "Place of Death field cannot be empty!";
      this.setState({ errors });
      Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
      );
    }
    if (currentStep === 2) {
      this.setState({
        errors: {
          cfirstname: '',
          clastname: '',
          relationship: '',
          cemail: '',
          clocation: '',
          cphone: ''
        }
      })
    }
    if (currentStep === 3) {
      if (this.state.cfirstname === "") errors.cfirstname = "Firstname field cannot be empty!";
      if (this.state.clastname === "") errors.clastname = "Lastname field cannot be empty!";
      if (this.state.relationship === "") errors.relationship = "Relationship field cannot be empty!";
      if (this.state.cemail === "") errors.cemail = "Email field cannot be empty!";
      if (this.state.clocation === "") errors.clocation = "Location field cannot be empty!";
      if (this.state.cphone === "") errors.cphone = "Phone number field cannot be empty!";
      this.setState({ errors });
      Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
      );
    }
    if (valid === true) {
      let currentStep = this.state.currentStep
      currentStep = currentStep >= 3 ? 4 : currentStep + 1
      this.setState({
        currentStep: currentStep
      })
    }
  }

  _prev = () => {
    let currentStep = this.state.currentStep
    if (currentStep === 2)
      this.setState({
        firstname: '',
        lastname: '',
        dob: '',
        dod: '',
        pob: '',
        pod: '',
        alias: '',
        community: '',
        religion: '',
        residence: '',
        dof: '',
        pof: '',
        deathreason: '',
        errors: {
          firstname: '',
          lastname: '',
          dob: '',
          dod: '',
          pob: '',
          pod: '',
          alias: '',
          community: '',
          religion: '',
          residence: '',
          dof: '',
          pof: '',
          deathreason: ''
        }
      })
    if (currentStep === 3)
      this.setState({
        selectedFile: null,
        loaded: 0,
        imageFiles: [],
        videoFiles: []
      })
    if (currentStep === 4)
      this.setState({
        cfirstname: '',
        clastname: '',
        relationship: '',
        cemail: '',
        clocation: '',
        cphone: '',
        errors: {
          cfirstname: '',
          clastname: '',
          relationship: '',
          cemail: '',
          clocation: '',
          cphone: ''
        }
      })
    currentStep = currentStep <= 1 ? 1 : currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  /*
  * the functions for our button
  */
  previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
        <button
          className="btn btn-secondary"
          type="button" onClick={this._prev}>
          Previous
      </button>
      )
    }
    return null;
  }

  nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 4) {
      return (
        <button
          className="btn btn-success float-right"
          type="button" onClick={this._next}>
          Next
      </button>
      )
    } else {

    }
  }

  render() {
    return (

      <div className="container main-margin-top">
        <div className="row vh-100 gal_col_row">
          <div className="col-md-3 py-3 gal_col" id="hide-on-collapse">
            <div className="card sticky-top">
              <img className="card-img-top" src="//placehold.it/700x400" alt="Card image" />
              <div className="card-body">
                <p>3 wolf moon retro jean shorts chambray sustainable roof party. Shoreditch vegan artisan Helvetica. Tattooed Codeply Echo Park Godard kogi, vegan artisan Helvetica.  Tattooed Codeply Echo Park Godard kogi, next level irony ennui twee squid fap selvage. Meggings flannel Brooklyn literally small batch,
                        mumblecore PBR try-hard kale chips. Brooklyn vinyl.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 py-3 gal_col" >

            <div id="memForm" >

              <React.Fragment >
                <h1>Memorial 💐</h1>


                <form onSubmit={this.handleSubmit}>
                  {/* 
        render the form steps and pass required props in
      */}
                  <Step1
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    handleDateChangeBirth={this.handleDateChangeBirth}
                    handleDateChangeDeath={this.handleDateChangeDeath}
                    handleDateChangeFuneral={this.handleDateChangeFuneral}
                    dob={this.state.dob}
                    dod={this.state.dod}
                    dof={this.state.dof}
                    errors={this.state.errors}
                  />
                  <Step2
                    currentStep={this.state.currentStep}
                    onChangeHandler={this.onChangeHandler}
                    loaded={this.state.loaded}
                    onClickHandler={this.onClickHandler}
                  />
                  <Step3
                    currentStep={this.state.currentStep}
                    handleChange={this.handleChange}
                    errors={this.state.errors}
                    onPhoneNumberChange={this.onPhoneNumberChange}
                    onSelectFlag={this.onSelectFlag}
                  />
                  <Step4
                    currentStep={this.state.currentStep}
                    validMemForm={this.validMemForm}
                  />
                  {this.previousButton()}
                  {this.nextButton()}

                </form>
              </React.Fragment>

            </div>

          </div>
          <div className="col-md-3 py-3 gal_col" id="hide-on-collapse">
            <div className="card sticky-top">
              <div className="card-body">

                <p>Ethical Kickstarter PBR asymmetrical lo-fi. Dreamcatcher street art Carles, stumptown gluten-free Kickstarter artisan Wes Anderson wolf pug. Godard sustainable you probably haven't heard of them, vegan farm-to-table Williamsburg slow-carb
                    readymade disrupt deep v. Meggings seitan Wes Anderson semiotics, cliche American Apparel whatever. Helvetica cray plaid, vegan brunch Banksy leggings +1 direct trade. Wayfarers codeply PBR selfies. Banh mi McSweeney's Shoreditch
                        selfies, forage fingerstache food truck occupy YOLO Pitchfork fixie iPhone fanny pack art party Portland.</p>

                <p>Sriracha biodiesel taxidermy organic post-ironic, Intelligentsia salvia mustache 90's code editing brunch. Butcher polaroid VHS art party, hashtag Brooklyn deep v PBR narwhal sustainable mixtape swag wolf squid tote bag. Tote bag cronut
                    semiotics, raw denim deep v taxidermy messenger bag. Tofu YOLO Etsy, direct trade ethical Odd Future jean shorts paleo. Forage Shoreditch tousled aesthetic irony, street art organic Bushwick artisan cliche semiotics ugh synth chillwave
                        meditation. Shabby chic lomo plaid vinyl chambray Vice. Vice sustainable cardigan, Williamsburg master cleanse hella DIY 90's blog.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}



function Step1(props) {
  if (props.currentStep !== 1) {
    return null
  }
  return (
    <React.Fragment>
      <div>
        <p>Step {props.currentStep} (Person's Details)</p>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSignature} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border mr-2" name="firstname" placeholder="Firstname" required="required" onChange={props.handleChange} noValidate />
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSignature} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="lastname" placeholder="Lastname" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.firstname.length > 0 &&
            <span className='error float-left mt-2 mb-3'>{props.errors.firstname}</span>}

          {props.errors.lastname.length > 0 &&
            <span className='error float-right mt-2 mb-3'>{props.errors.lastname}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faBirthdayCake} />
              </div>
            </span>
            <DatePicker
              className="form-control border-left-0 border"
              selected={props.dob}
              onChange={props.handleDateChangeBirth}
              placeholderText="Date of Birth"
            />
          </div>
          {props.errors.dob.length > 0 &&
            <span className='error'>{props.errors.dob}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSkullCrossbones} />
              </div>
            </span>
            <DatePicker
              className="form-control border-left-0 border"
              selected={props.dod}
              onChange={props.handleDateChangeDeath}
              placeholderText="Date of Death"
            />
          </div>
          {props.errors.dod.length > 0 &&
            <span className='error'>{props.errors.dod}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faGlobeEurope} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="pob" placeholder="Place of Birth" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.pob.length > 0 &&
            <span className='error'>{props.errors.pob}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faGlobeAsia} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="pod" placeholder="Place of Death" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.pod.length > 0 &&
            <span className='error'>{props.errors.pod}</span>}
        </div>
        <div className="or-seperator"><i>Optional</i></div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSignature} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="alias" placeholder="Alias" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.alias.length > 0 &&
            <span className='error'>{props.errors.alias}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="community" placeholder="Community" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.community.length > 0 &&
            <span className='error'>{props.errors.community}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faPray} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="religion" placeholder="Religion" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.religion.length > 0 &&
            <span className='error'>{props.errors.religion}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faHome} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="residence" placeholder="Residence" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.residence.length > 0 &&
            <span className='error'>{props.errors.residence}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faClock} />
              </div>
            </span>
            <DatePicker
              className="form-control border-left-0 border"
              selected={props.dof}
              onChange={props.handleDateChangeFuneral}
              placeholderText="Funeral Date"
            />
          </div>
          {props.errors.dof.length > 0 &&
            <span className='error'>{props.errors.dof}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faMapMarkedAlt} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="pof" placeholder="Funeral Location" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.pof.length > 0 &&
            <span className='error'>{props.errors.pof}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faBookDead} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="deathreason" placeholder="Reason of Death" required="required" onChange={props.handleChange} noValidate />
          </div>
          {props.errors.deathreason.length > 0 &&
            <span className='error'>{props.errors.deathreason}</span>}
        </div>
      </div>
    </React.Fragment>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null
  }
  return (
    <React.Fragment>
      <div>
        <p>Step {props.currentStep} (Person's images/videos (Optional))</p>
        <div class="form-group files text-center">
          <label>Upload upto 5 images/videos. (First image is display picture, Max limit: 20mb/file) </label>
          <input type="file" class="form-control" multiple onChange={props.onChangeHandler} />
        </div>
        <div class="form-group">
          <ToastContainer />
          <Progress max="100" color="success" value={props.loaded} >{Math.round(props.loaded, 2)}%</Progress>
        </div>
        <button type="button" class="btn btn-primary btn-block" onClick={props.onClickHandler}>Upload</button>
        <br />
      </div>
    </React.Fragment>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null
  }
  const { errors } = props;
  return (
    <React.Fragment>
      <div>
        <p>Step {props.currentStep} (Contact details)</p>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSignature} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border mr-2" name="cfirstname" placeholder="Firstname" onChange={props.handleChange} noValidate />
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faSignature} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="clastname" placeholder="Lastname" onChange={props.handleChange} noValidate />
          </div>
          {errors.cfirstname.length > 0 &&
            <span className='error float-left mt-2 mb-3'>{errors.cfirstname}</span>}

          {errors.clastname.length > 0 &&
            <span className='error float-right mt-2 mb-3'>{errors.clastname}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faHeart} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="relationship" placeholder="Relationship to Deceased" onChange={props.handleChange} noValidate />
          </div>
          {errors.relationship.length > 0 &&
            <span className='error'>{errors.relationship}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
            </span>
            <input type="email" className="form-control border-left-0 border" name="cemail" placeholder="example@email.com" onChange={props.handleChange} noValidate />
          </div>
          {errors.cemail.length > 0 &&
            <span className='error'>{errors.cemail}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-append">
              <div className="input-group-text bg-transparent border-right-0 border">
                <FontAwesomeIcon icon={faGlobeAmericas} />
              </div>
            </span>
            <input type="text" className="form-control border-left-0 border" name="clocation" placeholder="Location" onChange={props.handleChange} noValidate />
          </div>
          {errors.clocation.length > 0 &&
            <span className='error'>{errors.clocation}</span>}
        </div>
        <div className="form-group">
          <div className="input-group">
            <IntlTelInput
              containerClassName="intl-tel-input"
              inputClassName="form-control"
              fieldId="userPhoneNumber"
              fieldName="userPhoneNumber"
              onPhoneNumberChange={props.onPhoneNumberChange}
              onSelectFlag={props.onSelectFlag}
            />
          </div>
          {errors.cphone.length > 0 &&
            <span className='error'>{errors.cphone}</span>}
        </div>
      </div>
    </React.Fragment>
  );
}

function Step4(props) {
  if (props.currentStep !== 4) {
    return null
  }
  async function handleToken(token, addresses) {
    const response = await axios.post(
      "http://localhost:3000/checkout",
      { token }
    );
    const { status } = response.data;
    console.log("Response:", response.data);
    if (status === "success") {
      toast("Payment successful, Pending admin approval!", { type: "success" });
      props.validMemForm();
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }
  return (<div style={{ textAlign: "center" }}>
    <br />
    <StripeCheckout
      stripeKey="pk_test_x2T2FgA8MvV0o4qd1WmWDBEH00iaWQMmnC"
      token={handleToken}
      amount={100 * 100}
      name="Memorial"
    />
    <br />
    <br />
  </div>
  )
}