const express = require('express');
const app = express();
const path = require('path');
const request = require('request');
const querystring = require('querystring');

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public'));
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/login', (req, res) => {
  const query = querystring.stringify({
    response_type: 'code',
    client_id: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELID,
    redirect_uri: 'https://nodejsreactshowtake.herokuapp.com/callback',
    state: 'hoge', // TODO: must generate random string
    scope: 'profile',
  });
  res.redirect(301, 'https://access.line.me/oauth2/v2.1/authorize?' + query);
});

app.get('/callback', (req, res) => {
  request.post({
    url: `https://api.line.me/oauth2/v2.1/token`,
    form: {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: 'https://nodejsreactshowtake.herokuapp.com/callback',
      client_id: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELID,
      client_secret: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELSECRET,
    }
  }, (error, response, body) => {
    if (response.statusCode != 200) {
      res.send(error);
      return;
    }
    request.get({
      url: 'https://api.line.me/v2/profile',
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(body).access_token
      }
    }, (error, response, body) => {
      if (response.statusCode != 200) {
        res.send(error);
        return;
      }
      res.send(body);
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
