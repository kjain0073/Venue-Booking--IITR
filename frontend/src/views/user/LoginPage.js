import React, { Component } from 'react';
// import MainHeader from '../../components/Headers/MainHeader';
import {Form, FormGroup, Label, Input, Button, Row, Col} from 'reactstrap'

import { Control, LocalForm, Errors } from 'react-redux-form';
import {Link} from 'react-router-dom';
import axios from 'axios'
import {CLIENT_ID, CHANNELI_REDIRECT_URI} from './../../base.js'
import { store } from 'react-notifications-component';


const required = (val) => val && val.length;

class LoginForm extends Component {
    // state = {  }
    handleLogin = (values) => {
        // console.log()
        axios.post(`http://${window.location.hostname}:4005/signIn`,{
            email: values.email,
            password: values.password
        })
        .then(response => {

            console.log("Response is - ")
            console.log(response)
            
                if(response.status!== 401 && response.status !== 400 ){
                   
                    if(response.data.user.email) { 
                        console.log(response.data);
                        // console.log("Token is " + response.data.token)
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('isSignedIn', true)
                        localStorage.setItem('user',JSON.stringify(response.data.user))
                        window.location.href='/admin2/home'

                    }
                }

        }).catch(function(err){      
            console.log("catch err is ");
            console.log(err)  
            store.addNotification({
                title: "Alert!",
                message: "Invalid Credentials.Please try Again!",
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
            // alert("Invalid Credentials.Please try Again!");
        });
    }
    render() { 
        return ( 
            <LocalForm onSubmit={(values) => this.handleLogin(values)}>
                <Row className="form-group">
                    <Label htmlFor=".email" md={12}>Email:</Label>
                    <Col md={12}>
                        <Control.input model=".email" id="email" name="email"
                            className="form-control"
                            placeholder="abc@iitr.ac.in..."
                            validators={{
                                required
                            }}
                        />
                        <Errors 
                            className="text-danger"
                            model=".email"
                            show="touched"
                            messages={{
                                required: 'Required! '
                            }}
                        />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor=".password" md={12}>Password:</Label>
                    <Col md={12}>
                        <Control.password model=".password" id="password" name="password"
                            className="form-control"
                            validators={{
                                required
                            }}
                        />
                        <Errors 
                            className="text-danger"
                            model=".password"
                            show="touched"
                            messages={{
                                required: 'Required! '
                            }}
                        />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col md={{size:10}}>
                        <Button type="submit" value="submit" className="ml-auto d-flex justify-content-right" color="primary" outline>Login</Button>
                    </Col>
                </Row>
            </LocalForm>
        );
    }
}

class Channeli extends Component {
    // state = {  }

    handleChanneli = async() => {
        // var redirect_uri = 'http://localhost:3000/channeli/oauth'
        // console.log(CLIENT_ID)
        window.location.href=`https://intranet.channeli.in/oauth/authorise?client_id=${CLIENT_ID}&redirect_uri=${CHANNELI_REDIRECT_URI}&state=success`;
        // window.location.href=`https://stage.channeli.in/oauth/authorise?client_id=${CLIENT_ID}&redirect_uri=${CHANNELI_REDIRECT_URI}&state=success`;
    }

    render() { 
        return ( 
            <Col style={{textAlign:"center", paddingBottom:"77px", marginBottom:"77px"}}>
                <h4>Sign in to your profile</h4>
                <Button color="primary" outline id="channeli-btn" onClick={this.handleChanneli}>
                    <img src={require('./../../assets/img/channeli.png')} width="25" height="25" />  {' '}
                    Sign in with Channeli
                </Button>
            </Col>
         );
    }
}


class LoginPage extends Component {
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
                window.location.href = '/home'
            }else if(role ==='facultyMember'){
                window.location.href = '/admin1/home'
            }else if(role==='staff'){
                // alert('You cannot login using channeli');
                window.location.href='/admin2/home'
            }
        }
        // console.log(role)
    }

    handleClick = (n) => {
        if(n==0){
            var ele = document.getElementById('approval');
			ele.classList.add("span-active");

			var ele2 = document.getElementById('booking');
            ele2.classList.remove("span-active")
            
            this.setState({channeli: true})

        }else if(n==1){
            var ele = document.getElementById('booking');
			ele.classList.add("span-active");

			var ele2 = document.getElementById('approval');
            ele2.classList.remove("span-active")
            
            this.setState({channeli: false})
        }
    }

    render() { 
        return ( 
            <section>
                {/* <MainHeader /> */}
                <div className="container">
                    <Row>
                        <Col style={{textAlign:"center"}}>
                            <span style={{marginRight:"10px"}} id="approval" className="span-class span-active" onClick={() => this.handleClick(0)}>Channeli Login</span>
                            <span id="booking" className="span-class" onClick={() => this.handleClick(1)}>Other</span>
                        </Col>
                        <hr />
                    </Row><hr />

                    <Row>
                        <Col></Col>
                        <Col md={4}>
                            {this.state.channeli ?
                                <Channeli />
                                :
                                <LoginForm />
                            }
                        </Col>
                        <Col></Col> 
                    </Row>

                </div>    
            </section>      
        );
   
    }
 }
export default LoginPage;