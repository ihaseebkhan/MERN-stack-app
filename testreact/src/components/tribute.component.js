import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import {
    EmailShareButton,
    FacebookShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";
import {
    FacebookShareCount,
    OKShareCount,
    PinterestShareCount,
    RedditShareCount,
    TumblrShareCount,
    VKShareCount,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon,
} from "react-share";

const validNameRegex = RegExp(/^[a-z ,.'-]+$/i);

export default class Tribute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname:'',
            lastname:'',
            location:'',
            tribute:'',
            tributes: [],
            memorial: '',
            images: [],
            videos: [],
            contact: '',
            shareId: 0,
            errors: {
                firstname: '',
                lastname: '',
                location:'',
                tribute:''
            }
        };
    }

    componentDidMount() {
        var deceasedId = {
            deceasedId: this.props.match.params.id
        }

        axios.post('http://localhost:3000/readTribute', deceasedId)
            .then((res) => {
                this.setState({ tributes: res.data })
console.log(this.state.tributes)

            })
            .catch((error) => {

            })

        axios.post('http://localhost:3000/readImages', deceasedId)
            .then((res) => {
                this.setState({ images: res.data })
                console.log(this.state.images)

            })
            .catch((error) => {

            })

        axios.post('http://localhost:3000/readVideos', deceasedId)
            .then((res) => {
                this.setState({ videos: res.data })
                console.log(this.state.videos)

            })
            .catch((error) => {

            })

        axios.post('http://localhost:3000/readMemorial', deceasedId)
            .then((res) => {
                this.setState({ memorial: res.data[0] })


            })
            .catch((error) => {

            })

        axios.post('http://localhost:3000/readContact', deceasedId)
            .then((res) => {
                this.setState({ contact: res.data[0] })
                console.log(this.state.contact)


            })
            .catch((error) => {

            })
    }

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
          case 'location':
            errors.location =
              value.length < 3 && value.length > 0
                ? 'Location atleast 3 characters long!'
                : errors.location =
                value.length < 1 ?
                  'Location field cannot be empty!'
                  : '';
            break;
            case 'tribute':
            errors.tribute =
              value.length < 3 && value.length > 0
                ? 'Tribute must be atleast 3 characters long!'
                : errors.tribute =
                value.length < 1 ?
                  'Tribute field cannot be empty!'
                  : '';
            break;
          default:
            break;
        }

        this.setState({ errors, [name]: value });
    }

    handleSubmitTribute = (event) => {
        event.preventDefault();
        let valid = true;
    const { errors } = this.state;
    if (this.state.firstname === "") errors.firstname = "Firstname field cannot be empty!";
    if (this.state.lastname === "") errors.lastname = "Lastname field cannot be empty!";
    if (this.state.location === "") errors.location = "Location field cannot be empty!";
    if (this.state.tribute === "") errors.tribute = "Tribute field cannot be empty!";
    this.setState({ errors });
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    if (valid === true) {
        const user = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            location: this.state.location,
            tribute: this.state.tribute,
            deceasedId: this.props.match.params.id
          }
          axios.post('http://localhost:3000/createTribute', user)
          .then((res) => {
            console.log(res)
            console.log(res.data);
            if (res.status) {
              this.setState({
                firstname: '',
                lastname: '',
                location: '',
                tribute: '',
              })
              toast.success("Tribute posted successfully!")
            }
          })
          .catch((error) => {
            console.log(error)
          })
        }
    }

    
    render() {
        let errors = this.state.errors;
        var logo = require(`../person_data/logo1.png`);
        const { memorial, shareId, images, videos, contact } = this.state;
        console.log(memorial)
        var img = '';
        if (memorial.display_pic !== null && memorial.display_pic !== undefined)
            img = require(`../person_data/${memorial.display_pic}`);

        var bgImg = require(`../person_data/bgImg.jpg`);
        const image = [];
        images.forEach((item, i, array) => {
            image.push(
                <div class="col-md-2">

                    <img class="card-img-top" width="100%" height="100%" src={require(`../person_data/${item.image}`)} alt="Picture" />

                </div>

            )
        })
        const video = [];

        videos.forEach((item, i, array) => {
            video.push(
                <div class="col-md-3">

                    <div class="embed-responsive embed-responsive-16by9">
                        <iframe class="embed-responsive-item" src={require(`../person_data/${item.video}`)} allowfullscreen></iframe>
                    </div>

                </div>

            )
        })



        const { tributes } = this.state;
        const eachTribute=[];
        tributes.forEach((item, i, array) => {
    
          // get total seconds between the times
    var delta = Math.abs(Date.now() - item.date) / 1000;
    
    var weeks = Math.floor(delta / 604800);
    delta -= weeks * 604800;
    
    
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    
    // what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required
          var time='';
          if(weeks!==0){
            time=`${weeks} weeks ago`;
          }else if(days!==0){
            time=`${days} days ago`;
          }else if(hours!==0){
            time=`${hours} hours ago`;
          }else if(minutes!==0){
            time=`${minutes} minutes ago`;
          }else if(seconds!==0){
            time=`${seconds} seconds ago`;
          }
          
          
          eachTribute.push(<div class="card mb-2">
          <div class="card-body">
        <h5 class="card-title">📜 {item.message}</h5>
        <p class="card-text">{item.firstname+' '+item.lastname}<br/><small class="text-muted" style={{ fontSize: "0.625em" }}>{item.location} • {time}</small></p>
          </div>
        </div>)
        })




        return (

            <div className="container main-margin-top">

                <div className="row vh-100">

                    <div className="col-md-12 py-3">
                        <div class="card img-fluid">
                            <img class="card-img-top" src={bgImg} alt="Background image" style={{ width: "100%" }} />
                            <div class="card-img-overlay">

                                <div class="card mb-2" style={{ backgroundColor: "transparent" }}>
                                    <div class="row no-gutters">
                                        <div class="col-md-4">

                                            <img class="card-img-top" width="100%" height="100%" src={img} alt="Display Picture" />

                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title" style={{ color: "white" }}>{memorial.firstname + ' ' + memorial.lastname}</h5>
                                                <p class="card-text"><small class="text-muted">{'Date of Birth: ' + memorial.dob + ' - ' + 'Date of Death: ' + memorial.dod}<br />{'Place of Birth: ' + memorial.born_place + ' - ' + 'Place of Death: ' + memorial.death_place}<br />{'Age: ' + memorial.age}</small></p>
                                                <p class="card-text"><Link><FontAwesomeIcon className="text-muted float-right my-2" data-toggle="tooltip" data-placement="top" title="Share this memorial" data-toggle="modal" data-target="#shareModal" onClick={() => this.setState({ shareId: memorial.deceased_id })} icon={faShareAlt} /></Link></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card mb-2" style={{ backgroundColor: "transparent" }}>
                                    <div class="row">
                                        {image}
                                    </div>
                                </div>
                                <div class="card mb-2" style={{ backgroundColor: "transparent" }}>
                                    <div class="row">
                                        {video}
                                    </div>
                                </div>
                                <div class="card mb-2" style={{ backgroundColor: "transparent" }}>
                                    <div class="row no-gutters">
                                        <div class="col-md-4">

                                            <div class="card-body">
                                                <h5 class="card-title" style={{ color: "white" }}>📞Contact Information:</h5>
                                                <p class="card-text"><small class="text-muted">{contact.firstname + ' ' + contact.lastname}</small><br /><small class="text-muted">{'Relationship: ' + contact.relationship}<br />{'Email: ' + contact.email}<br />{'Location: ' + contact.location}<br />{'Mobile Number: ' + contact.mobile_number}</small></p>
                                            </div>

                                        </div>
                                        <div class="col-md-8">

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="col-md-3 gal_col" id="hide-on-collapse">
                        <div className="card sticky-top">
                            <img className="card-img-top" src={logo} alt="Card image" />
                            <div className="card-body">
                                <p>3 wolf moon retro jean shorts chambray sustainable roof party. Shoreditch vegan artisan Helvetica. Tattooed Codeply Echo Park Godard kogi, vegan artisan Helvetica.  Tattooed Codeply Echo Park Godard kogi, next level irony ennui twee squid fap selvage. Meggings flannel Brooklyn literally small batch,
                        mumblecore PBR try-hard kale chips. Brooklyn vinyl.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 gal_col">


                        <div class="container-fluid py-3 bg-white mb-2">
                            <form id="contact-form" method="post" action="contact.php" role="form">
                                <div class="messages"></div>
                                <div class="controls">
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                
                                                <input id="form_name" type="text" name="firstname" class="form-control" placeholder="Firstname" required="required" data-error="name is required." value={this.state.firstname} onChange={this.handleChange} noValidate/>
                                                <div class="help-block with-errors"></div>
                                                {errors.firstname.length > 0 &&
            <span className='error'>{errors.firstname}</span>}
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                
                                                <input id="form_email" type="text" name="lastname" class="form-control" placeholder="Lastname" required="required" data-error="Valid email is required." value={this.state.lastname} onChange={this.handleChange} noValidate/>
                                                <div class="help-block with-errors"></div>
                                                {errors.lastname.length > 0 &&
            <span className='error'>{errors.lastname}</span>}
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="form-group">
                                                
                                                <input id="form_email" type="text" name="location" class="form-control" placeholder="Location" required="required" data-error="Valid email is required." value={this.state.location} onChange={this.handleChange} noValidate/>
                                                <div class="help-block with-errors"></div>
                                                {errors.location.length > 0 &&
            <span className='error'>{errors.location}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>

                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                           
                                            <textarea id="form_message" name="tribute" class="form-control" placeholder="Write your tribute..." rows="4" required="required" data-error="send a message." value={this.state.tribute} onChange={this.handleChange} noValidate/>
                                            <div class="help-block with-errors"></div>
                                            {errors.tribute.length > 0 &&
            <span className='error'>{errors.tribute}</span>}
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                    <button type="button" onClick={this.handleSubmitTribute} className="btn btn-success btn-block">Post Tribute</button>
                                    </div>
                                </div>
                                 
                            </form>

                            

                        </div>


                        {eachTribute}


                    </div>
                    <div className="col-md-3 gal_col" id="hide-on-collapse">
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





                <div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Share</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-center">
                                <FacebookShareButton className="mr-4" url={window.location.href}><FacebookIcon size={32} round={true} /></FacebookShareButton>
                                <WhatsappShareButton className="mr-4" url={window.location.href}><WhatsappIcon size={32} round={true} /></WhatsappShareButton>
                                <TwitterShareButton className="mr-4" url={window.location.href}><TwitterIcon size={32} round={true} /></TwitterShareButton>
                                <LinkedinShareButton className="mr-4" url={window.location.href}><LinkedinIcon size={32} round={true} /></LinkedinShareButton>
                                <ViberShareButton className="mr-4" url={window.location.href}><ViberIcon size={32} round={true} /></ViberShareButton>
                                <LineShareButton url={window.location.href}><LineIcon size={32} round={true} /></LineShareButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}