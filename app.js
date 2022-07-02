require('dotenv').config();
require("express-async-errors");
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const notFoundMiddleware=require('./middleware/not-found');
const errorMiddleware=require('./middleware/error-handler');
const productsRouter=require('./routes/products');
//middleware
app.use(express.json());
//rootes
app.get("/",(req,res)=>{
    res.send(`<h1>Hello World</h1> <a href ="/api/v1/products"> products route</a>`);

});
//products router
app.use("/api/v1/products",productsRouter);



//async errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const connectDB=require('./db/connect');
const port=process.env.PORT || 3000;

const start= async()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        await  app.listen(port);
        console.log(`Server started on port ${port}`);
    }catch(err){
        console.log(err);
    }
}
start();