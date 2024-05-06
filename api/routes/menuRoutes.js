const express = require('express');
const Menu = require('../models/Menu');
const router = express.Router();


const menuController = require('../controllers/menuController') 
const verifyToken = require('../middlewares/verifyToken')

//get all menu items
router.get("/search", menuController.searchMenuItems);
router.get('/',menuController.getAllMenuItems);
router.post('/',menuController.postMenuItem);
router.delete('/:id',menuController.deleteMenuItem);
router.get('/:id',menuController.singleMenuItem);


router.patch('/:id',menuController.updateMenuItem);
router.patch('/:id/like',verifyToken, menuController.likeMenuItem);
router.patch('/:id/dislike',verifyToken, menuController.dislikeMenuItem);




module.exports = router;