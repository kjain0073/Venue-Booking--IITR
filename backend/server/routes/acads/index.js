import express from 'express'
import {getFacultyData}  from '../../controllers/channeli/index.js'
// import {isAuth ,isAdmin} from '../../helpers/authorizers/index.js'
// import authorizer from '../../helpers/authorizers/index.js'

const router  = express.Router()

router.get('/acads/getData',getFacultyData);

export default router