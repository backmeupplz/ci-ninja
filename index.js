const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const Netmask = require('netmask').Netmask

app.set('port', 61440);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', (req, res) => {
  const authorizedIps = [
    '127.0.0.1',
    'localhost'
  ];
  const githubIps = [
    '207.97.227.253',
    '50.57.128.197',
    '204.232.175.75',
    '108.171.174.178'
  ];
  const payload = JSON.parse(req.body.payload);

  if (!payload) {
    console.log('No payload');
    res.writeHead(400);
    res.end();
    return;
  }

  const ipv4 = req.ip.replace('::ffff:', '')
  if (!(inAuthorizedSubnet(ipv4) || authorizedIps.indexOf(ipv4) >= 0 || githubIps.indexOf(ipv4) >= 0)) {
    console.log('Unauthorized IP:', req.ip, '(', ipv4, ')');
    res.writeHead(403);
    res.end();
    return;
  }

  if (payload.ref === 'master' ||
    payload.ref === 'refs/heads/master' ||
    payload.ref === 'refs/heads/develop') {
    console.log('Executing task!');
    myExec('./github.sh');
  }

  res.writeHead(200);
  res.end();
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('CI Ninja server listening on port ' + app.get('port'));
});

function myExec(line) {
  const exec = require('child_process').exec;
  const execCallback = (error) => {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  }
  exec(line, execCallback);
}

function inAuthorizedSubnet(ip) {
  const authorizedSubnet = [
    '204.232.175.64/27',
    '192.30.252.0/22'
  ].map(function (subnet) {
    return new Netmask(subnet)
  })
  return authorizedSubnet.some(function (subnet) {
    return subnet.contains(ip)
  })
}