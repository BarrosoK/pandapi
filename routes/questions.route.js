const express = require('express');
const router = express.Router();
const controller = require('../controllers/questions.controller');

router.get('/',
    controller.list);

router.post('/',
    controller.ask);

router.post('/add',
    controller.addQuestion);

router.get('/conversations',
    controller.getConversation);

router.get('/conversation/:id',
    controller.getConversationById);

router.delete('/conversation/:id',
    controller.deleteConversationById);

router.get('/all',
    controller.getAll);

module.exports = router;
