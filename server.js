let nforce = require('nforce');
let faye = require('faye');
let express = require('express');
let cors = require('cors');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let meta = require('nforce-metadata')(nforce);

let getMixes = (req, res) => {
    res.json([]);
    return;
};

let PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/', express.static(__dirname + '/www'));
app.get('/mixes', getMixes);


let bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.attach(server);
bayeux.on('disconnect', function(clientId) {
    console.log('Server disconnect');
});

server.listen(PORT, () => console.log(`Express server listening on ${ PORT }`));

// Connect to Salesforce
let SF_CLIENT_ID = process.env.SF_CLIENT_ID;
let SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;
let SF_USER_NAME = process.env.SF_USER_NAME;
let SF_USER_PASSWORD = process.env.SF_USER_PASSWORD;
let REDIRECT_URL = process.env.REDIRECT_URL ? process.env.REDIRECT_URL : (process.env.HEROKU_APP_NAME + ".heroukapp.com");

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    environment: "production",
    redirectUri: REDIRECT_URL,
    mode: 'single',
    autoRefresh: true,
    plugins: ['meta']
});

org.authenticate({username: SF_USER_NAME, password: SF_USER_PASSWORD}, err => {
    if (err) {
        console.error("Salesforce authentication error");
        console.error(SF_CLIENT_ID);
        console.error(err);
    } else {
        console.log("Salesforce authentication successful");
        console.log(org.oauth.instance_url);
        getEventTypes();
        //subscribeToPlatformEvents();
    }
});

// Find all the event types by querying the metadata API looking for those
// custom objects that end in "__e"
let getEventTypes = () => {
  org.meta.listMetadata({
    queries: [
      { type: 'CustomObject' }
    ]
  }).then(function(meta) {
    for (i=0;i < meta.length;i++) {
      let co = meta[i];
      if (co && co.fullName && co.fullName.endsWith('_e')) {
        subscribeToPlatformEvents(co.fullName);
        console.log("Subscribing to " + co.fullName);
      }
    }
});
}

// Subscribe to Platform Events for a given eventName
let subscribeToPlatformEvents = (eventName) => {
    var client = new faye.Client(org.oauth.instance_url + '/cometd/40.0/');
    client.setHeader('Authorization', 'OAuth ' + org.oauth.access_token);
    client.subscribe('/event/' + eventName, function(message) {
        // Send message to all connected Socket.io clients
        io.of('/').emit('eventReceived', {
            eventName: eventName,
            eventPayload: message
        });
    });

};
