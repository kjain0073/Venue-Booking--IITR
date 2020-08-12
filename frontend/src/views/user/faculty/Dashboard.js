import React, { Component } from 'react';
import { Container , Row, Col, Card, Table,Tooltip, Breadcrumb, BreadcrumbItem, Button} from 'reactstrap';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import axios from 'axios'
import {Link} from 'react-router-dom'

const slotLabels = [{label: '8AM-9AM'},{label: '9AM-10AM'},{label: '10AM-11AM'},{label: '11AM-12PM'},{label: '12PM-1PM'},{label: '2PM-3PM'},{label: '3PM-4PM'},{label: '4PM-5PM'},{label: '5PM-6PM'},{label: '6PM-7PM'},{label: '7PM-8PM'}];
const Rooms1 = [{no:'003'}, {no:'004'}, {no:'005'}, {no:'006'}, {no:'101'}, {no:'102'}, {no:'103'}, {no:'104'}, {no:'105'}, {no:'106'}, {no:'201'}, {no:'202'}, {no:'203'}, {no:'204'}, {no:'205'}, {no:'206'}];
const Rooms2 = [{no:'201'}, {no:'202'}, {no:'203'}, {no:'204'},{no:'301'}, {no:'302'}, {no:'303'}, {no:'304'},  {no:'401'}, {no:'402'}, {no:'403'}, {no:'404'},  {no:'501'}, {no:'502'}, {no:'503'}, {no:'504'}, {no:'505'}, {no:'506'}, {no:'601'}, {no:'602'}, {no:'603'}, {no:'604'}, {no:'605'}, {no:'606'}];


class Dashboard extends Component {
    // state = {  }
    constructor(props){
        super(props);
        this.state = {
            date: new Date(),
            tooltipOpen:false,
            tooltipOpen:false,
            bookings:[],
            selectedSlot:'',
            isSignedIn: false
        }
    }

    toggle = () => {
        this.setState({tooltipOpen: !this.state.tooltipOpen})
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isSignedIn');
        localStorage.removeItem('user')
        window.location.href = '/'
    }

    async componentWillMount(){
        await this.getDashboardData(this.state.date);
    }

    getDashboardData = async(d) => {
        
        const params = new URLSearchParams(window.location.search)
        const q = params.getAll('q')[0]
        const res = await axios.get(`http://${window.location.hostname}:4005/dashboard/fetch?LHC=${q}&date=${d.getDate()}&month=${d.getMonth()+1}&year=${d.getFullYear()}`)
        console.log(res.data);
        this.setState({bookings:res.data});
    }

    handleOnChange = async(date) => { 
        
        this.setState({ date });
        await this.getDashboardData(date);
        // await this.getBookings(date);
    }

    getLabel = (i) => {
        var str = ''
        console.log("Bookings len = " +this.state.bookings.length)
        if(this.state.bookings.length>=20){
            str = Rooms2[i].no
        }else{
            str = Rooms1[i].no
        }

        return str;
    }


    render() { 

        if(localStorage.getItem('isSignedIn') && this.state.isSignedIn===false){
            this.setState({isSignedIn:true})
            
        }
        console.log(localStorage.getItem('isSignedIn'))
        console.log(this.state.isSignedIn)

        const user = JSON.parse(localStorage.getItem('user'))
        console.log(user)
        const params = new URLSearchParams(window.location.search)
        const q = params.getAll('q')[0]
        console.log(q);
        var r = '1';
        if(q==='1'){
            r='2'
        }
        return ( 
            <>
                
                <Container fluid>
                <Breadcrumb>
                    <BreadcrumbItem>LHC-{q} Bookings Dashboard:{' '} <br />
                        <a href={`/dashboard?q=${r}`}>
                            Visit LHC-{r} Dashboard
                        </a>
                    </BreadcrumbItem>
                    <Col className="d-flex justify-content-end">
                        {this.state.isSignedIn ?
                                <ul style={{listStyleType:"none"}}>
                                    <li> {user.fullName} </li>
                                    <li> {user.email} <span className="fa fa-sign-out" id="TooltipExample" style={{color:"#0083ff"}} onClick={this.handleLogout}></span></li>
                                    <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
                                        Logout
                                    </Tooltip>
                                </ul>
                            :   
                                <Link to='/login'>
                                    <Button color="primary" outline onClick={this.handleLogin}>
                                        Login <span className="fa fa-sign-in login-fa"></span>
                                    </Button>
                                </Link>
                                
                        }
                    </Col>
                </Breadcrumb>
                    <Row>
                        <Col lg={3}>
                            { user && user.role==='facultyMember' ?
                                <Link to="/faculty/LHC/booking" style={{textDecoration:"none"}}>
                                    <Button outline block color="success">
                                        Book a new Slot
                                    </Button>
                                </Link>
                                :<></>
                            }
                            
                        </Col>
                        <Col>
                            <p style={{paddingTop:"10px"}}>Selected Date is:{' '} {this.state.date.getDate()}-{this.state.date.getMonth()+1}-{this.state.date.getFullYear()} </p>   
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} className="d-flex justify-content-center">
                            
                            
                            {/* <Col xs={12} sm={12}> */}
                                <Card style={{marginBottom:"30px", border:"none"}}>
                                    <Calendar
                                        onClickDay={this.handleClickDay}
                                        onChange={this.handleOnChange}
                                        value={this.state.date}
                                        tileDisabled={({activeStartDate, date, view }) => date.getDay() === 0} 
                                    />
                                </Card>
                            {/* </Col> */}
                        </Col>
                        <Col lg={9}>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                    <th>Room No.<span className="fa fa-arrow-down"></span></th>
                                    {slotLabels.map((item) => {
                                        return (
                                            <th>{item.label}</th>
                                        );
                                        
                                    })}
                                    
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bookings.map((b, index) => {
                                        return (
                                            <tr key={index} style={{height:"75px"}}>
                                                <th scope="row">{this.getLabel(index)}</th>
                                                {b.map((bk) => {
                                                    if(bk!==0){
                                                        return(
                                                            <td style={{padding:"0", margin:"0"}}>
                                                                <Button color={bk.classType==='live' ? "success" : "danger"} outline block style={{margin:"0", padding:"1px"}}>
                                                                    <p style={{margin:"0"}}>{bk.eventName}<br />({bk.classType})<br />by {bk.bookedBy}</p>
                                                                </Button>
                                                            </td>
                                                        );
                                                    }else{
                                                        return (
                                                            <td style={{padding:"0"}}>
                                                                {/* <Button color="danger" outline block style={{margin:"0"}}>
                                                                    Not <br />Booked
                                                                </Button> */}
                                                            </td>
                                                        );
                                                    }
                                                    
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row>
                        
                    </Row>
                </Container>
                
            </>
        );
    }
}
 
export default Dashboard;