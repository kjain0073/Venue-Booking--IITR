import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Row, Col, Container, Card, Button, Tooltip } from 'reactstrap';
import {Link} from 'react-router-dom'
import axios from 'axios'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Rooms from './Rooms';
const slotLabels = [{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'}];

class LHCBooking extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: new Date(),
            tooltipOpen:false,
            bookings:[],
            selectedSlot:''
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
        window.location.href = '/login'
    }
    
    handleOnChange = async(date) => { 
        
        this.setState({ date });
        // await this.getBookings(date);
    }

    handleRoomSelect = (n) => {
        var r = n.target.value;
        console.log(r)
        // n.preventDefault();
        this.setState({selectedSlot:(r)});
        
    }
    
    render() { 
        if(!localStorage.getItem('isSignedIn')){
            // alert("You are not signed In!");
            window.location.href = '/login'
        }
        const user = JSON.parse(localStorage.getItem('user'));
        if(user.role!=='facultyMember'){
            window.location.href='/'
        }
        const params = new URLSearchParams(window.location.search)
        const venue = params.getAll('venue')[0]

        return ( 
            <>
                <Container>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/">Dashboard</Link></BreadcrumbItem>
                        {/* <BreadcrumbItem><Link to='/admin1/venue-page'>{venue}</Link></BreadcrumbItem> */}
                        <BreadcrumbItem active>LHC Booking</BreadcrumbItem>
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
                    <section>
                        <Row>
                            <Col lg={4} className="d-flex justify-content-center">
                                <Row>
                                    {/* <Col md={12}> */}
                                        <Card style={{marginBottom:"30px"}}>
                                        <Calendar
                                                onClickDay={this.handleClickDay}
                                                onChange={this.handleOnChange}
                                                value={this.state.date}
                                                minDate={new Date()}
                                            />
                                        </Card>
                                        <div style={{width:"100%"}}><i>Select Date and Time Slot</i><hr /></div>
                                        {slotLabels.map((item, index) => {
                                            return (
                                                <Col xs={5} sm={5} key={index}>
                                                    {console.log(index===(this.state.selectedSlot-1))}
                                                    <Button className={(index===(this.state.selectedSlot-1)) ? `` : `btn-outline-secondary`} block value={index+1} key={item.label} onClick={(e) => this.handleRoomSelect(e)}> {item.label} </Button>
                                                </Col>
                                            );
                                        })}
                                        <hr />
                                    {/* </Col> */}
                                </Row>
                            </Col>
                            <Col style={{marginLeft:"20px"}}>
                                <Row>
                                        
                                    <Col md={12}><hr />
                                        {this.state.selectedSlot!=='' ? 
                                        <>
                                            <i>Selected Date is <Button outline color="primary"> {this.state.date.getDate()}-{this.state.date.getMonth()+1}-{this.state.date.getFullYear()} </Button> and selected Slot is {' '} <Button outline color="danger"> {slotLabels[this.state.selectedSlot-1].label} </Button></i>
                                            <hr /></>    :
                                            <></>
                                        }
                                    </Col>
                                    <Rooms date={this.state.date.getDate()} month={this.state.date.getMonth()+1} year={this.state.date.getFullYear()} selectedSlot={this.state.selectedSlot}/>
                                </Row>
                            </Col>
                        </Row>

                        
                        
{/*                             
                        {this.state.selectedSlot!=='' ? 
                            <Rooms date={this.state.date.getDate()} month={this.state.date.getMonth()+1} year={this.state.date.getFullYear()} selectedSlot={this.state.selectedSlot}/>
                            :
                            <></>
                        } */}

                    </section>
                    
                </Container>
            </>
        );
    }
}
 
export default LHCBooking;