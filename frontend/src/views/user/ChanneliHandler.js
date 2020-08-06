import React, { Component } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios'

import { css } from "@emotion/core";
import ScaleLoader from "react-spinners/ScaleLoader";
import {CHANNELI_REDIRECT_URI} from './../../base.js'

const override = css`
  filter: blur(-3px);
  height: 100%;
  min-height:50vh;
`;

class ChanneliHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          userType:''
        };
      }

      getUserData = async(a_token, r_token) => {
        var dataReceived;
        
        await axios.get(`http://${window.location.hostname}:4005/channeli/getData`,
            {
                'headers': {
                    'Authorization': `Bearer ${a_token}`
                }
            }
        ).then((response) => {
            console.log("view-member = ");
            console.log(response.data);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('isSignedIn', true)

            this.setState({userType: response.data.user.role})
            console.log(this.state.userType)
            if(this.state.userType === 'student'){
                window.location.href = '/student'
            }else if(this.state.userType ==='facultyMember'){
                window.location.href = '/'
            }else{
                alert('You cannot login using channeli');
                window.location.href='/login-page'
            }
          })
          .catch((e) => console.log(e));

      }

      componentDidMount(){

        const params = new URLSearchParams(window.location.search)
       
        const code = params.getAll('code')[0]

        if(params.getAll('code')[0]){

            axios.post(`http://${window.location.hostname}:4005/channeli/oauth?code=${code}&redirect_uri=${CHANNELI_REDIRECT_URI}`)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                
                this.getUserData(response.data.access_token, response.data.refresh_token);
                
            })
            .catch((e) => {
                console.log("ERROR");
                console.log(e);
            });
        }
      }
     
      render() {
        return (
            <Container>
                <div className="sweet-loading text-center">
                    <ScaleLoader
                        css={override}
                        size={150}
                        color={"#009dff"}
                        loading={this.state.loading}
                    />
                </div>
            </Container>

        );
      }
}
 
export default ChanneliHandler;