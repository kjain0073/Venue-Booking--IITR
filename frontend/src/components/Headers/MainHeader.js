import React, { Component } from 'react';
// import {Row,Col} from 'reactstrap';
import { Navbar, NavbarBrand, Nav,  NavItem} from 'reactstrap';
// import {NavLink} from 'react-router-dom';

class MainHeader extends Component {
    // state = {  }
    render() { 
        return ( 
            <div className="container" style={{paddingBottom:"20px"}}> 
                <Navbar className="d-flex align-items-center justify-content-center">
                    <NavbarBrand className="" href="/">
                        <img src={require('./../../assets/img/IITR1.png')} className="img-responsive rounded mx-auto" height="80" width="80"
                            alt="IITR" />
                    </NavbarBrand>

                    <Nav navbar className="mr-auto  d-none d-sm-block">
                        <NavItem style={{listStyleType:"none"}}>
                            <h3 style={{fontSize:"2vw"}} className="d-none d-sm-block d-flex justify-content-center"> भारतीय प्रौद्योगिकी संस्थान रुड़की </h3>	
                            <h3 style={{fontSize:"2vw"}} className="d-none d-sm-block d-flex justify-content-center">INDIAN INSTITUTE OF TECHNOLOGY ROORKEE</h3>
                        </NavItem>
                    </Nav>                        
                </Navbar>
                <hr />
            </div> 
        );
    }
}
 
export default MainHeader;
