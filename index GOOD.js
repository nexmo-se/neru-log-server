import dotenv from 'dotenv';
import { Scheduler, neru } from 'neru-alpha';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
const PORT = process.env.NERU_APP_PORT || 5001;

if (process.env.DEBUG == 'true') {
  console.log('🚀 Debug');
  // console.log('ℹ️ os.tmpdir():', os.tmpdir()); // /var/folders/ns/6xy875952b38drjtlv3hh0yh0000gp/T // DEBUG
} else {
  console.log('🚀 Deploy');
  // console.log('ℹ️ os.tmpdir():', os.tmpdir());
  // console.log('__dirname', __dirname); // crashes DEPLOY
  console.log('process.cwd()', process.cwd()); // /home/app/code
}

var URL =
  process.env.ENDPOINT_URL_SCHEME + '/' + process.env.INSTANCE_SERVICE_NAME;
console.log('ℹ️ URL:', URL);

let todayDate = new Date().toDateString();

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

let cwd = process.cwd();
let file;

// check if file exists
app.get('/', (req, res) => {
  // check if file exists
  file = cwd + '/Mon Dec 12 2022.txt';
  let fileExists;
  if (fs.existsSync(file)) {
    fileExists = true;
    console.log('exists:', file);
  } else {
    fileExists = false;
    console.log('DOES NOT exist:', file);
  }

  console.log('cwd:', cwd);
  res.status(200).send({ cwd: cwd, fileExists: fileExists }); // {"cwd":"/home/app/code","fileExists":true}
});

// APPEND TO TODAY'S LOG FILE. WILL SAVE AS E.G. Mon Dec 12 2022.txt
// https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/append
app.get('/append', (req, res) => {
  let logFile;
  (async () => {
    try {
      logFile = cwd + `/${todayDate}.txt`;
      // WRITE THE REQUEST TO A LOGFILE
      // console.log('trying to write to file:', req.query);
      const content = JSON.stringify(req.query);

      await fs.appendFile(logFile, content, (err) => {
        if (err) {
          console.log('Error adding content:', err);
          // res.status(400).send({ 'Error adding content': err });
        } else {
          console.log('Added new content');
          // res.status(200).send('Added new content');
        }
      });
      // ADD A NEW LINE
      await fs.appendFile(logFile, '\n', (err) => {
        if (err) {
          console.log('Error adding new line:', err);
          res
            .status(400)
            .send({ 'Error adding new line:': err, logFile: logFile });
        } else {
          console.log('New line added');
          res.status(200).send({ success: 'New line added', logFile: logFile });
        }
      });
    } catch (err) {
      console.log('Error writing to file:', err);
      res.status(400).send({ 'Error writing to file:': err, logFile: logFile });
    }
  })();
});

// VIEW LOG FILE BY DATE
// https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/viewlog?date=Mon Dec 12 2022
app.get('/viewlog', (req, res, next) => {
  let { date } = req.query;
  console.log('/viewlog:', date);

  var options = {
    root: cwd,
  };

  var fileName = date + '.txt';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

// SEND BACK LOG FILE BY DATE
// https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/download?date=Mon Dec 12 2022
app.get('/download', (req, res) => {
  let { date } = req.query;
  console.log('/download:', date);

  let file = `${cwd}/${date}.txt`;
  res.download(file);
});

app.listen(PORT, () => {
  console.log(`NERU on port ${PORT}`);
});
