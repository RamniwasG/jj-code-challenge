const express = require('express');
const app = express();
const router = express.Router();
var cors = require('cors')

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')
const bodyParser = require('body-parser');

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/test_db';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// config
const config = require('./config');

app.use(logger('dev'));

// cors
var corsOptionsDelegate = function (req, callback) {
	var corsOptions = {
		origin: ['http://localhost:3000'],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		optionsSuccessStatus: 200
	};
	if (corsOptions.origin.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
	} else {
		corsOptions = { origin: false } // disable CORS for this request
	}
	callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	next();
});

// Router middleware, mentioned it before defining routes.
router.use(function(req, res, next) {
	console.log("/" + req.method);
	next();
});

// all routes
const routes = require('./routes');
app.use('/', routes);

// Handle 404 error.
// The last middleware.
app.use("*",function(req,res){
	res.status(404).send('404');
});

const PORT = process.env.PORT || config.port;
app.listen(PORT, () => {
	console.log(`server is listening at http://${config.host}:${PORT}`)
})

