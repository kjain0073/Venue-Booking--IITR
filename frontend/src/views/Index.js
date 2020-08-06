import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { Container } from 'reactstrap';
import './../assets/css/hover.css'
import {Link} from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

class Index extends Component {

    render() { 
        return (  
            <Container>
                <img src={require('./../assets/img/asset.png')} class="img-fluid" alt="IIT ROORKEE"></img>
                <Link to='/login-page'>
                    <p id='venue' className='hvr-grow d-flex justify-content-center' style={{textAlign:"center"}}>Venue Booking</p>
                    <img src={require('./../assets/img/arrow.png')} id ='index' className='hvr-wobble-horizontal rounded mx-auto d-block' alt ='index'/>
                </Link>
            </Container>
        );
    }
}
 
export default Index;