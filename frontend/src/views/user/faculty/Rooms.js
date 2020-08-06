import React, { Component } from 'react';
import { Row, Col,Button, Card , Tooltip} from 'reactstrap';
import Details from './Details';
import axios from 'axios'


const Rooms1 = [{no:'003', n:0}, {no:'004', n:1}, {no:'005', n:2}, {no:'006',n:3}, {no:''},{no:''}, {no:'101', n:4}, {no:'102', n:5}, {no:'103', n:6}, {no:'104', n:7}, {no:'105', n:8}, {no:'106', n:9}, {no:'201', n:10}, {no:'202', n:11}, {no:'203', n:12}, {no:'204',n:13}, {no:'205', n:14}, {no:'206',n:15}];
const Rooms2 = [{no:'201', n:0}, {no:'202',n:1}, {no:'203', n:2}, {no:'204', n:3},{no:''},{no:''}, {no:'301',n:4}, {no:'302', n:5}, {no:'303', n:6}, {no:'304', n:7}, {no:''},{no:''}, {no:'401', n:8}, {no:'402', n:9}, {no:'403', n:10}, {no:'404', n:11}, {no:''},{no:''}, {no:'501',n:12}, {no:'502',n:13}, {no:'503',n:14}, {no:'504',n:15}, {no:'505',n:16}, {no:'506',n:17}, {no:'601',n:18}, {no:'602',n:19}, {no:'603',n:20}, {no:'604',n:21}, {no:'605',n:22}, {no:'606',n:23}];

class Rooms extends Component {
    constructor(props){
        super(props);
        this.state = {
            tooltipOpen:new Array(30).fill(false),
            tooltipOpen2:new Array(30).fill(false),
            selectedRoom:'',
            roomIndex: 0,
            LHC:1,
            // tooltipOpen:false,
            bookings1:[],
            bookings2:[],
            canBook:true
        }
    }

    toggle = (i) => {
        var arr = this.state.tooltipOpen;
        arr[i] = !arr[i];
        this.setState({tooltipOpen: arr})
    }

    toggle2 = (i) => {
        var arr = this.state.tooltipOpen2;
        arr[i] = !arr[i];
        this.setState({tooltipOpen2: arr})
    }

    // async componentWillMount(){
    //     await this.getBookedRooms1();
    //     await this.getBookedRooms2();
    //     await this.verify();
    // }

    getBookedRooms1 = async() => {
        const response = await axios.get(`http://${window.location.hostname}:4005/booked/lhc/fetch?LHC=1&slot=${this.props.selectedSlot}&date=${this.props.date}&month=${this.props.month}&year=${this.props.year}`)
        console.log(response.data);
        this.setState({bookings1:response.data})
    }

    getBookedRooms2 = async() => {
        const response = await axios.get(`http://${window.location.hostname}:4005/booked/lhc/fetch?LHC=2&slot=${this.props.selectedSlot}&date=${this.props.date}&month=${this.props.month}&year=${this.props.year}`)
        console.log(response.data);
        this.setState({bookings2:response.data})
    }

