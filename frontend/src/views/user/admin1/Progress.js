import React, { Component } from 'react';

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
// import MainHeader from '../../components/Headers/MainHeader';
import { Container, Breadcrumb, BreadcrumbItem, Badge, Col, Tooltip } from 'reactstrap';
import {Link} from 'react-router-dom'
import axios from 'axios'

class Progress extends Component {
    constructor(props){
        super(props);
        this.state = {
            arrow1: { borderRight: '7px solid  rgb(33, 150, 243)' },
            arrow2: { borderRight: '7px solid rgba(248, 250, 251, 0)' },
            arrow3: { borderRight: '7px solid rgba(248, 250, 251, 0)' },
            bookingSuccess: false,
            booking:{},
            isDataReturned: false,
            tooltipOpen:false,
        }
    }
    // state = {  }
    async componentWillMount(){
        await this.getData();
    }

    getData = async() => {
        var data;
        const params = new URLSearchParams(window.location.search)
        const id = params.getAll('id')[0]
        axios.get(`http://${window.location.hostname}:4005/booking/fetch/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then((response) => {
            console.log("Response data");
            console.log(response.data)
            if (response.status === 200 || response.status===304) {
                console.log("Fetched Booking");
                this.setState({
                    booking: response.data,
                    isDataReturned: true
                });
            }
        })
        .catch((e) => {
            // alert("Error! sorry, cant fetch booking..")
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
    
    render() { 
        const item = this.state.booking;
        if(!localStorage.getItem('isSignedIn')){
            alert("You are not signed In!");
            window.location.href = '/login-page'
        }
        const user = JSON.parse(localStorage.getItem('user'))
        return ( 
            <Container>
                {/* <MainHeader /> */}
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/admin1/home">Home</Link></BreadcrumbItem>
                    <BreadcrumbItem active>Booking Status</BreadcrumbItem>
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

                {this.state.isDataReturned ?
                <>
                    <h3 style={{textAlign:"center"}}><i> Venue Booking for {item.eventName} </i></h3><hr />
                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        id="1"
                        contentArrowStyle={this.state.arrow1}
                        date={new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}
                        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                        // icon={<WorkIcon />}
                    >
                        <h3 className="vertical-timeline-element-title">Booking Requested</h3>
                        <h6 className="vertical-timeline-element-subtitle">{(JSON.parse(item.user)).fullName} {' '}
                            <Badge color="success">Success</Badge></h6>
                        <p>
                            Requested Booking for {item.venue} on {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}
                        </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--education"
                        id="3"
                        contentArrowStyle={this.state.arrow3}
                        // date="13-12-2020"
                        iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                        // icon={<SchoolIcon />}
                    >
                        <h3 className="vertical-timeline-element-title">Approval</h3><hr />
                        <h6 className="vertical-timeline-element-subtitle">Venue Co-ordinator {' '}
                            {item.status==='Approved' ? 
                                <Badge color="success"> Success</Badge>
                                :
                                (item.status==='Pending' ? <Badge color="warning"> Pending</Badge>
                                : <>
                                    <Badge color="danger">Declined</Badge>
                                </>)
                            }
                        </h6>
                        <p> {item.approver2} </p>
                        <p>
                            Final Approval!
                        </p>
                        {(item.status!=='Approved' && item.status!=='Pending' )? 
                            <i>Comment from Venue Co-ordinator: {item.status} </i>
                            :
                            <></>
                        }
                        
                    </VerticalTimelineElement>
                    <VerticalTimelineElement
                        id="4"
                        iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                        contentArrowStyle={this.state.arrow3}
                        // icon={<StarIcon />}
                    />
                        
                    </VerticalTimeline>
                    {item.status==='Approved' ? 
                        <>
                            <h4 className="vertical-timeline-element-subtitle" style={{textAlign:"center"}}>Booking Successful! <Badge color="success">Success</Badge></h4>
                            <p style={{textAlign:"center"}}>Approved on {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(item.createdAt)))}</p>
                        </>
                        :
                        <></>
                    }
                     </>
                    :
                <>...</>
            }  
                    
            </Container>
        );
    }
}
 
export default Progress;