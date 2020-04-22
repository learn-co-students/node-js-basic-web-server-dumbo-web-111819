import express, { response } from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'

const messages=[]
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

const app=express() //create backend app
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => {
    response.send('Hello, World!');
});

app.get('/messages',(request,response) => {
  let result=request.query
  let allMessages = JSON.stringify(messages);
  if(result.encrypt==='true'){
    // console.log(result.encrypt)
    return bcrypt.hash(allMessages, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.send(hashed);
    });
  }
  response.status(200).send(messages)
})

// app.get('/messages/:id/:encrypt',(request,response) => {
//   response.status(200).send(messages)
// })

app.get('/message/:id',(request,response) => {
  // console.log(result)
  let getId=parseInt(request.params.id)
  // console.log(getId)
  let foundMsg = messages.find(message => message.id === getId)
  // console.log(request.params)
  let result=request.query
  foundMsg = JSON.stringify(foundMsg);
  if(result.encrypt==='true'){
    // console.log(result.encrypt)
    return bcrypt.hash(foundMsg, 10, (error, hashed) => {
      if (error) {
        throw new Error();
      }
      response.send(hashed);
    });
  }
  // response.setHeader('Content-Type', 'text/plain; charset=utf-8');

  response.status(200).send(foundMsg)
})

app.post('/message', (request, response) => {
    // Save the message and send the message id back to the client.
    const { message }=request.body
    let newMsg = new Message(message);
    // console.log(newMsg)
    messages.push(newMsg)
    //send back a response
    response.status(200).send(messages)
});

app.listen(4000,() => {
    console.log('listening on port 4000')
}) //start server
