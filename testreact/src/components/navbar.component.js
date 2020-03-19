import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faLock, faUser, faEnvelope, faSearch, faGlobeAmericas } from '@fortawesome/free-solid-svg-icons'
import $ from "jquery";

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validNameRegex = RegExp(/^[a-z ,.'-]+$/i);
const validUserNameRegex = RegExp(/^[a-zA-Z0-9.\-_$@*!]{3,30}$/i);

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.fbLogout = this.fbLogout.bind(this)
    this.logout = this.logout.bind(this)

    this.state = {
search:'',
      fbAuth: false,
      fbName: '',
      fbPicture: '',
      fbEmail: '',
      auth: localStorage.getItem('username') || '',
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      location: '',
      phone: '',
      errors: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        location: '',
        phone: ''
      }
    };

  }

  handleSearchChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({[name]: value });
    
  }

  handleChange = (event) => {
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
      case 'username':
        errors.username =
          value.length < 3 && value.length > 0
            ? 'Username must be atleast 3 characters long!'
            : errors.username =
            value.length < 1 ?
              'Username field cannot be empty!'
              : errors.username =
              validUserNameRegex.test(value)
                ? ''
                : 'Username is not valid!';
        break;
      case 'email':
        errors.email =
          value.length < 1 ?
            'Email field cannot be empty!'
            : errors.email =
            validEmailRegex.test(value)
              ? ''
              : 'Email address is not valid!';
        break;
      case 'password':
        errors.password =
          value.length < 8 && value.length > 0
            ? 'Password must be atleast 8 characters long!'
            : errors.password =
            value.length < 1 ?
              'Password field cannot be empty!'
              : '';
        break;
      case 'location':
        errors.location =
          value.length < 3 && value.length > 0
            ? 'Location must be atleast 3 characters long!'
            : errors.location =
            value.length < 1 ?
              'Location field cannot be empty!'
              : '';
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  }

  handleSubmitSignup = (event) => {
    event.preventDefault();
    let valid = true;
    const { errors } = this.state;
    if (this.state.firstname === "") errors.firstname = "Firstname field cannot be empty!";
    if (this.state.lastname === "") errors.lastname = "Lastname field cannot be empty!";
    if (this.state.username === "") errors.username = "Username field cannot be empty!";
    if (this.state.email === "") errors.email = "Email field cannot be empty!";
    if (this.state.password === "") errors.password = "Password field cannot be empty!";
    if (this.state.location === "") errors.location = "Location field cannot be empty!";
    if (this.state.phone === "") errors.phone = "Phone number field cannot be empty!";
    this.setState({ errors });
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    if (valid === true) {
      const user = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        location: this.state.location,
        phone: this.state.phone,
      }

      console.log(user);

      axios.post('http://localhost:3000/signup', user)
        .then((res) => {
          console.log(res)
          console.log(res.data);
          if (res.status) {
            this.setState({
              firstname: '',
              lastname: '',
              username: '',
              email: '',
              password: '',
              location: '',
              phone: '',
            })
            $("#signupModal").modal("toggle");
            $('#signupForm')[0].reset();
            $('#signupSuccessModal').modal('toggle');
          }
        })
        .catch((error) => {
          if (error.response.status) {
            this.state.errors.username = error.response.data;
            this.setState({ errors })
          }
        })

    }

  }

  handleCloseSignup = (event) => {
    event.preventDefault();
    const { errors } = this.state;
    errors.firstname = ''
    errors.lastname = ''
    errors.username = ''
    errors.email = ''
    errors.password = ''
    errors.location = ''
    errors.phone = ''
    this.setState({
      errors,
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      location: '',
      phone: ''
    });
    $('#signupForm')[0].reset();
  }

  handleSubmitSignin = (event) => {
    event.preventDefault();
    let valid = true;
    const { errors } = this.state;
    if (this.state.username === "") errors.username = "Username field cannot be empty!";
    if (this.state.password === "") errors.password = "Password field cannot be empty!";
    this.setState({ errors });
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    if (valid === true) {
      const user = {
        username: this.state.username,
        password: this.state.password
      }
      axios.post('http://localhost:3000/userSignin/', user)
        .then((res) => {
          if (res.status) {
            res.data === 'admin' ?
              localStorage.setItem('username', res.data)
              : localStorage.setItem('username', res.data[0].username)
            this.setState({ auth: localStorage.getItem('username') })
            $("#signinModal").modal("toggle");
            $('#signinForm')[0].reset();
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.state.errors.username = error.response.data;
            this.setState({ errors })
          } else
            if (error.response.status === 401) {
              this.state.errors.password = error.response.data;
              this.setState({ errors })
            }
        })
    }
  }

  handleCloseSignin = (event) => {
    event.preventDefault();
    const { errors } = this.state;
    errors.username = ''
    errors.password = ''
    this.setState({
      errors,
      username: '',
      password: '',
    });
    $('#signinForm')[0].reset();
  }

  responseFacebook = response => {
    console.log(response);
    if (response.status === 'unknown' || response.status === 'not_authorized'){

    }else{
      this.setState({
        fbAuth: true,
        fbName: response.name,
        fbPicture: response.picture.data.url,
        fbEmail: response.email
      });
    }

    console.log(this.state)

  }

  async fbLogout() {
    window.FB.logout()
    console.log("logged out!")
    await this.setState({
      fbAuth: false,
      fbName: '',
      fbPicture: '',
      fbEmail: ''
    });
    console.log(this.state)
  }

  logout() {
    localStorage.clear();
    this.setState({
      username: '',
      password: '',
      auth: ''
    });

  }

  render() {
    const { errors } = this.state;

    let Login;

    this.state.fbAuth ?
      Login =
      <div className="dropdown">
        <button type="button" className="btn btn-dark btn-sm dropdown-toggle mr-lg-5" data-toggle="dropdown" style={{ overflow: "hidden", minWidth: "95%", textOverflow: "ellipsis" }}>
          <img src={this.state.fbPicture} style={{ width: 30, borderRadius: 20 }} className="img-fluid mr-1" alt={this.state.fbName} />
          <span style={{ whiteSpace: "nowrap", textAlign: "center" }}>{this.state.fbName.split(' ')[0]}</span>
        </button>
        <div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
          <Link to="/" style={{ color: "white" }} className="dropdown-item bg-dark" onClick={this.fbLogout}>Logout</Link>
        </div>
      </div>
      : this.state.auth && this.state.auth !== "admin" ?
        Login =
        <div className="dropdown">
          <button type="button" className="btn btn-dark btn-sm dropdown-toggle mr-lg-5" data-toggle="dropdown" style={{ overflow: "hidden", minWidth: "95%", textOverflow: "ellipsis" }}>
            <img src="http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png" style={{ width: 30, borderRadius: 20 }} className="img-fluid mr-1" alt={this.state.auth} />
            <span style={{ whiteSpace: "nowrap", textAlign: "center" }}>{this.state.auth}</span>
          </button>
          <div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
            <Link to="/" style={{ color: "white" }} className="dropdown-item bg-dark" onClick={this.logout}>Logout</Link>
          </div>
        </div>
        : this.state.auth === "admin" ?
          Login =
          <div className="dropdown">
            <button type="button" className="btn btn-dark btn-sm dropdown-toggle mr-lg-5" data-toggle="dropdown" style={{ overflow: "hidden", minWidth: "95%", textOverflow: "ellipsis" }}>
              <img src="http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png" style={{ width: 30, borderRadius: 20 }} className="img-fluid mr-1" alt={this.state.auth} />
              <span style={{ whiteSpace: "nowrap", textAlign: "center" }}>{this.state.auth}</span>
            </button>
            <div className="dropdown-menu bg-dark" aria-labelledby="dropdownMenuButton">
              <Link to="/adminPanel" style={{ color: "white" }} className="dropdown-item bg-dark">Admin panel</Link>
              <Link to="/" style={{ color: "white" }} className="dropdown-item bg-dark" onClick={this.logout}>Logout</Link>
            </div>
          </div>
          : Login = <Link to="/" className="nav-link mr-sm-2" data-toggle="modal" data-target="#signinModal">Login</Link>


    return (
      <div>
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand"><h3>Vaalvu</h3></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse navbar-nav mr-auto" id="navbarSupportedContent">
              <div className="input-group my-2" id="hide-on-collapse">
                <input className="form-control-sm py-2 border-right-0 border" type="search" placeholder="Search a person,place or year" id="example-search-input" name="search" size="50" onChange={this.handleSearchChange} noValidate/>
                <span className="input-group-append">
                <Link to={{pathname:'/search',searchProps:this.state.search}} className="input-group btn btn-light border-left-0 border bg-white">
                    <FontAwesomeIcon icon={faSearch} />
                  </Link>
                </span>
              </div>
              <div className="input-group my-2" id="hide-on-expand">
                <input className="form-control py-2 border-right-0 border" type="search" placeholder="Search a person,place or year" id="example-search-input" name="search" onChange={this.handleSearchChange} noValidate/>
                <span className="input-group-append">
                <Link to={{pathname:'/search',searchProps:this.state.search}} className="input-group btn btn-light border-left-0 border bg-white">
                    <FontAwesomeIcon icon={faSearch} />
                  </Link>
                </span>
              </div>
              <div className="navbar-collapse mr-auto">
                {Login}
                <Link to="/createMemorial" style={{ whiteSpace: "nowrap", textAlign: "center" }} type="button" className="btn btn-success btn-sm">Create Memorial</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="modal fade" id="signinModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="login-form">
                  <form id="signinForm" noValidate>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseSignin}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h2 className="text-center">Vaalvu</h2>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                        </span>
                        <input type="text" className="form-control border-left-0 border" name="username" placeholder="Username" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.username.length > 0 &&
                        <span className='error'>{errors.username}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                        </span>
                        <input type="password" className="form-control border-left-0 border" name="password" placeholder="Password" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.password.length > 0 &&
                        <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="form-group">
                      <button type="button" onClick={this.handleSubmitSignin} className="btn btn-success btn-block login-btn">Log in</button>
                    </div>
                    <div className="clearfix">
                      <label className="pull-left checkbox-inline"><input type="checkbox" /> Remember me</label>
                      <a href="#" className="pull-right text-success">Forgot Password?</a>
                    </div>
                    <div className="or-seperator"><i>or</i></div>
                    <div className="text-center social-btn" data-dismiss="modal">
                      <FacebookLogin
                        appId="499157154045102"
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass="btn btn-primary btn-block"
                        icon="fa-facebook"
                      />
                    </div>
                  </form>
                  <div className="hint-text small mt-3">Don't have an account? <a href="#" className="text-success" data-dismiss="modal" data-toggle="modal" data-target="#signupModal">Sign up here!</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="signupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="login-form">
                  <form id="signupForm" noValidate>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseSignup}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h2 className="text-center">Register</h2>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faSignature} />
                          </div>
                        </span>
                        <input type="text" className="form-control border-left-0 border mr-2" name="firstname" placeholder="Firstname" required="required" onChange={this.handleChange} noValidate />
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faSignature} />
                          </div>
                        </span>
                        <input type="text" className="form-control border-left-0 border" name="lastname" placeholder="Lastname" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.firstname.length > 0 &&
                        <span className='error float-left mt-2 mb-3'>{errors.firstname}</span>}

                      {errors.lastname.length > 0 &&
                        <span className='error float-right mt-2 mb-3'>{errors.lastname}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                        </span>
                        <input type="text" className="form-control border-left-0 border" name="username" placeholder="Username" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.username.length > 0 &&
                        <span className='error'>{errors.username}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </div>
                        </span>
                        <input type="email" className="form-control border-left-0 border" name="email" placeholder="example@email.com" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.email.length > 0 &&
                        <span className='error'>{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                        </span>
                        <input type="password" className="form-control border-left-0 border" name="password" placeholder="Password" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.password.length > 0 &&
                        <span className='error'>{errors.password}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <span className="input-group-append">
                          <div className="input-group-text bg-transparent border-right-0 border">
                            <FontAwesomeIcon icon={faGlobeAmericas} />
                          </div>
                        </span>
                        <input type="text" className="form-control border-left-0 border" name="location" placeholder="Location" required="required" onChange={this.handleChange} noValidate />
                      </div>
                      {errors.location.length > 0 &&
                        <span className='error'>{errors.location}</span>}
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <IntlTelInput
                          containerClassName="intl-tel-input"
                          inputClassName="form-control"
                          fieldId="userPhoneNumber"
                          fieldName="userPhoneNumber"
                          onPhoneNumberChange={(status, value, countryData, number, id) => {
                            errors.phone = status ? '' : 'Phone number is not valid!';
                            this.setState({ errors, phone: number })
                          }}
                          onSelectFlag={(value, countryData, number, status) => {
                            errors.phone = status ? '' : 'Phone number is not valid!';
                            this.setState({ errors, phone: number })
                          }}
                        />
                      </div>
                      {errors.phone.length > 0 &&
                        <span className='error'>{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <button type="button" onClick={this.handleSubmitSignup} className="btn btn-success btn-block login-btn">Sign up</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="signupSuccessModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Signup Successful</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                User registered successfully!
      </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" data-dismiss="modal">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }
}