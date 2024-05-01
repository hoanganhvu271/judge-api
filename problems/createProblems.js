var request = require('request');

// define access parameters
var accessToken = '9b348449f67afb2fa93a5e53e417b609';
var endpoint = 'ec2e5307.problems.sphere-engine.com';

// define request parameters
var problemData = {
    name: 'Cộng hai số',
    masterjudgeId: 1001
};

// send request
request({
    url: 'https://' + endpoint + '/api/v4/problems?access_token=' + accessToken,
    method: 'POST',
    form: problemData
}, function (error, response, body) {

    if (error) {
        console.log('Connection problem');
    }

    // process response
    if (response) {
        if (response.statusCode === 201) {
            console.log(JSON.parse(response.body)); // problem data in JSON
        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 400) {
                var body = JSON.parse(response.body);
                console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
            }
        }
    }
});