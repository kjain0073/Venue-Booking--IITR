import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import { Row, Col, Container, Card, Button, Label } from 'reactstrap';
import {Link} from 'react-router-dom'
import { Control, LocalForm, Errors } from 'react-redux-form';

import { Breadcrumb, BreadcrumbItem , Tooltip} from 'reactstrap';
import axios from 'axios'
import {store} from 'react-notifications-component'

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len)
const minLength = (len) => (val) => (val) && (val.length >= len)
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val)

const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}]

class Details extends Component {

    constructor(props){
        super(props);
    }

    handleSubmit = (values) => {
        console.log(JSON.stringify(values))

        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user)

        const token = localStorage.getItem('token')
        console.log("token is " + token)
        console.log(this.props.roomIndex)
        
        axios.post(`http://${window.location.hostname}:4005/booking/lhc/submit`,
        {
            userId:user.userId,
            eventName: values.eventName,
            LHC: this.props.LHC,
            room:this.props.selectedRoom,
            nthRoom:this.props.roomIndex,
            classType:values.classType,
            slot:this.props.selectedSlot,
            year: this.props.year,
            month: this.props.month,
            date: this.props.date,
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
                // window.location.href = '/faculty/home'
                window.location.reload();
            }
        })
        .catch((e) => {
            alert("Error! Booking Not Done..")
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
        const user = JSON.parse(localStorage.getItem('user'));
        

    return ( 
        <>
            {/* <MainHeader /> */}
            <Container>
                <section className="col-md-12">
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Label htmlFor="eventName" md={2}>Course Title</Label>
                            <Col md={10}>
                                <Control.text model=".eventName" id="eventName" name="eventName"
                                    placeholder="CSN-XYZ"
                                    className="form-control"
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(10)
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
                            <Label htmlFor=".classType" md={2}>Class type:</Label>
                            <Col md={10}>
                                <Control.select model=".classType" id="classType" name="classType"
                                    // placeholder="Email" 
                                    className="form-control"
                                    defaultValue="live"
                                    validators={{
                                        required
                                    }}
                                >
                                    <option value="live">Live Class</option>
                                    <option value="recording">Recording</option>
                                </Control.select>
                                <Errors 
                                    className="text-danger"
                                    model=".classType"
                                    show="touched"
                                    messages={{
                                        required: 'Required! '
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor=".message" md={2}>Description</Label>
                            <Col md={10}>
                                <Control.textarea model=".message" id="message" name="message"
                                    rows="5"
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
                                    Book
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

export default Details;