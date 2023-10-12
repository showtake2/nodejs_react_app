const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios'); // 'axios' モジュールをインポート

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
app.get('/api', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.get('/login', (req, res) => {
  // ここで 'axios' を使用したHTTPリクエストを行う
  // 以前の 'request' モジュールのコードを 'axios' に変更
  axios
    .post('https://api.line.me/oauth2/v2.1/token', {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'https://showtake3-7d4f5d47d49f.herokuapp.com/callback',
      client_id: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELID,
      client_secret: process.env.LINECORP_PLATFORM_CHANNEL_CHANNELSECRET,
    })
    .then((response) => {
      if (response.status !== 200) {
        res.send(response.data);
      } else {
        // 以前の 'request' モジュールのコードを 'axios' に変更
        axios
          .get('https://api.line.me/v2/profile', {
            headers: {
              Authorization: 'Bearer ' + response.data.access_token,
            },
          })
          .then((profileResponse) => {
            if (profileResponse.status !== 200) {
              res.send(profileResponse.data);
            } else {
              res.send(profileResponse.data);
            }
          })
          .catch((error) => {
            res.send(error);
          });
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
