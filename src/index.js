import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { app } from './app.js';
import { config } from './config/appConfig.js';
import { connectDB } from './config/database.js';

const startServer = async () => {
  try {
    await connectDB();
    const port = config.port || 8080;
    app.listen(port, () => {
      console.log(`app is listening at port ${port}`);
    });
  } catch (error) {
    console.error(`${error} while connecting db with app`);
    process.exit(1);
  }
};

app.on('error', (err) => {
  console.error(`app on error in index.js at src: ${err}`);
});

startServer();
