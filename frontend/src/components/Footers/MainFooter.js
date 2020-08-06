import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MainFooter extends Component {
    // state = {  }
    render() { 
        return ( 
            <div className="footer" id="footer">
                <hr />
                <div className="row justify-content-center">             
                    <div className="col-auto footer-text">
                        <p>Made with <span className="fa fa-heart" style={{color:"red"}}></span> by Students' Technical Council, IITR</p>
                    </div>
                </div>
                <hr style={{marginBottom:"0"}} />
            </div>
        );
    }
}
 
export default MainFooter;