import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hi, welcome to ChaiTeam');
});

app.listen(PORT, () => {
  console.log(`App is listning on PORT: ${PORT}`);
});
