const Bundler = require('parcel-bundler');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const cors = require('cors');
const app = express();

let corsOptions = {
   origin : ['https://gundb.eyfl.io/gun'],
}

app.use(cors(corsOptions));
app.use(createProxyMiddleware('/api', {
  target: 'http://localhost:3000'
}));

const bundler = new Bundler('src/index.html');
app.use(bundler.middleware());
app.listen(Number(process.env.PORT || 1234));

