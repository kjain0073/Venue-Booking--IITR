import React, { Component } from 'react';
import { Breadcrumb, BreadcrumbItem, Col, Row, Button, Badge, Tooltip} from 'reactstrap'
import {Link} from 'react-router-dom'
import axios from 'axios';
import {myBookings, setBookingData, getBookingData} from './Data.js'

const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}];

class UserHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:false,
            bookings:[],
            isDataReturned: false
        }
    }

    async componentWillMount(){
		await this.getData();
	  }

	  getData = async() => {
        var dataReceived;
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token')
        axios.get(`http://${window.location.hostname}:4005/bookings/fetch/${user.userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then((response) => {
            console.log("Response");
            console.log(response)
            if (response.status === 200 || response.status===304) {
                console.log("Fetched Bookings");
                setBookingData(response.data)
                this.setState({
                    bookings: response.data,
                    isDataReturned: true
                });
            }
        })
        .catch((e) => {
            // alert("Error! sorry, cant fetch bookings..")
            console.log("Error is -")
            console.log(e)
            }   
        );
	  }

    toggle = () => {
        this.setState({tooltipOpen: !this.state.tooltipOpen})
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isSignedIn');
        localStorage.removeItem('user')
        window.location.href = '/login-page'
    }

    labelSlots = (arr) => {
        // console.log(arr)
        var str = '';
        var count = 0;
        for(var i=0;i<arr.length;i++){
            if(arr[i]===1){
                count++;
                if(str.length===0){
                    str+= (slotLabels[i].label)
                }else{
                    str+= (', ' +slotLabels[i].label)
                }
            }
        }

        if(count===24){
            str='All day (24hrs)'
        }
        return str;
    }

    render() { 
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'))
        if(user.role!=='student'){
            window.location.href = '/login-page'
        }
        return ( 
                <div className="container">
                    <Breadcrumb>
                        <BreadcrumbItem active>Home</BreadcrumbItem>
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
                    
                    
                    <Row>
                        <Col md={9}>
                            <h3>My Booking History:</h3>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Link to='/calender-page'>
                                <Button color="info" outline>New Booking</Button>
                            </Link>
                        </Col>
                    </Row>
                    
                    <hr />
                    <Row>
                        {this.state.bookings.length===0 ?
                            <Col md={9}>
                                <p>No Bookings to Show...</p>
                            </Col>   
                            :
                            <>
                            {this.state.bookings.map((item) => {
                                return (
                                    <Col md={9}>
                                        <Row>
                                            <Col md={6}>
                                                <h4> {item.eventName} {' '}  
                                                {item.status==='Approved' ? 
                                                    <Badge color="success"> Approved</Badge>
                                                    :
                                                    (item.status==='Pending' ? <Badge color="warning"> Pending</Badge>
                                                    : <>
                                                        <Badge color="danger">Declined</Badge>
                                                    </>)
                                                }
                                                </h4>
                                                <p>Event Date: {item.date}-{item.month}-{item.year}</p>
                                                <p>Event Venue: {item.venue}</p>
                                                <p>Requested by You</p>
                                                <p>Event Slots: {this.labelSlots(item.slots)} </p>
                                            </Col>
                                            <Col>
                                                <h6>Requested on: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}</h6><br />
                                                <Link to={`/booking/timeline?id=${item._id}`}>
                                                    <Button color="primary" outline className="btn-sm"> Check Status </Button>
                                                </Link>
                                            </Col>
                                        </Row><hr />
                                    </Col>
                                );
                            })}
                            
                            </>
                    }
                        
                    </Row>
                </div>
        );
    }
}
 
export default UserHome;