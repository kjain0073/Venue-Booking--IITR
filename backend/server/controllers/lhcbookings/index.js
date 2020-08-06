// import Event from '../../../database/models/events/index.js'
import LHCBooking from './../../../database/models/lhcbookings/index.js'
import mongoose from 'mongoose'

export function submitLHCBooking(req, res, next){

    // console.log("req.body is")
    // console.log(req.body)
    
    let contentBody = {
        userId:req.body.userId,
        eventName:req.body.eventName,
        LHC:req.body.LHC,
        room:req.body.room,
        nthRoom:req.body.nthRoom,
        classType:req.body.classType,
        slot:req.body.slot,
        date:req.body.date,
        month:req.body.month,
        year:req.body.year,
        description:req.body.description,
        user:req.body.user
    }

    let newEvent = new LHCBooking(contentBody)
    console.log("new LHCEvent is ")
    console.log(newEvent)
    
    newEvent.save((err, event)=>{
        if(err){
            let errorMessage = err
            console.log(errorMessage)
            return res.status(400).json({
                errorMessage : errorMessage
            })
        }

         res.json(event)   
    })
}


export function fetchLHCBookings(req,res, next){
    // console.log(req.query.month)
    console.log("-------------------------")
    LHCBooking.find({userId:req.params.userId},(err,result)=>{
        if(err){
            let errorMessage = err
            console.log(errorMessage)
            return res.status(400).json({
                errorMessage : errorMessage
            })
        }
        // console.log(result)
        res.json(result)
    })
}

export function fetchBookedRooms(req,res, next){
    console.log(req.query)
    LHCBooking.find({LHC:req.query.LHC,slot:req.query.slot, date:req.query.date, month:req.query.month, year:req.query.year},(err,result)=>{
        if(err){
            let errorMessage = err
            console.log(errorMessage)
            return res.status(400).json({
                errorMessage : errorMessage
            })
        }
        var arr = new Array(30).fill(0);
        var n = result.length;
        
        for(var j=0;j<n;j++){
            arr[result[j].nthRoom] = {
                eventName: result[j].eventName,
                classType: result[j].classType,
                bookedBy: (JSON.parse(result[j].user)).fullName
            };
            
        }

        // console.log(arr)
        res.json(arr)
    })
}

export function verify(req,res, next){
    // console.log(req.query)
    LHCBooking.find({userId:req.query.userId, date:req.query.date, month:req.query.month, year:req.query.year},(err,result)=>{
        if(err){
            let errorMessage = err
            console.log(errorMessage)
            return res.status(400).json({
                errorMessage : errorMessage
            })
        }
        
        res.json(result)
    })
}

function comparator(a, b){
    var comp = 0;
    if(a.nthRoom > b.nthRoom){
        comp =  1;
    }else {
        comp = -1
    }

    return comp
}

export function fetchForLHCDashboard(req, res, next){
    console.log(req.query)
    LHCBooking.find({LHC:req.query.LHC, date:req.query.date, month:req.query.month, year:req.query.year},(err,result)=>{
        if(err){
            let errorMessage = err
            console.log(errorMessage)
            return res.status(400).json({
                errorMessage : errorMessage
            })
        }
        
        var n = 24;
        if(req.query.LHC==='1'){
            n = 16;
        }
        var arr = new Array(n);
        for (var i = 0; i < arr.length; i++) { 
            arr[i] = new Array(11).fill(0); 
        } 
        // console.log(arr)
        var r = result;
        r.sort(comparator);
        // console.log(r)

        for(var i=0;i<r.length;i++){
            var slot = (r[i].slot - 1);
            var room = r[i].nthRoom;
            arr[room][slot] = {
                eventName: r[i].eventName,
                bookedBy: (JSON.parse(r[i].user)).fullName,
                classType: r[i].classType
            }
        }

        // console.log(arr)
        // console.log(result)
        res.json(arr)
    })

}
