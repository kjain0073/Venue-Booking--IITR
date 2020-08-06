import mongoose from '../../connect.js'

const Schema = mongoose.Schema
const model = mongoose.model

const LHCBooking = new Schema({
    userId:{
        type:Number,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    LHC:{
        type:Number,
        required:true
    },
    room:{
        type: String,
        required: true
    },
    nthRoom:{
        type:Number,
        required:true
    },
    classType:{
        type:String,
        required:true
    },
    slot:{
        type:Number,
        required:true
    },
    date:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    description:{
        type:String
    },
    user:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Booked'
    }
},({timestamps:true}))

export default model('LHCBooking' ,LHCBooking)