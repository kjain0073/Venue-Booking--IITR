import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import { Row, Col, Container, Card, Button, Label } from 'reactstrap';
import {Link} from 'react-router-dom'
import { Control, LocalForm, Errors } from 'react-redux-form';

import { Breadcrumb, BreadcrumbItem, Tooltip} from 'reactstrap';
import axios from 'axios'
import {store} from 'react-notifications-component'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const minLength = (len) => (val) => (val) && (val.length >= len)
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)

const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}]


class EventDescription extends Component {
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:new Array(24).fill(false),
            filledSlots:[],
            isDataReturned:false,
            isAllEmpty:true
        }
    }
    toggle = (i) => {
        var arr = this.state.tooltipOpen;
        arr[i] = !arr[i];
        this.setState({tooltipOpen: arr})
    }

    getSlots = async() => {
        const params = new URLSearchParams(window.location.search)
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]
        const venue = params.getAll('venue')[0]
        const filledSlots = await axios.get(`http://${window.location.hostname}:4005/slots/fetch?venue=${venue}&date=${date}&month=${month}&year=${year}`)
        console.log("Filled Slots - ");
        console.log(filledSlots.data)
        this.setState({filledSlots:filledSlots.data, isDataReturned: true})

        
        for(var i=0;i<filledSlots.data.length;i++){
            if(filledSlots.data[i]!==0){
                this.setState({isAllEmpty:false});
                break;
            }
        }

        var slotsAnd = 1;
        for(var i=0;i<filledSlots.data.length;i++){
            slotsAnd = (slotsAnd & (filledSlots.data[i]!==0));
        }
        if(slotsAnd===1){
            store.addNotification({
                title: "Alert!",
                message: "No available slots!",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
        }
        

    }

    async componentWillMount(){
        await this.getSlots();
    }

    handleSubmit = (values) => {
        console.log(JSON.stringify(values))
        const params = new URLSearchParams(window.location.search)
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]
        const venue = params.getAll('venue')[0]
        console.log(date+' ' + month + ' ' + year)

        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user)

        var slots = [values.slot1, values.slot2,values.slot3,values.slot4,values.slot5,values.slot6,values.slot7,values.slot8,values.slot9,values.slot10,values.slot11,values.slot12,values.slot13,values.slot14,values.slot15,values.slot16,values.slot17,values.slot18,values.slot19,values.slot20,values.slot21,values.slot22,values.slot23,values.slot24 ]
        console.log(slots) 

        var slotsOr = 0;
        for(var i=0;i<slots.length;i++){
            slotsOr = (slotsOr | slots[i]);
        }
        slotsOr = (slotsOr | values.allDay);
        console.log("SlotsOr is - " + slotsOr);
        if(slotsOr==0){
            store.addNotification({
                title: "No slot selected..",
                message: "Please select atleast one slot!",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
            return false;
        }

        if(values.allDay===true){
            slots = new Array(24).fill(values.allDay)
        }

        const token = localStorage.getItem('token')
        var approver2 = 'admin2@admin2.com';
        if(venue==='LHC-101' || venue==='LHC-102'){
            approver2 = 'bala@admin2.com'
        }else if(venue[0]==='L' && venue[1]==='H' && venue[2]==='C'){
            approver2 = 'dean.acads@admin2.com'
        }
        console.log("token is " + token)
        axios.post(`http://${window.location.hostname}:4005/booking/submit`,
        {
            userId:user.userId,
            eventName: values.eventName,
            venue: venue,
            approver1:values.approver1,
            approver2:approver2,
            contact:values.telnum,
            email:values.email,
            slots:slots,
            year: year,
            month: month,
            date: date,
            description:values.message,
            user:localStorage.getItem('user')
        }, 
        {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
        .then((response) => {
            console.log("Response");
            console.log(response)
            if (response.status === 200) {
                console.log("Created");
                alert("Booking Request Successful!")
                window.location.href = '/home'
            }
        })
        .catch((e) => {
            // alert("Error! Booking Not Done..")
            console.log("Error is -")
            console.log(e)
            }   
            // displayNotification("Error", "Internal Server Error", "danger")
        );
    }

    // componentDidMount(){
        
        
    // }

    render() { 
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const params = new URLSearchParams(window.location.search)
        const venue = params.getAll('venue')[0]
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]
        return ( 
            <>
            {}
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={`/calender-page`}>Calender</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={`/venue-page?date=${date}&month=${month}&year=${year}`}>{venue}</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Event Description</BreadcrumbItem>
                </Breadcrumb>
                <section className="col-md-9">
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="firstname" md={2}>Event Name</Label>
                            <Col md={10}>
                                <Control.text model=".eventName" id="eventName" name="eventName"
                                    placeholder="Event Name"
                                    className="form-control"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(30)
                                    }}
                                        />
                                <Errors 
                                    className="text-danger"
                                    model=".eventName"
                                    show="touched"
                                    messages={{
                                        required: 'Required! ',
                                        minLength: 'Must be greater than 2 characters! ',
                                        maxLength: 'Must be 15 characters or less...'
                                    }}

                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor=".telnum" md={2}>Contact</Label>
                            <Col md={10}>
                                <Control.text model=".telnum" id="telnum" name="telnum"
                                    placeholder="Tel. Number" 
                                    className="form-control"
                                    defaultValue={user.contact}
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15), isNumber
                                    }}
                                    />
                                <Errors 
                                    className="text-danger"
                                    model=".telnum"
                                    show="touched"
                                    messages={{
                                        required: 'Required! ',
                                        minLength: 'Must be greater than 2 numbers! ',
                                        maxLength: 'Must be 15 numbers or less... ',
                                        isNumber: 'Must be a number!'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor=".email" md={2}>Email</Label>
                            <Col md={10}>
                                <Control.text model=".email" id="email" name="email"
                                    placeholder="Email" 
                                    className="form-control"
                                    defaultValue={user.email}
                                    validators={{
                                        required, validEmail
                                    }}
                                    />
                                <Errors 
                                    className="text-danger"
                                    model=".email"
                                    show="touched"
                                    messages={{
                                        required: 'Required! ',
                                        validEmail: 'Invalid Email address!'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor=".approver1" md={2}>Faculty Advisor Email:</Label>
                            <Col md={10}>
                                <Control.text model=".approver1" id="approver1" name="approver1"
                                    placeholder="abd@iitr.ac.in (This must be correct institute email id)" 
                                    className="form-control"
                                    validators={{
                                        required, validEmail
                                    }}
                                    />
                                <Errors 
                                    className="text-danger"
                                    model=".approver1"
                                    show="touched"
                                    messages={{
                                        required: 'Required! ',
                                        validEmail: 'Invalid Email address!'
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Label htmlFor=".slots" md={2}>Slots</Label>
                            <Col md={10}>
                                <Row>
                                    {slotLabels.map((item, index) => {
                                        return (
                                           <Col md={4} sm={6} xs={6} key={index}>
                                               <div className="form-check">
                                                    <Label check>
                                                        <Control.checkbox model={`.slot${index+1}`} name="slot" id={`slot${index+1}`} key={index}
                                                            className="form-check-input" tooltip="goodJob" disabled={this.state.filledSlots[index]!==0} checked={this.state.filledSlots[index]!==0}
                                                        />{' '}
                                                            <span className={(this.state.filledSlots[index]!==0 ? `text-active` : 'text')}>
                                                                Slot{`${index+1}`}: {item.label}
                                                            </span>
                                                            
                                                    </Label>
                                                    {(this.state.filledSlots.length!==0 && this.state.filledSlots[index]!==0) ? 
                                                        <Tooltip placement="top" isOpen={this.state.tooltipOpen[index]} target={`slot${index+1}`} toggle={() => this.toggle(index)}>
                                                            {console.log("state me filled slots is")}
                                                            {console.log(this.state.filledSlots)}
                                                            Event Name: {this.state.filledSlots[index].eventName},
                                                            BookedBy: {this.state.filledSlots[index].bookedBy}
                                                        </Tooltip> 
                                                    :<></>}
                                                </div>
                                           </Col> 
                                        );
                                    })}
                                    <Col md={4}></Col>
                                </Row>
                                
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={{size: 6, offset:6}} className="d-flex justify-content-end" style={{paddingTop:"10px"}}>
                                <div className="form-check">
                                    <Label check>
                                        <Control.checkbox model={`.allDay`} name="allDay" id={`allDay`}
                                            className="form-check-input" disabled={this.state.isAllEmpty===false}
                                        />{' '}
                                        <span className={(this.state.isAllEmpty===false ? `text-active` : 'text')}>
                                            Book for whole day (24hrs)
                                        </span>
                                    </Label>
                                </div>
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor=".message" md={2}>Description</Label>
                            <Col md={10}>
                                <Control.textarea model=".message" id="message" name="message"
                                    rows="6"
                                    className="form-control"
                                />
                                <Errors 
                                    className="text-danger"
                                    model=".message"
                                    show="touched"
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col md={{size:10, offset:2}}>
                                <Button type="submit" color="primary">
                                    Request Booking
                                </Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </section>
                
            </Container>
        </>
        );
    }
}
 
export default EventDescription;
