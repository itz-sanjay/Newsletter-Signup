const express = require('express', '4.17.2');
const bodyParser = require('body-parser', '1.19.1');
const https = require('https');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const emailAddress = req.body.emailAddress;
    
    var data = {
        members: [
            {
                email_address: emailAddress,
                status: 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = 'https://us20.api.mailchimp.com/3.0/lists/193094272b';
    const options = {
        method: 'post',
        auth: 'sanjay:090440164c68e609f0796432b22a457f-us20'
    };

    const request = https.request(url, options, function(response){
        response.on('data', function(data){
            console.log(JSON.parse(data));

            if(response.statusCode === 200){  
                res.sendFile(__dirname + '/success.html');
            }
            else{
                res.sendFile(__dirname + '/failure.html');
            }

        });
    });
    
    request.write(jsonData);
    request.end();
});

app.post('/failure', function(req, res){
    res.redirect('/');
});

//In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.

//So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.

app.listen(process.env.PORT || port, function(req, res){
    console.log('Server started running at ' + process.env.PORT);
});


//API KEY
//090440164c68e609f0796432b22a457f-us20

//LIST ID
//193094272b