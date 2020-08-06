import React, { Component } from 'react';
import { Container } from 'reactstrap';
import {Link} from 'react-router-dom'

class Student extends Component {
    // state = {  }
    // componentDidMount(){
    //     alert('The Students Portal is is Development Mode!')
    //     window.location.href= '/'
    // }
    render() { 
        return ( 
            <Container style={{textAlign:"center"}}>
                <p>The Students Portal is is Development Mode! It will be live Shortly..</p>
                <p>Only Faculty can book LHC(1) or (2) as of now! {' '}
                    <Link to='/'>Go Back</Link>
                </p>
            </Container>
        );
    }
}
 
export default Student;