    verify = async() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await axios.get(`http://${window.location.hostname}:4005/booked/lhc/verify?date=${this.props.date}&month=${this.props.month}&year=${this.props.year}&userId=${user.userId}`)
        console.log(response.data);
        if(response.data.length >= 2){
            this.setState({canBook:false})
        }else{
            this.setState({canBook:true})
        }
    }
    componentDidUpdate(prevProps){
        if (this.props.selectedSlot !== prevProps.selectedSlot || this.props.date !== prevProps.date || this.props.month !== prevProps.month|| this.props.year !== prevProps.year) {
            this.getBookedRooms1();
            this.getBookedRooms2();
            this.verify();
          }
        
    }

    handleRoomSelect = (n,i, k) => {
        var r = n.target.value;
        console.log(r)
        // n.preventDefault();
        this.setState({
            selectedRoom:(r),
            roomIndex:i,
            LHC:k
        });
        
        console.log('------------');
        console.log(n.target.value)
        console.log(this.state.selectedRoom)
        document.getElementById(`room${this.state.LHC}${this.state.roomIndex}`).classList.add(`btn-outline-success`)
        var ele = document.getElementById(`room${k}${i}`);
        ele.classList.remove(`btn-outline-success`)

    }

    // handleRoom2Select = (n,i) => {
    //     var r = n.target.value;
    //     // console.log(r)
    //     // n.preventDefault();
    //     this.setState({
    //         selectedRoom:(r),
    //         roomIndex:i,
    //         LHC:2
    //     });

    //     console.log('------------');
    //     console.log(i)
    //     console.log(this.state.roomIndex)
    //     document.getElementById(`room2${this.state.roomIndex}`).classList.add(`btn-outline-success`)
    //     var el = document.getElementById(`room2${i}`);
    //     el.classList.remove(`btn-outline-success`)
    // }

    render() { 
        // console.log(Rooms1.length)
        return ( 
            <Row>
                <Col md={12} style={{borderRight:"1px"}}>
                    <Row style={{padding:"20px", textAlign:"center"}}>
                        <Col md={12}>Rooms in LHC(1)</Col>
                    </Row>
                    <Card>
                        <Row>
                            {Rooms1.map((room, index) => {
                                var number = room.no; 
                                return (
                                    <Col xs={2} sm={2} className="d-flex justify-content-center" key={room.n}>
                                        {number!=='' ?
                                        <> 
                                            <Button className={((this.state.bookings1.length!==0) ? (this.state.bookings1[room.n]!==0 ? `btn-danger` : `btn-success btn-outline-success`) : `btn-secondary btn-outline-secondary` )} 
                                                value={number} key={number} id={`room1${room.n}`}  disabled={(this.state.bookings1[room.n]!==0)} active={false} 
                                                onClick={(number) => this.handleRoomSelect(number, room.n, 1)}> {number} </Button>
                                            {(this.state.bookings1.length!==0 && this.state.bookings1[room.n]!==0) ? 
                                                <Tooltip placement="top" isOpen={this.state.tooltipOpen[room.n]} target={`room1${room.n}`} toggle={() => this.toggle(room.n)}>
                                                    
                                                    Event Name: {this.state.bookings1[room.n].eventName},
                                                    BookedBy: {this.state.bookings1[room.n].bookedBy},
                                                    classType: {this.state.bookings1[room.n].classType}
                                                </Tooltip> 
                                            :<></>}
                                        </>
                                        :<></>}
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>
                <Col md={12}>
                    <Row style={{padding:"20px", textAlign:"center"}}>
                        <Col md={12}>Rooms in LHC(2)</Col>
                    </Row>
                    <Card>
                        <Row>
                            {Rooms2.map((room, index) => {
                                var number = room.no; 
                                return (
                                    <Col xs={2} sm={2} className="d-flex justify-content-center" key={room.n}>
                                        {number!=='' ?
                                        <> 
                                            <Button className={((this.state.bookings2.length!==0) ? (this.state.bookings2[room.n]!==0 ? `btn-danger` : `btn-success btn-outline-success`) : `btn-secondary btn-outline-secondary` )} 
                                                value={number} key={number} id={`room2${room.n}`}  disabled={(this.state.bookings2[room.n]!==0)} active={false} 
                                                onClick={(number) => this.handleRoomSelect(number, room.n, 2)}> {number} </Button>
                                            {(this.state.bookings2.length!==0 && this.state.bookings2[room.n]!==0) ? 
                                                <Tooltip placement="top" isOpen={this.state.tooltipOpen2[room.n]} target={`room2${room.n}`} toggle={() => this.toggle2(room.n)}>
                                                    
                                                    Event Name: {this.state.bookings2[room.n].eventName},
                                                    BookedBy: {this.state.bookings2[room.n].bookedBy},
                                                    classType: {this.state.bookings2[room.n].classType}
                                                </Tooltip> 
                                            :<></>}
                                        </>
                                        :<></>}
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>

                <Col md={12}><hr />
                    
                            {this.state.selectedRoom!=='' ?
                                <>
                                    <i>Selected Room is <Button color="success">{this.state.selectedRoom}</Button> from LHC({this.state.LHC})</i><hr/>
                                </>
                                :<></>
                            }
                    
                </Col>
                <Col md={12}>
                {this.state.canBook ?
                        <>
                    {this.state.selectedRoom!=='' ?
                        <>
                            <Details  date={this.props.date} month={this.props.month} year={this.props.year} roomIndex={this.state.roomIndex} selectedSlot={this.props.selectedSlot} LHC={this.state.LHC} selectedRoom={this.state.selectedRoom}/>
                        </>
                        :<></>
                    }
                    </> 
                        :
                        <p>You have already Booked 2 slots on this date! You cannot book any more slots on this date..</p>
                    }
                </Col>
                

            </Row>
        );
    }
}
 
export default Rooms;