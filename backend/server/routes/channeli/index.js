import express from 'express'
import {oAuthHandler, getUserData}  from '../../controllers/channeli/index.js'
// import {isAuth ,isAdmin} from '../../helpers/authorizers/index.js'
// import authorizer from '../../helpers/authorizers/index.js'

const router  = express.Router()


router.post('/channeli/oauth', oAuthHandler);
router.get('/channeli/getData', getUserData);


export default router