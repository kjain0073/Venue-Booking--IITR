import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'
import FormData from 'form-data'

import User from './../../../database/models/users/index.js'
import DbErrorHandler from './../../helpers/errorHandlers/database/index.js'
import {generateToken} from './../../helpers/tokenHandler/index.js'

const __dirname = path.resolve() // why __dirname is not working 
dotenv.config({path:path.resolve(__dirname , '.env')}) 

export function oAuthHandler(req,res, next){
    
    console.log(req.query);


    var uri = req.query.redirect_uri;
    var code = req.query.code;

    var data = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${uri}`

    console.log(data)

    axios
    .post(`https://internet.channeli.in/open_auth/token/`, data,{
        headers: {
          'content-type': "application/x-www-form-urlencoded",
          'cache-control': "no-cache",
        }
    })
    .then((response) => {
      console.log(response.data);
      res.status(response.status).send(response.data);
    })
    .catch((e) => {
      console.log("ERROR");
      console.log(e);
      // res.status(500).send(e);
    });


}


export function getUserData(req,res, next){

  var token = req.headers.authorization;
  console.log("headers token is: " + token);

  axios
    .get(`https://internet.channeli.in/open_auth/get_user_data/`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      console.log("view-member = ");
      
      const username = response.data.username;
      // console.log(userId)

      User.findOne({username: username}, (err, resp) => {
        if(err){
            let errorMessage = DbErrorHandler(err)
            console.log(errorMessage)
            return resp.status(400).json({
                errorMessage : errorMessage
            })
        }

        if(resp===null){
          const user  = new User(response.data)
          if(!(Object.keys(response.data.student).length === 0 && response.data.student.constructor === Object)){
              user.role =  'student'
          }else if(!(Object.keys(response.data.facultyMember).length === 0 && response.data.facultyMember.constructor === Object)){
              user.role =  'facultyMember'
          }
          // console.log(user)
          user.save((err, user)=>{
              if(err){
                  let errorMessage = DbErrorHandler(err)
                  console.log(errorMessage)
                  return resp.status(400).json({
                      errorMessage : errorMessage
                  })
              }

              console.log("User saved to DB!")
              console.log(user)

              let payload = {_id:user._id}
              let  token  =  generateToken(payload)
              res.cookie('t',token,{maxAge:9999})

              // const {_id, person , email,role, type} = user
              const _id = user._id;
              const userId = user.userId
              const fullName = user.person.fullName;
              const contact = user.contactInformation.primaryPhoneNumber;
              const email = user.contactInformation.instituteWebmailAddress;
              const role = user.role;

              return res.send({token:token, user :{_id,userId,fullName,contact,email,role}})
          })
        }else{
            console.log("User is there in DB!")
            console.log(resp)

            let payload = {_id:resp._id}
            let  tok  =  generateToken(payload)
            res.cookie('t',tok,{maxAge:9999})
            // const {_id, person , email,role, type} = user
            const _id = resp._id;
            const userId = resp.userId;
            const fullName = resp.person.fullName;
            const contact = resp.contactInformation.primaryPhoneNumber;
            const email = resp.contactInformation.instituteWebmailAddress;
            const role = resp.role;

            // console.log("TOKEN IS -");
            // console.log(tok)

            return res.send({token:tok, user :{_id,userId,fullName,contact,email,role}})
        }  
      })

    })
    .catch((e) => res.status(500).send("Error: " + e));
}

export function getFacultyData(req,res, next){

  // var token = req.headers.authorization;
  // console.log("headers token is: " + token);
  console.log(`http://10.22.0.73/api/v_IMGPersonalInfoFC/${req.query.e}`)

  axios
    .get(`http://10.22.0.73/api/v_IMGPersonalInfoFC/${req.query.e}`, {
      headers: {
        token: "qazmlp1010",
      }
    })
    .then((response) => {
      console.log("view-member = ");
      console.log(response.data)      // DATA AAGYA H, CHECK BACKEND TERMINAL
      
      const employeeID = response.data.EmployeeNo;
      console.log(employeeID)

      User.findOne({username: employeeID}, (err, resp) => {
        if(err){
            let errorMessage = DbErrorHandler(err)
            console.log(errorMessage)
            return resp.status(400).json({
                errorMessage : errorMessage
            })
        }
        console.log("resp is ")
        console.log(resp);
        if(resp===null){
          console.log("resp is null and user is-")
          const user  = new User({
              // userId: response.data.employeeID ,
              username: employeeID,
              person: {
                      shortName:'',
                      fullName:response.data.Name,
                      roles: {
                        role: response.data.Designation!==null ? 'facultyMember':'student',
                        activeStatus:'Active'
                      },
                      // displayPicture:response.data.FcPic 
                      displayPicture: null
              },
              student: {                                              //DISCUSS THIS!!
                startDate: response.data.StartSession,
                endDate: '',
                enrollmentNumber: response.data.EmployeeNo,
                currentYear:'',
                currentSemester: ''
               }, 
              facultyMember: {                                        //DISCUSS THIS!!
                startDate: response.data.StartSession,
                endDate: '',
                designation:response.data.Designation
              },
              contactInformation: {
                  emailAddress: response.data.EmailID,
                  instituteWebmailAddress:response.data.IITREmailID,
                  primaryPhoneNumber: response.data.ContactNo
              },
             
              role:response.data.Designation!==null ? 'facultyMember':'student',
              history:[]
          })
          //  if(!((response.data.Designation) === null)){
          //     user.role =  'facultyMember'
          // }
          // else
          //   user.role = 'student'

          console.log("user is ");
          console.log(user)

          user.save((err, user)=>{
              if(err){
                  let errorMessage = DbErrorHandler(err)
                  console.log(errorMessage)
                  return resp.status(400).json({
                      errorMessage : errorMessage
                  })
              }

              console.log("User saved to DB!")
              console.log(user)
              //check for string or number

              // const {_id, person , email,role, type} = user
              let payload = {userId:user.userId}
              let  token  =  generateToken(payload)
              res.cookie('t',token,{maxAge:9999})

              // const {_id, person , email,role, type} = user
              const _id = user._id;
              const userId = user.userId
              const fullName = user.person.fullName;
              const contact = user.contactInformation.primaryPhoneNumber;
              const email = user.contactInformation.instituteWebmailAddress;
              const role = user.role;


              return res.send({token:token, user :{_id,userId,fullName,contact,email,role}})
          })
        }
        else{
            console.log("User is there in DB!")
            console.log(resp)

            let payload = {_id:resp._id}
            let  tok  =  generateToken(payload)
            res.cookie('t',tok,{maxAge:9999})
            // const {_id, person , email,role, type} = user
            const _id = resp._id;
            const username = resp.username;
            const fullName = resp.person.fullName;
            const contact = resp.contactInformation.primaryPhoneNumber;
            const email = resp.contactInformation.instituteWebmailAddress;
            const role = resp.role;

            // console.log("TOKEN IS -");
            // console.log(tok)

            return res.send({token:tok, user :{_id,username,fullName,contact,email,role}})
        }  
      })

    })
    .catch((e) => console.log(e));
}