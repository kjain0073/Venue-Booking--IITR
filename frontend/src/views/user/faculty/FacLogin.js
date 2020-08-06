import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import {Form, FormGroup, Label, Input, Button, Row, Col} from 'reactstrap'

import { Control, LocalForm, Errors } from 'react-redux-form';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {CLIENT_ID, CHANNELI_REDIRECT_URI} from './../../../base.js'
import { store } from 'react-notifications-component';


const required = (val) => val && val.length;

class Channeli extends Component {
    // state = {  }

    handleChanneli = async() => {
        window.location.href=`http://newchanneli.iitr.ac.in/?next=/oauth/authorise?client_id=${CLIENT_ID}&redirect_uri=${CHANNELI_REDIRECT_URI}&state=success`;
        // window.location.href=`http://internet.channeli.in/oauth/authorise?client_id=${CLIENT_ID}&redirect_uri=${CHANNELI_REDIRECT_URI}&state=success`;
    }

    render() { 
        return ( 
            <Col style={{textAlign:"center", paddingBottom:"77px", marginBottom:"77px"}}>
                <h4>Sign in to your profile</h4>
                <Button color="primary" outline id="channeli-btn" onClick={this.handleChanneli}>
                    <img src={require('./../../../assets/img/channeli.png')} width="25" height="25" />  {' '}
                    Sign in with Channeli
                </Button>
            </Col>
         );
    }
}


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            channeli:true
        }

        console.log("Chgeclking---");
        
        var user = localStorage.getItem('user');
        console.log(user);
        if(user){
            var role = JSON.parse(user).role;
            if(role === 'student'){
                window.location.href = '/student'
            }else if(role ==='facultyMember'){
                window.location.href = '/'
            }else if(role==='staff'){
                // alert('You cannot login using channeli');
                window.location.href='/admin2/home'
            }
        }
        // console.log(role)
    }

    // handleClick = (n) => {
    //     if(n==0){
    //         var ele = document.getElementById('approval');
	// 		ele.classList.add("span-active");

	// 		var ele2 = document.getElementById('booking');
    //         ele2.classList.remove("span-active")
            
    //         this.setState({channeli: true})

    //     }else if(n==1){
    //         var ele = document.getElementById('booking');
	// 		ele.classList.add("span-active");

	// 		var ele2 = document.getElementById('approval');
    //         ele2.classList.remove("span-active")
            
    //         this.setState({channeli: false})
    //     }
    // }

    render() { 
        return ( 
            <section>
                {/* <MainHeader /> */}
                <div className="container">
                    <Row>
                        <Col style={{textAlign:"center"}}>
                            <span style={{marginRight:"10px"}} id="approval" className="span-class span-active">Channeli Login</span>
                            {/* <span id="booking" className="span-class" onClick={() => this.handleClick(1)}>Other</span> */}
                        </Col>
                        <hr />
                    </Row><hr />

                    <Row>
                        <Col></Col>
                        <Col md={4}>
                            {/* {this.state.channeli ? */}
                                <Channeli />
                                {/* : */}
                                {/* <LoginForm />
                            } */}
                        </Col>
                        <Col></Col> 
                    </Row>

                </div>    
            </section>      
        );
   
    }
 }
export default Login;