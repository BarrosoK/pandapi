const authRoutes = require('./auth.route');
const questionsRoutes = require('./questions.route');

module.exports = [
    {path: 'auth', handler: authRoutes},
    {path: 'questions', handler: questionsRoutes}
];
