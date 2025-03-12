import express from 'express'
import cors from 'cors'
import route from './routes/userRoutes';
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: [
    'https://aadhaar-ocr-theta.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
        ], 
 
  credentials: true, 
};
const PORT = process.env.PORT || 4000;

app.use(cors(corsOptions));
app.use(express.json());

app.use('/',route)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})
