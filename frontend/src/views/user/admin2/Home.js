import React, { Component } from 'react';

import { Container, Breadcrumb, BreadcrumbItem, Badge, Tooltip, Label, Row, Col, Button } from 'reactstrap';
import {Link} from 'react-router-dom'

import { Control, LocalForm, Errors } from 'react-redux-form';

import axios from 'axios'
const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}];

const required = (val) => val && val.length;

class Home2 extends Component {

    constructor(props){
        super(props);
        this.state = {
            approvals: [],
            toggle : true,
            tooltipOpen:false,
            isDataReturned: false
        }
    }
    
    async componentWillMount(){
        await this.getApprovals();
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

    getApprovals = async() => {
        var dataReceived;
        const user = (localStorage.getItem('user'));
        const token = localStorage.getItem('token')
        axios.post(`http://${window.location.hostname}:4005/approvals2/fetch/`,{
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

    handleApprove = (id) => {
        // console.log(id)
        axios.put(`http://${window.location.hostname}:4005/booking/approval2/${id}`,
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
                console.log(response.data)
                if (response.status === 200) {
                    console.log("Approved");
                    alert("Approved!")
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
        axios.put(`http://${window.location.hostname}:4005/booking/decline2/${id}`,
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
                // console.log("Response Message");
                // console.log(response.message)
                if (response.status === 200) {
                    console.log("Decline Successful!");
                    alert("Decline Successful!")
                    window.location.reload();
                }
            })
            .catch((e) => {
                // alert("Error! Booking Not declined..")
                console.log("Error is -")
                console.log(e)
            }    
        );
    }

    render() { 
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'))
        // console.log(user)
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
                <Col md={9}>
                    <h3>Approvals:</h3>
                </Col>
                
            </Row><hr />
              
            {this.state.approvals.length===0 ?
                    <Col md={9}>
                        <p>Nothing to Show...</p>
                    </Col>   
                    :
                    <>
            {this.state.approvals.map((item) => {
                return (
                    <>
                    <Row>
                        <Col md={9}>
                            <Row>
                                <Col md={6}>
                                    <h4> {item.eventName}</h4>
                                    <p>Event Date: {item.date}-{item.month}-{item.year} </p>
                                    <p>Event Venue: {item.venue}</p>
                                    <p>Slots: {this.labelSlots(item.slots)} </p>
                                    <p>Requested by {JSON.parse(item.user).fullName}</p>
                                </Col>
                                <Col>
                                    <p>Requested on: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}</p>
                                    {/* <p>Approval 1 at {item.updatedAt}</p> */}
                                    
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
             
                    
            </Container>
        );
    }
}
 
export default Home2;