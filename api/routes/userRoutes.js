const express = require('express');

const router = express.Router();
const userController  =require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken')
const verifyAdmin = require('../middlewares/verifyAdmin')


router.get("/",verifyToken,verifyAdmin,userController.getAllUsers);
router.post("/",userController.createUser)
router.delete("/:id",verifyToken,verifyAdmin,userController.deleteUser);
router.get("/admin/:email",verifyToken,userController.getAdmin);
router.post('/forgot-password',verifyToken,userController.forgotPassword)
router.patch("/admin/:id",verifyToken,verifyAdmin,userController.makeAdmin)
router.patch("/:id", verifyToken, userController.updateProfile);
router.post('/send-email',verifyToken,userController.sendMail);



module.exports = router;