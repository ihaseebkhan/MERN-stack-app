import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo, faTimes, faCheck, faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';
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
import $ from "jquery";

toast.configure();

export default class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memorials: [],
      actionId:0
    };
  }


  componentDidMount() {
    
    axios.get('http://localhost:3000/readMemorialsNotApproved')
      .then((res) => {
          this.setState({ memorials: res.data })
          
      })
      .catch((error) => {
        
      })
  }

  handleDeleteMemorial = (event) => {
    event.preventDefault();
    var deceasedId = {
        deceasedId: this.state.actionId
    }

    axios.post('http://localhost:3000/deleteMemorial', deceasedId)
        .then((res) => {
            $("#deleteModal").modal("toggle");
            toast.success("Memorial Deleted Successfully!")
console.log(res.data)

        })
        .catch((error) => {

        })
  }

  handleApproveMemorial = (event) => {
    event.preventDefault();
    var deceasedId = {
        deceasedId: this.state.actionId
    }

    axios.post('http://localhost:3000/approveMemorial', deceasedId)
        .then((res) => {
            $("#approveModal").modal("toggle");
            toast.success("Memorial Approved Successfully!")
console.log(res.data)

        })
        .catch((error) => {

        })
  }

  render() {
    var logo = require(`../person_data/logo1.png`);
    const { memorials, shareId } = this.state;
    const memorial=[];
    memorials.forEach((item, i, array) => {

      // get total seconds between the times
var delta = Math.abs(Date.now() - item.created_on) / 1000;

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
      var img='';
      if(item.display_pic!==null)
      img = require(`../person_data/${item.display_pic}`);
      memorial.push(<div class="card mb-2">
        <div class="row no-gutters">
          <div class="col-md-4">
          <Link to={{pathname:`/tribute/${item.deceased_id}`}}>
            <img class="card-img-top" width="100%" height="100%" src={img} alt="Display Picture" />
            </Link>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{item.firstname+' '+item.lastname}</h5>
    <p class="card-text"><small class="text-muted">{item.dob.split(' ')[2]+'-'+item.dod.split(' ')[2]}<br />{item.born_place+','+item.death_place}</small></p>
    <p class="card-text"><small class="text-muted" style={{ fontSize: "0.625em" }}>{time}</small><Link><FontAwesomeIcon className="text-muted float-right my-2" data-toggle="tooltip" data-placement="top" title="Delete" data-toggle="modal" data-target="#deleteModal" onClick={()=>this.setState({actionId:item.deceased_id})} icon={faTimes} /></Link><Link ><FontAwesomeIcon className="text-muted float-right my-2 mr-3" data-toggle="tooltip" data-placement="top" title="Approve" data-toggle="modal" data-target="#approveModal" onClick={()=>this.setState({actionId:item.deceased_id})} icon={faCheck} /></Link><Link to={{pathname:`/tribute/${item.deceased_id}`}}><FontAwesomeIcon className="text-muted float-right my-2 mr-3" data-toggle="tooltip" data-placement="top" title="Details" icon={faInfo} /></Link></p>
            </div>
          </div>
        </div>
      </div>)
    })
    return (

      <div className="container main-margin-top">
        <div className="row vh-100 gal_col_row">
          <div className="col-md-3 py-3 gal_col" id="hide-on-collapse">
            <div className="card sticky-top">
              <img className="card-img-top" src={logo} alt="Card image" />
              <div className="card-body">
                <p>3 wolf moon retro jean shorts chambray sustainable roof party. Shoreditch vegan artisan Helvetica. Tattooed Codeply Echo Park Godard kogi, vegan artisan Helvetica.  Tattooed Codeply Echo Park Godard kogi, next level irony ennui twee squid fap selvage. Meggings flannel Brooklyn literally small batch,
                        mumblecore PBR try-hard kale chips. Brooklyn vinyl.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 py-3 gal_col">


            {memorial}


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


        <div class="modal fade" id="approveModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Confirmation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to approve this memorial?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onClick={this.handleApproveMemorial} class="btn btn-success">Approve</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Confirmation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to delete this memorial?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onClick={this.handleDeleteMemorial} class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>
      </div>
    )
  }
}