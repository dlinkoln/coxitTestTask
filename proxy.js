const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

const API_PROXY_PATH = '/api';
const API_PROXY_TARGET = 'https://onair.radioapi.io';

app.use(API_PROXY_PATH, createProxyMiddleware({
    target: API_PROXY_TARGET,
    changeOrigin: true,
    pathRewrite: {
        [`^${API_PROXY_PATH}`]: '/thisisgo/go', // rewrite path
    },
}));

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});