import dotenv from 'dotenv';
import 'express-async-errors';
import EventEmitter from 'events';
import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io'; 
import connectDB from './config/connect.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
//  import { errorMiddleware } from "./middlewares/error.js";
import authMiddleware from './middleware/authentication.js';
// Routers
import authRouter from './routes/auth.js';
import rideRouter from './routes/ride.js';
import uploadRouter from './routes/upload.js';
// Import socket handler
import handleSocketConnection from './controllers/sockets.js';

dotenv.config();

EventEmitter.defaultMaxListeners = 20;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*', // Adjust this in production
//   }
// });

// Attach the WebSocket instance to the request object
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Initialize the WebSocket handling logic
// handleSocketConnection(io);
app.use('/upload', uploadRouter);
// Routes
app.use("/auth", authRouter);
app.use("/ride", authMiddleware, rideRouter);
// app.use("/ride", rideRouter);

// Middleware
// app.use(notFoundMiddleware);


app.use(errorHandlerMiddleware);
// app.use(errorMiddleware);

 

 
const io = new socketIo(server, {
  cors: {
    origin: '*', // Adjust this in production
  }
});

app.get('/', (req, res) => {
  res.send('Server is alive!');
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.emit('hello', 'Socket.IO is working!');

  socket.on('ping-test', (msg) => {
    console.log('Received ping:', msg);
    socket.emit('pong-test', 'pong');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
 
 
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(process.env.PORT || 3000, "0.0.0.0", () =>
      console.log(
        `HTTP server is running on port http://localhost:${process.env.PORT || 3000}`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();
