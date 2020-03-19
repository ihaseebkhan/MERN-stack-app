var express = require('express');
const actions = require('./actions');
var session = require('express-session');
var cors = require('cors');
var multer = require('multer')
const stripe = require("stripe")("sk_test_dJj4Iq1n9g5JhupbftDTTcq700UqEYZsWN");
const uuid = require("uuid/v4");

require('dotenv/config');
var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));
app.use(session({
secret: process.env.secretKey,
resave: true,
saveUninitialized: true,
rolling: true, 
cookie: {
  httpOnly: true,
  maxAge: 1*60*60*1000
}
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../src/person_data')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' +file.originalname )
    }
  })
  
  var upload = multer({ storage: storage }).array('file')

  app.post('/upload',function(req, res) {
    
    upload(req, res, function (err) {
     
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json(err)
          // An unknown error occurred when uploading.
        } 
        
        return res.status(200).send(req.files)
        // Everything went fine.
      })
});

app.post("/checkout", async (req, res) => {
    
  
    let error;
    let status;
    try {
      const { token } = req.body;
  
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
      });
  
      const idempotency_key = uuid();
      const charge = await stripe.charges.create(
        {
          amount: 100 * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the Memorial`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip
            }
          }
        },
        {
          idempotency_key
        }
      );
      
      status = "success";
    } catch (error) {
      console.error("Error:", error);
      status = "failure";
    }
  
    res.json({ error, status });
  });

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.status(200).send('Logged out successfully! ');
  });  

app.post('/signup', actions.checkUsernameSignupUser, actions.userSignup);
app.post('/userSignin', actions.checkUsernameSigninUser, actions.userSignin);


app.post('/adminSignin', actions.checkUsernameSigninAdmin, actions.adminSignin);

app.post('/createMemorial', actions.createMemorial);

app.get('/readMemorialsApproved', actions.readMemorialsApproved);
app.get('/readMemorialsNotApproved', actions.readMemorialsNotApproved);
app.post('/searchMemorials', actions.searchMemorials);

app.post('/readTribute', actions.readTribute);
app.post('/readMemorial', actions.readMemorial);
app.post('/readImages', actions.readImages);
app.post('/readVideos', actions.readVideos);
app.post('/readContact', actions.readContact);

app.post('/createTribute', actions.createTribute);

app.post('/approveMemorial', actions.approveMemorial);
app.post('/deleteMemorial', actions.deleteMemorial);



app.get('/:deceased_id', actions.readMemorial);


app.post('/updateTribute', actions.checkAuthAdmin, actions.updateTribute);
app.post('/deleteTribute', actions.checkAuthAdmin, actions.deleteTribute);
app.get('/:deceased_id', actions.readTribute);

app.post('/createContact', actions.checkAuthAdmin, actions.createContact);
app.post('/updateContact', actions.checkAuthAdmin, actions.updateContact);
app.post('/deleteContact', actions.checkAuthAdmin, actions.deleteContact);
app.get('/:deceased_id', actions.readContact);



logger = (req, res, next) => {
    console.log(`Wrong route ${req.url} - ${req.method} --- ${new Date()}`);
    next();
};

wrongRoute = (req, res, next) => {
    var error = new Error("Not found. Please try with another route!");
    error.status = 404;
    next(error);
};

errorHandler = (err, req, res, next) => {
    var errorObj = {
        status: err.status,
        error: {
            message: err.message
        }
    };

    res.status(err.status).json(errorObj);
}; 

app.use(logger);
app.use(wrongRoute);
app.use(errorHandler);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API started on port ${port}!`);
});