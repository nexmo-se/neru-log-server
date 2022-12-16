import { neru, Assets } from 'neru-alpha';
import express from 'express';
import fs from 'fs';
import axios from 'axios';
import os from 'os';

const app = express();
const port = process.env.NERU_APP_PORT || 5001;

let count = 0;

let interval = setInterval(() => {
  axios
    .get(`http://${process.env.INSTANCE_SERVICE_NAME}.neru/keep-alive`)
    .then((resp) => console.log(resp.data))
    .catch(console.log);
}, 1000);

app.get('/keep-alive', (req, res) => {
  count++;
  console.log(`keep alive ${count}`);
  if (count > 6000) {
    clearInterval(interval);
    console.log('interval cleared');
  }
  res.send(`OK ${count}`);
});

app.use(express.json());

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

app.get('/', async (req, res, next) => {
  res.send('hello world').status(200);
});

const currentDate = new Date().toDateString();
const filePath = os.tmpdir() + `/${currentDate}.log`;
console.log(filePath);

// https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/append?line=This is a new entry
app.get('/append', async (req, res, next) => {
  try {
    const session = neru.createSession();
    const assets = new Assets(session);

    let content = JSON.stringify(req.query);
    // WRITE THE REQUEST TO A LOGFILE
    const log = fs.createWriteStream(filePath, { flags: 'a' });
    log.write(`${content}\n`);
    log.end();

    await assets.uploadFiles([filePath], '/mutant').execute();

    res.send(filePath).status(200);
  } catch (err) {
    res.send(err.message).status(200);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
