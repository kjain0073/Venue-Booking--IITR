import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-social/bootstrap-social.css';


// assets for this
import './index.css';
import './assets/css/LoginPage.css'
// import App from './App';
import * as serviceWorker from './serviceWorker';

// pages for this
import Index from "./views/Index.js";
import LoginPage from "./views/user/LoginPage.js";
import VenuePage from "./views/user/VenuePage.js";
import CalenderPage from "./views/user/CalenderPage.js";
import EventDescription from "./views/user/Event";
import TimeLine from "./views/user/TimeLine";
import MainHeader from './components/Headers/MainHeader'
import MainFooter from "./components/Footers/MainFooter";
import Home2 from './views/user/admin2/Home.js'

// pages for admin1
import Home from './views/user/admin1/Home.js'
import Venue from './views/user/admin1/Venue.js'
import CalenderPage2 from './views/user/admin1/Calender.js'
import Event2 from './views/user/admin1/Event2.js'
import Progress from './views/user/admin1/Progress.js'

import UserHome from "./views/user/UserHome";

import AcadsHandler from './views/user/AcadsHandler.js'
import ChanneliHandler from './views/user/ChanneliHandler.js'
import RoomPage from "./views/user/RoomPage";
import RoomPage2 from './views/user/admin1/RoomPage2.js'

import LHCBooking from './views/user/faculty/LHCBooking.js'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import FacultyHome from "./views/user/faculty/FacultyHome";
import Dashboard from "./views/user/faculty/Dashboard";
import Login from "./views/user/faculty/FacLogin";
import Student from "./views/user/faculty/Student";


ReactDOM.render(
    <BrowserRouter>
    <MainHeader />
    <ReactNotification />
    <div style={{minHeight:"70vh", paddingBottom:"30px"}}>
        <Switch>
            <Route path="/LHC/dashboard" render={props => <AcadsHandler {...props} />} />
            <Route path="/dashboard" render={props => <Dashboard {...props} /> } /> 
            <Route path="/login" render={props => <Login {...props} /> } />
            <Route path="/student" render={props => <Student {...props} /> } />

            {/* <Route path="/index" render={props => <Index {...props} /> } />
            <Route path="/login-page" render={props => <LoginPage {...props} /> } />
            <Route path="/home" render={props => <UserHome {...props} /> } />
            <Route path="/venue-page" render={props => <VenuePage {...props} /> } />
            <Route path="/room-page" render={props => <RoomPage {...props} /> } />
            <Route path="/calender-page" render={props => <CalenderPage {...props} /> } />
            <Route path="/event" render={props => <EventDescription {...props} /> } />
            <Route path="/booking/timeline" render={props => <TimeLine {...props} /> } /> */}

            <Route path="/channeli/oauth" render={props => <ChanneliHandler {...props} />} />
            
            {/* <Route path="/admin1/home" render={props => <Home {...props} /> } />
            <Route path="/admin1/venue-page" render={props => <Venue {...props} /> } />
            <Route path="/admin1/room-page" render={props => <RoomPage2 {...props} /> } />
            <Route path="/admin1/calender-page" render={props => <CalenderPage2 {...props} /> } />
            <Route path="/admin1/event" render={props => <Event2 {...props} /> } />
            <Route path="/admin1/booking/progress" render={props => <Progress {...props} /> } /> */}

            <Route path="/faculty/LHC/booking" render={props => <LHCBooking {...props} /> } />
            <Route path="/faculty/home" render={props => <FacultyHome {...props} /> } />

            
            
            {/* <Route path="/admin2/home" render={props => <Home2 {...props} /> } /> */}

            <Redirect to="/dashboard?q=1" />
            <Redirect from="/" to="/dashboard?q=1" />
        </Switch>
    </div>
    <MainFooter />
    </BrowserRouter>, 
    document.getElementById('root')
);

serviceWorker.unregister();
