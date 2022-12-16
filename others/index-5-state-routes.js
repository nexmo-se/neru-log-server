import { neru, Assets, State } from 'neru-alpha';
import express from 'express';
import fs from 'fs';
import axios from 'axios';
import os from 'os';

const app = express();
const port = process.env.NERU_APP_PORT || 5001;
app.use(express.json());

const session = neru.createSession();
const assets = new Assets(session);
const state = new State(session);

const currentDate = new Date().toDateString();
console.log('ℹ️ currentDate:', currentDate);
const filePath = os.tmpdir() + `/${currentDate}.log`;

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

app.get('/', async (req, res, next) => {
  res.send('hello world').status(200);
});

if (process.env.DEBUG == 'true') {
  console.log('🚀 Debug');
} else {
  console.log('🚀 Deploy');
  // PREVENTS THE ASSETS LOGS TO BE OVER WRITTEN
  // KEEP NERU INSTANCE ALIVE ****************************************** START
  let count = 0;
  let interval = setInterval(() => {
    axios
      .get(`http://${process.env.INSTANCE_SERVICE_NAME}.neru/keep-alive`)
      .then((resp) => {
        if (count % 1000) {
          console.log('keep-alive:', resp.data);
        }
      })
      .catch((err) => console.log('interval error: ', err));
  }, 1000);

  // KEEPS NERU ALIVE FOR 6000 SECONDS (110 MINUTES).
  app.get('/keep-alive', (req, res) => {
    count++;
    // console.log(`keep alive ${count}`);
    if (count > 6600) {
      clearInterval(interval);
      console.log('interval cleared');
    }
    res.send(`OK ${count}`);
  });
  // KEEP NERU INSTANCE ALIVE ***************************************** END
}

// START TESTING: WHEN HIT THE STATE PROVIDER IS SET TO TRUE ON ALL INSTANCES
app.get('/test-start', async (req, res) => {
  let setTesting;
  let isTesting;
  try {
    setTesting = await state.set('testing', { testing: true });
    console.log('setTesting:', setTesting);
    isTesting = await state.get('testing');
    console.log('ℹ️ /test-start: testing:', isTesting);
  } catch (error) {
    console.log('❌ /test-start error:', error);
  }
  res.status(200).send(isTesting);
});

// STOP TESTING: WHEN HIT THE STATE PROVIDER IS SET TO FALSE ON ALL INSTANCES
app.get('/test-stop', async (req, res) => {
  let setTesting;
  let isTesting;
  try {
    setTesting = await state.set('testing', { testing: false });
    console.log('setTesting:', setTesting);
    isTesting = await state.get('testing');
    console.log('ℹ️ /test-start: testing:', isTesting);
  } catch (error) {
    console.log('❌ /test-start error:', error);
  }
  res.status(200).send(isTesting);
});

// GET TESTING STATE: GET STATE OF TEST; EITHER TRUE OR FALSE
app.get('/test-state', async (req, res) => {
  let isTesting;
  try {
    isTesting = await state.get('testing');
    console.log('ℹ️ /test-state: testing:', isTesting);
    res.send(isTesting);
  } catch (error) {
    console.log('❌ /test-state error:', error);
    res.send(isTesting);
  }
});

// https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/append?line=This is a new entry
app.get('/append', async (req, res, next) => {
  try {
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
