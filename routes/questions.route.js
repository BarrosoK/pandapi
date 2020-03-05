const express = require('express');
const router = express.Router();
const controller = require('../controllers/questions.controller');

router.get('/',
    controller.list);

router.post('/',
    controller.ask);

router.get('/conversations',
    controller.getConversation);

router.get('/conversation/:id',
    controller.getConversationById);

router.delete('/conversation/:id',
    controller.deleteConversationById);

module.exports = router;
