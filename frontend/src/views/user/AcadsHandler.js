import React, { Component } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios'

import { css } from "@emotion/core";
import ScaleLoader from "react-spinners/ScaleLoader";

const override = css`
  filter: blur(-3px);
  height: 100%;
  min-height:50vh;
`;

class AcadsHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          userType:''
        };
      }

      getFacultyUserData = async() => {
        var dataReceived;
        
        await axios.get(`http://${window.location.hostname}:4005/acads/getData`,
            {
                'headers': {
                    'token': `qazmlp1010`
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
                alert('You cannot login using this');
                window.location.href='/login-page'
            }
          })
          .catch((e) => console.log(e));

      }

      componentDidMount(){

        const params = new URLSearchParams(window.location.search)
        const e = params.getAll('e')[0];

        if(params.getAll('e')[0]){

            axios.post(`http://10.22.0.73/api/v_IMGPersonalInfoFC/100384/${e}`)
            .then((response) => {
                console.log(response.data);
                this.getUserData();
                
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
 
export default AcadsHandler;