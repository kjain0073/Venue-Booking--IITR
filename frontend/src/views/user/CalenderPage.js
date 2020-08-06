import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import { Row, Col, Container, Card, Button , Tooltip} from 'reactstrap';
import {Link} from 'react-router-dom'
import axios from 'axios'

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

const slotLabels = [{label:'6AM-7AM'},{label: '7AM-8AM'},{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '1PM-2PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'},{label: '8PM-9PM'},{label: '9PM-10PM'},{label: '10PM-11PM'},{label: '11PM-12AM'},{label: '12AM-1AM'},{label: '1AM-2AM'},{label: '2AM-3AM'},{label: '3AM-4AM'},{label: '4AM-5AM'},{label: '5AM-6AM'}];

class CalenderPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            date: new Date(),
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

    async componentWillMount(){
        await this.getBookings(this.state.date);
    }

    getBookings = async(d) => {
        const params = new URLSearchParams(window.location.search)
        // const venue = params.getAll('venue')[0]
        const date = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        const bookings = await axios.get(`http://${window.location.hostname}:4005/bookings/fetch?date=${date}&month=${month+1}&year=${year}`)
        console.log("Filled Booking - ");
        console.log(bookings.data)
        this.setState({bookings:bookings.data})

    }
    
    handleOnChange = async(date) => { 
        
        this.setState({ date });
        await this.getBookings(date);
    }
    // handleClickDay = info => alert(info);
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
            alert("You are not signed In!")
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const params = new URLSearchParams(window.location.search)
        const venue = params.getAll('venue')[0]
        return ( 
            <>
                {/* <MainHeader /> */}
                <Container>
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        {/* <BreadcrumbItem><Link to='/venue-page'>{venue}</Link></BreadcrumbItem> */}
                        <BreadcrumbItem active>Calender</BreadcrumbItem>
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
                            <Col lg={4} className="d-flex justify-content-center" style={{marginBottom:"30px"}}>
                                <Card style={{border:"none"}}>
                                    <Calendar
                                        onClickDay={this.handleClickDay}
                                        onChange={this.handleOnChange}
                                        value={this.state.date}
                                        minDate={new Date()}
                                    />
                                    <Link to={`/venue-page?date=${this.state.date.getDate()}&month=${this.state.date.getMonth() + 1}&year=${this.state.date.getFullYear()}`} style={{textDecoration:"none", padding:"2px"}}>
                                        <Button color="success" outline block>Proceed to select Venue at selected date?</Button>
                                    </Link>
                                </Card>
                            </Col>
                            <Col style={{marginLeft:"20px"}}>
                                <Row>
                                    <Col md={12}>
                                        <div className="Bookings:">
                                            All Bookings on {this.state.date.getDate()}-{this.state.date.getMonth()+1}-{this.state.date.getFullYear()}:
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
                                                            <p>Venue: {item.venue} </p>
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
 
export default CalenderPage;