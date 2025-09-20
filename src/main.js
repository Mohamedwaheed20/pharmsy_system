import express from "express";
import { config } from 'dotenv';
config();
import cors from 'cors';
import helmet from 'helmet';
import connectToDB from './db/connection.js';
import routerHandler from './utilits/controller-handller.js';

async function bootstrap() {
  // ✅ اتصال بقاعدة البيانات
  connectToDB();

  // ✅ السماح فقط للدومين المحدد
  const whitelist = [process.env.front_end_url];
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };

  const app = express();

  // ✅ Parse JSON
  app.use(express.json());

  // ✅ CORS
  app.use(cors(corsOptions));

  // ✅ Helmet (أمان الـ headers)
  app.use(helmet());

  // ✅ Routes
  routerHandler(app);

  // ✅ Default Route
  app.get('/', (req, res) => {
    res.status(200).json({ message: "server is running" });
  });

  // ✅ Start Server
  const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
}

export default bootstrap;
