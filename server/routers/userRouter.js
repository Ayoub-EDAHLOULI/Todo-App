const router = require('express').Router();
const {register, login} = require('../controller/userController');



router.route('/userRegister').post(register);
router.route('/userLogin').post(login);


module.exports = router