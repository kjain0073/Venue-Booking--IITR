import React, { Component } from 'react';

import { Container, Tooltip, Breadcrumb, BreadcrumbItem, Badge, Row, Col, Button, Label, NavItem, NavLink, Input } from 'reactstrap';
import {Link} from 'react-router-dom'

import { Control, LocalForm, Errors } from 'react-redux-form';

import axios from 'axios'
const slotLabels = [{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'}];

const required = (val) => val && val.length;

class Approval extends Component {
    // state = {  }
    constructor(props){
        super(props);
    } 
    
    handleApprove = (id) => {
        // console.log(id)
        axios.put(`http://${window.location.hostname}:4005/booking/approval1/${id}`,
            {
                user:localStorage.getItem('user')
            }
            , 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
            ).then((response) => {
                // console.log("Response Message");
                // console.log(response.message)
                if (response.status === 200) {
                    console.log("Approved");
                    alert("Approved Successfully!")
                    window.location.reload();
                }
            })
            .catch((e) => {
                // alert("Error! Notice Not Approved..")
                console.log("Error is -")
                console.log(e)
            }    
        );
    }

    handleDecline = (values, id) => {
        console.log(values)
        console.log(id)
        axios.put(`http://${window.location.hostname}:4005/booking/decline1/${id}`,
            {
                user:localStorage.getItem('user'),
                comment: values.message
            }
            , 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
            ).then((response) => {
                if (response.status === 200) {
                    console.log("Decline Successful!");
                    alert("Decline Successful!")
                    window.location.reload();
                }
            })
            .catch((e) => {
                alert("Error! Booking Not declined..")
                console.log("Error is -")
                console.log(e)
            }    
        );
    }

    render() { 
        return ( 
            <>
            <Row>
                <Col md={9}>
                    <h3>Approvals:</h3>
                </Col>
                
            </Row><hr />
            
            {this.props.approvals.length===0 ?
                    <Col md={9}>
                        <p>Nothing to Show...</p>
                    </Col>   
                    :
                    <>
            {this.props.approvals.map((item) => {
                return (
                    <>
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col md={6}>
                                    <h4> {item.eventName}</h4>
                                    <p>Event Date: {item.date}-{item.month}-{item.year} </p>
                                    <p>Event Venue: {item.venue}</p>
                                    <p>Slots: {slotLabels[item.slot-1].label} </p>
                                    <p>Requested by {JSON.parse(item.user).fullName}</p>
                                </Col>
                                <Col>
                                    <p>Requested on: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}</p>
                                    
                                    <LocalForm onSubmit={(values) => this.handleDecline(values, item._id)}>
                                        <Row className="form-group">
                                            <Label htmlFor=".message" md={12}>Comments:</Label>
                                            <Col md={12}>
                                                <Control.textarea model=".message" id="message" name="message"
                                                    rows="2"
                                                    className="form-control"
                                                    placeholder="Comment is required for decline..."
                                                    validators={{
                                                        required
                                                    }}
                                                />
                                                <Errors 
                                                    className="text-danger"
                                                    model=".message"
                                                    show="touched"
                                                    messages={{
                                                        required: 'Required for Decline! '
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="form-group">
                                            <Col md={{size:10}}>
                                                <Button color="primary" onClick={() => this.handleApprove(item._id)}> Approve </Button>
                                                <Button color="danger" type="submit" outline> Decline </Button>
                                            </Col>
                                        </Row>
                                    </LocalForm>

                                    
                                </Col>
                            </Row>
                            
                        </Col>
                    </Row>
                    <hr />
                    </>
                );
            })}</>}
             
            </>
        );
    }
}

class History extends Component {
    constructor(props){
        super(props);
    }
    // state = {  }
   
    render() { 
        return ( 
            <>
            <Row>
                <Col md={9}>
                    <h3>My Booking History:</h3>
                </Col>
                
            </Row>
            <hr />
            <Row>
            {this.props.bookings.length===0 ?
                    <Col md={9}>
                        <p>No Bookings to Show...</p>
                    </Col>   
                    :
                    <>
                    {this.props.bookings.map((item) => {
                        return (
                            <Col md={9}>
                                <Row>
                                    <Col md={6}>
                                        <h4> {item.eventName} {' '}<Badge color="success"> Booked</Badge>
                                        {/* {item.status==='Approved' ? 
                                            <Badge color="success"> Approved</Badge>
                                            :
                                            (item.status==='Pending' ? <Badge color="warning"> Pending</Badge>
                                            : <>
                                                <Badge color="danger">Declined</Badge>
                                            </>)
                                        } */}
                                        </h4>
                                        <p>Event Date: {item.date}-{item.month}-{item.year}</p>
                                        <p>Event Venue: LHC-{item.LHC}, {item.room}</p>
                                        <p>Requested by You</p>
                                        <p>Slot: {slotLabels[item.slot-1].label} </p>
                                    </Col>
                                    <Col>
                                        <h6>Booked on: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}</h6><br />
                                        {/* <Link to={`/admin1/booking/progress?id=${item._id}`}>
                                            <Button color="primary" outline className="btn-sm"> Check Status </Button>
                                        </Link> */}
                                    </Col>
                                </Row><hr />
                            </Col>
                        );
                    })}
                    
                    </>
            }
            </Row>
            </>
        );
    }
}
 

class FacultyHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            toggle : true,
            tooltipOpen:false,
            bookings:[],
            approvals:[],
            isDataReturned: false
        }
    }

    async componentWillMount(){
        await this.getData();
        await this.getApprovals();
    }

	  getData = async() => {
        var dataReceived;
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token')
        axios.get(`http://${window.location.hostname}:4005/bookings/lhc/fetch/${user.userId}`,
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
                console.log(response.data)
                this.setState({
                    bookings: response.data
                });
            }
        })
        .catch((e) => {
            console.log(e)
            }   
        );
      }
      
      getApprovals = async() => {
        var dataReceived;
        const user = (localStorage.getItem('user'));
        const token = localStorage.getItem('token')
        axios.post(`http://${window.location.hostname}:4005/approvals/fetch/`,{
            user:user
        },
        {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then((response) => {
            console.log("Response");
            console.log(response)
            if (response.status === 200 || response.status===304) {
                console.log("Fetched Approvals");
                // setBookingData(response.data)
                this.setState({
                    approvals: response.data,
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


    handleClick = (n) => {
        if(n==0){
            var ele = document.getElementById('approval');
			ele.classList.add("span-active");

			var ele2 = document.getElementById('booking');
            ele2.classList.remove("span-active")
            
            this.setState({toggle: true})

        }else if(n==1){
            var ele = document.getElementById('booking');
			ele.classList.add("span-active");

			var ele2 = document.getElementById('approval');
            ele2.classList.remove("span-active")
            
            this.setState({toggle: false})
        }
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
    
    render() { 
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'))
        return ( 
            <Container>
                
                <Breadcrumb style={{marginBottom:"30px"}}>
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
                    <Col>
                        <span style={{marginRight:"10px"}} id="approval" className="span-class span-active" onClick={() => this.handleClick(0)}>My Bookings</span>
                        <span id="booking" className="span-class" onClick={() => this.handleClick(1)}>Approvals</span>{' '}
                        <Link to='/faculty/LHC/booking' style={{margin:"5px"}}>
                            <Button color="info" outline>Request Booking</Button>
                        </Link>
                    </Col>
                    <hr />
                </Row><hr />

                {this.state.toggle ?
                    <History bookings={this.state.bookings} />
                    :
                    <Approval approvals={this.state.approvals}  />
                }

                
                    
            </Container>
        );
    }
}
 
export default FacultyHome;