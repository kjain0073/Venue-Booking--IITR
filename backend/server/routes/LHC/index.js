import express from 'express'
import {submitLHCBooking,fetchLHCBookings,fetchBookedRooms, verify, fetchForLHCDashboard} from './../../controllers/lhcbookings/index.js'
import {isAuth, isAdmin1} from '../../helpers/authorizers/index.js'
import authorizer from '../../helpers/authorizers/index.js'

const lhcRouter  = express.Router()

lhcRouter.post('/booking/lhc/submit',authorizer(), isAuth, isAdmin1, submitLHCBooking)

lhcRouter.get('/bookings/lhc/fetch/:userId',authorizer(),fetchLHCBookings)
lhcRouter.get('/booked/lhc/fetch',fetchBookedRooms)
lhcRouter.get('/booked/lhc/verify', verify)

lhcRouter.get('/dashboard/fetch', fetchForLHCDashboard)

export default lhcRouter;