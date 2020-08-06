import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import {Link} from 'react-router-dom'

import { Breadcrumb, BreadcrumbItem , Col, Tooltip} from 'reactstrap';


class VenuePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:false
        }
    }
    toggle = () => {
        this.setState({tooltipOpen: !this.state.tooltipOpen})
    }
    // state = {  }
    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isSignedIn');
        localStorage.removeItem('user')
        window.location.href = '/login-page'
    }

    render() { 
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const params = new URLSearchParams(window.location.search)
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]
        return ( 
            <section>
                {/* <MainHeader /> */}
                <div className="container">
                    <div>
                        
                        <Breadcrumb>
                            <BreadcrumbItem><Link to='/home'>Home</Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to={`/calender-page`}>Calender</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Choose Venue</BreadcrumbItem>
                            <Col className="d-flex justify-content-end">
                                <ul style={{listStyleType:"none"}}>
                                    <li> {user.fullName} </li>
                                    <li> {user.email} <span className="fa fa-sign-out" id="TooltipExample" style={{color:"#0083ff"}} onClick={this.handleLogout}></span></li>
                                    <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
                                        Logout
                                    </Tooltip>
                                </ul>
                                
                            </Col>
                        </Breadcrumb>
                        
                    </div>
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">    
                            <div className="panel panel-info" style={{margin:"20px"}}>
                                <div style={{textAlign:"center"}}>
                                    Choose Venue:
                                </div>

                                <div className="panel-body">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                        
                                            </div>
                                        </div>
                                    </div>
                                </div>  

                                <div id="venuePanel" style={{padding:"10px"}}>
                                    <div className="form-horizontal">

                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <Link to={`/event?venue=MAC&date=${date}&month=${month}&year=${year}`} style={{textDecoration:"none"}}>
                                                    <button type="button" id="MAC-button" className="btn btn-block btn-outline-primary">MAC</button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12"></div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <Link to={`/room-page?venue=LHC(1)&date=${date}&month=${month}&year=${year}`} style={{textDecoration:"none"}}>
                                                    <button type="button" id="LHC(1)-button" className="btn btn-block btn-outline-primary">LHC(1)</button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12"></div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                <Link to={`/room-page?venue=LHC(2)&date=${date}&month=${month}&year=${year}`} style={{textDecoration:"none"}}>
                                                    <button type="button" id="LHC(2)-button" className="btn btn-block btn-outline-primary">LHC(2)</button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12"></div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12">
                                                {/* <Link to="/calender-page?venue=MAC"> */}
                                                    <button type="button" id="venue-button" className="btn btn-outline-primary" disabled>Other Venue</button>
                                                {/* </Link> */}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="col-sm-12"></div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>    
                    </div>  
                </div>
            </section>          
        );
    }
}
 
export default VenuePage;