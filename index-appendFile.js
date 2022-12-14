import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import morgan from 'morgan';
import fs from 'fs';
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
} else {
  console.log('🚀 Deploy');
}

app.get('/_/health', async (req, res) => {
  res.sendStatus(200);
});

let count = 0;
let interval = setInterval(() => {
  axios
    .get(`http://${process.env.INSTANCE_SERVICE_NAME}.neru/keep-alive`)
    .then((resp) => console.log(resp.data))
    .catch(console.log);
}, 1000);

// KEEPS NERU ALIVE FOR 6000 SECONDS (100 MINUTES).
app.get('/keep-alive', (req, res) => {
  count++;
  console.log(`keep alive ${count}`);
  if (count > 6000) {
    clearInterval(interval);
    console.log('interval cleared');
  }
  res.send(`OK ${count}`);
});

let cwd = process.cwd(); // NERU'S CURRENT WORKING DIRECTORY. __dirname crashes NERU
let currentDate;

// CHECK IF THERE IS A LOG FILE FOR TODAY
app.get('/', (req, res) => {
  currentDate = new Date().toDateString();
  let logFile = `${cwd}/${currentDate}.txt`;
  let fileExists;
  if (fs.existsSync(logFile)) {
    fileExists = true;
    console.log('exists:', logFile);
  } else {
    fileExists = false;
    console.log('DOES NOT exist:', logFile);
  }

  res.status(200).send({ logFile: logFile, logFileExists: fileExists });
});

let logCounter;
// APPEND TO TODAY'S LOG FILE. WILL SAVE AS E.G. Mon Dec 12 2022.txt
// https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/append?line=just an entry <<<< TEST THIS
app.get('/append', (req, res) => {
  logCounter++;
  console.log('/append:', { 'req.query': req.query, logCounter: logCounter });
  let logFile;
  (async () => {
    try {
      if (logCounter % 1000) {
        currentDate = new Date().toDateString();
        logFile = `${cwd}/${currentDate}.txt`;
        const content = JSON.stringify(req.query);
        // WRITE THE REQUEST TO A LOGFILE
        await fs.appendFile(logFile, content, (err) => {
          if (err) {
            console.log('Error adding content:', err);
            res.status(400).send({ 'Error adding content': err });
          } else {
            console.log('Added new content');
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
            res
              .status(200)
              .send({ success: 'New line added', logFile: logFile });
          }
        });
      } // END IF 0
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

  var logFileName = date + '.txt';
  res.sendFile(logFileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', logFileName);
    }
  });
});

// SEND BACK LOG FILE BY DATE
// https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/download?date=Mon Dec 12 2022
app.get('/download', (req, res) => {
  let { date } = req.query;
  console.log('/download:', date);

  let logFile = `${cwd}/${date}.txt`;
  res.download(logFile);
});

app.listen(PORT, () => {
  console.log(`NERU on port ${PORT}`);
});
