const express=require('express');
const { createProxyMiddleware }=require('http-proxy-middleware');

const app=express();
const port=3005;

// Middleware to proxy requests to air-sky microservice

app.use('/airsky',createProxyMiddleware({
    target:'http://localhost:3001',
    changeOrigin:true,
}));

// Middleware to proxy requests to flights microservice

app.use('/flights',createProxyMiddleware({
    target:'http://localhost:3002',
    changeOrigin:true,
}));

// Middleware to proxy requests to passengers microservice

app.use('/passengers',createProxyMiddleware({
    target:'http://localhost:3003',
    changeOrigin:true,
}));

app.listen(port,()=>console.log(`Server running on port ${port}`));