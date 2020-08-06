import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
// import Calendar from 'react-calendar'
// import 'react-calendar/dist/Calendar.css';
import { Row, Col, Container, Card, Button , Tooltip} from 'reactstrap';
import {Link} from 'react-router-dom'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios'
const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}];

const Rooms1 = [{no:'003'}, {no:'004'}, {no:'005'}, {no:'006'}, {no:'101'}, {no:'102'}, {no:'103'}, {no:'104'}, {no:'105'}, {no:'106'}, {no:'201'}, {no:'202'}, {no:'203'}, {no:'204'}, {no:'205'}, {no:'206'}];
const Rooms2 = [{no:'201'}, {no:'202'}, {no:'203'}, {no:'204'}, {no:'301'}, {no:'302'}, {no:'303'}, {no:'304'}, {no:'401'}, {no:'402'}, {no:'403'}, {no:'404'}, {no:'501'}, {no:'502'}, {no:'503'}, {no:'504'}, {no:'505'}, {no:'506'}, {no:'601'}, {no:'602'}, {no:'603'}, {no:'604'}, {no:'605'}, {no:'606'}];

class RoomPage2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            // date: new Date(),
            selectedRoom:'',
            tooltipOpen:false,
            bookings:[]
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

    getBookings = async(d) => {
        const params = new URLSearchParams(window.location.search)
        const venue = params.getAll('venue')[0]
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]

        const bookings = await axios.get(`http://${window.location.hostname}:4005/bookings/lhc/fetch?venue=${venue+'-'+d}&date=${date}&month=${month}&year=${year}`)
        console.log("Filled Booking - ");
        console.log(bookings.data)
        this.setState({bookings:bookings.data})

    }

    handleRoomSelect = (n) => {
        var r = n.target.value;
        console.log(r)
        // n.preventDefault();
        this.setState({selectedRoom:(r)});
        // alert("Selected Room is " + this.state.selectedRoom)
        console.log('------------');
        console.log(n.target.value)
        console.log(this.state.selectedRoom)

        //FETCH BOOKINGS FOR n.target.value;
        this.getBookings(n.target.value)
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
        const user = JSON.parse(localStorage.getItem('user'));
        const params = new URLSearchParams(window.location.search)
        const venue = params.getAll('venue')[0]
        const date = params.getAll('date')[0]
        const month = params.getAll('month')[0]
        const year = params.getAll('year')[0]
        return ( 
            <>
                {/* <MainHeader /> */}
                <Container>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/admin1/calender-page`}>Calender</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to={`/admin1/venue-page?date=${date}&month=${month}&year=${year}`}>{venue}</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Room No.</BreadcrumbItem>
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
                            <Col lg={4} className="d-flex align-items-center justify-content-center">
                                {/* <Card> */}
                                    <Row>
                                        <Col xs={12} sm={12}>
                                        {venue==='LHC(1)' ?
                                            <>
                                                {Rooms1.map((room) => {
                                                    var number = room.no; 
                                                    return (
                                                        
                                                            <Button outline value={number}key={number} active={false} onClick={(number) => this.handleRoomSelect(number)}> {number} </Button>
                                                        
                                                    );
                                                })}
                                            </>
                                                :
                                            <>
                                                {Rooms2.map((room) => {
                                                    var number = room.no; 
                                                    return (
                                                        
                                                            <Button outline value={number}key={number} active={false} onClick={(number) => this.handleRoomSelect(number)}> {number} </Button>
                                                        
                                                    );
                                                })}
                                            </>
                                            }
                                        </Col>
                                        <Col xs={12} sm={12}>
                                        {this.state.selectedRoom ?
                                                <Link to={`/admin1/event?venue=${venue+'-'+this.state.selectedRoom}&date=${date}&month=${month}&year=${year}`} style={{textDecoration:"none", padding:"2px"}}>
                                                    <Button color="success" outline block>Book Venue?</Button>
                                                </Link>
                                                :
                                                <Button outline block style={{cursor:"context-menu", marginTop:"20px"}}>Please select a room..</Button>
                                            }
                                        </Col>
                                        

                                    </Row>
                                    
                                    
                                {/* </Card> */}
                            </Col>
                            <Col>
                                <Row>
                                <Col>
                                        <div className="Bookings:" style={{textAlign:"center"}}>
                                            <p>Selected Room is: {this.state.selectedRoom} </p>
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="Bookings:">
                                            All Bookings of {venue} on {date}-{month}-{year} is:
                                        </div><hr />
                                    </Col>
                                    {this.state.bookings.length===0 ?
                                        <Col md={4}>
                                            No bookings to show...
                                        </Col> 
                                        :
                                        <>
                                            {this.state.bookings.map((item) => {
                                                return (
                                                    <>
                                                        <Col md={6}>
                                                            <h5>Event Name: {item.eventName} </h5>
                                                            <p>Requested By: {item.email} </p>
                                                            {/* <p>Venue: {item.venue} </p> */}
                                                            <p>Slots: {this.labelSlots(item.slots)} </p>
                                                            <p>Status: <i>{item.status}</i> </p>
                                                            <hr />
                                                        </Col>
                                                        <hr />
                                                    </>
                                                );
                                            })}
                                        </>
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </section>
                    
                </Container>
            </>
        );
    }
}
 
export default RoomPage2;