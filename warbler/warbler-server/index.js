require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// all my routes here - they will come later!

app.use('/api/auth', authRoutes);
app.use('/api/users/:id/messages', 
    loginRequired, 
    ensureCorrectUser, 
    messageRoutes
);

app.use(function(req, res, next) {
    let err = new Error("Not found")
    err.status = 404;
    next(err);
})

app.get('/api/messages', loginRequired, async function(req, res, next) {
    try {
        let messages = db.Message.find()
        .sort({createdAt: 'desc'})
        .populate('user', {
            username: true,
            profileImageUrl: true
        });
        return res.status(200).json(messages);

    } catch(e) {
        return next(e);
    }

})

app.use(errorHandler)

app.listen(PORT, function() {
    console.log(`Server is starting on port ${PORT}`);
})