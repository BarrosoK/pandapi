const {respond} = require('../utils/utils');
const Conversation = require('../models/conversation.model');
const questions = require('../data/questions.json');
const fs = require('fs');

const q = [];
for (var k in questions) {
    q.push(questions[k].question);
}

module.exports.getAll = async (req,res) => {
    res.status(200).json(questions);
};

module.exports.addQuestion = async (req, res) => {
    const path = [];
    console.log(req.body);
    if (req.body.path === -1) {
        questions.push({
            question: req.body.question,
            answer: req.body.answer
        });
        console.log(questions);
    } else {
        [...req.body.path].forEach(c => path.push(+c));
        let depth = 1;
        let conv = questions[path[0]];
        while (depth < path.length && conv['sub_questions']) {
            conv = conv['sub_questions'][path[depth]];
            depth++;
        }
        console.log(conv);
        if (!conv.sub_questions) {
            conv.sub_questions = [];
        }
        conv.sub_questions.push({
            question: req.body.question,
            answer: req.body.answer
        });
    }

    fs.writeFile('./data/questions.json', JSON.stringify(questions), function writeJSON(err) {
        if (err) return console.log(err);
    });
    res.status(200).json('done');
}

module.exports.deleteConversationById = async (req, res) => {
    const done = await Conversation.remove({ _id: req.params.id });
    //TODO: check if error
    res.status(200).json(done);
};

module.exports.getConversationById = async (req, res) => {
    const conversation = await Conversation.find({_id: req.params.id});
    const path = conversation[0].path;
    const result = [];
    let depth = 1;
    let conv = questions[path[0]];

    result.push({author: 'me', text: conv['question']});
    result.push({author: 'bot', text: conv['answer']});
    while (depth < path.length && conv['sub_questions']) {
        conv = conv['sub_questions'][path[depth]];
        result.push({author: 'me', text: conv['question']});
        result.push({author: 'bot', text: conv['answer']});
        depth++;
    }

    res.status(200).json(result);
};

module.exports.getConversation = async (req, res) => {
    const filter = req.query.filter;
    const order = req.query.order;
    const pageIndex = req.query.pageIndex;
    const pageSize = req.query.pageSize;

    const conversations = await Conversation.find({}, {_v: 0},{sort: {createdAt: order}, limit: +pageSize, skip: (+pageIndex * +pageSize)});
    const total = await Conversation.count({});
    res.status(200).json({data: conversations, total});
};

module.exports.list = async (req, res) => {
    res.status(200).json({questions: q});
};

module.exports.ask = async (req, res) => {
    console.log(req.body);
    if (req.body.id === undefined || req.body.id.length === 0 || req.body.id > questions.length) {
        res.status(400).json({'message': 'invalid id'});
    }
    let path = req.body.id;
    let depth = 1;
    console.log(path);
    let conv = questions[path[0]];

    while (depth < path.length && conv['sub_questions']) {
        conv = conv['sub_questions'][path[depth]];
        depth++;
    }
    const sub = [];
    if (conv['sub_questions']) {
        // If the conversation has subquestions
        for (var k in conv['sub_questions']) {
            sub.push(conv['sub_questions'][k].question);
        }
    } else {
        const convDb = new Conversation({path: path});
        console.log(path, convDb);
        try {
            await convDb.save();
        } catch (e) {
            console.log(e);
        }
    }
    res.status(200).json({'answer': conv.answer, sub, path});
};
