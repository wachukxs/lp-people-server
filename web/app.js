// const app = require('express')(); // ?
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

const ImageRoutes = require('../controllers/ImageController');


let morganFormat = 'tiny'
if (app.get('env') === 'production') { // process.env.NODE_ENV
    app.set('trust proxy', 1) // trust first proxy
    morganFormat = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
}

app.use(cors({

}))
app.use(express.json({
    limit: '3mb'
}))

// set morgan to log info about our requests for development use.
app.use(morgan(morganFormat))

app.use('/api', [ImageRoutes])

// The app.locals object has properties that are local variables within the application.
app.locals.title = 'Labour Party Logo Generator';

// must always be last route, must be last route because of 404 pages/error
app.use(function (req, res) {
    res.send('OK')
});

/**
 * open https://using-umami.herokuapp.com/ to see amazing metrics
 * 
 * should we be using res.locals as opposed to req.session?
 */
var helmet = require('helmet');
app.use(helmet());

module.exports = app; // app.get('env')

/**
 * running on heroku at
 * Creating app... done, ⬢ corpers-online
 * https://corpers-online.herokuapp.com/ | https://git.heroku.com/corpers-online.git
 */