# neru-log-server

UPDATE: Using NeRu Assets

## Run demo

1. Send Requests

```js
// See the list of log files in Assets
neru assets ls -r /mutant

// Download the log file
neru assets get mutant/"Thu Dec 15 2022".log .
// the file 'Thu Dec 15 2022.log' already exists. Do you want to replace it? (y or n) y
// Thu Dec 15 2022.log (1.2 kB)

// Remove the log files
neru assets remove mutant/"Thu Dec 15 2022".log
// Please confirm the deletion of the following files:
   // mutant/Thu Dec 15 2022.log
// Do you really want to delete 1 file(s)? (y or n) y
//  ✅ files have been deleted.
```

## NeRu Assets commands

```js
neru assets ls -r /mutant
// 2022-12-15 23:13:26       43 B  mutant/Thu Dec 15 2022 23:13:25 GMT+0000 (Coordinated Universal Time).log
// 2022-12-15 23:19:01       32 B  mutant/Thu Dec 15 2022.log

neru assets remove mutant/"Thu Dec 15 2022".log
// Please confirm the deletion of the following files:
   // mutant/Thu Dec 15 2022.log
// Do you really want to delete 1 file(s)? (y or n) y
//  ✅ files have been deleted.

neru assets ls
// neru assets get mutant/"Thu Dec 15 2022".log .

neru assets --help
// Handles assets operations

Usage:
  neru assets [flags]
  neru assets [command]

Aliases:
  assets, a, asset

Available Commands:
  copy        Copy files from local machine to assets directory
  get         Get remote asset
  list        List remote assets
  remove      Remove remote assets.

Flags:
  -h, --help   help for assets

Global Flags:
      --api-key string      Nexmo API Key
      --api-secret string   Nexmo API Secret
      --config string       Config file (default is $HOME/.neru-cli)
  -f, --filename string     File contains the Neru manifest to apply
      --region string       Neru platform region
```

Log files are deleted from NeRu as soon as it NeRu goes to sleep or when the `keep-alive` interval has ended.
A solution would be to write to mongodb, maybe `mongo-morgan`.

UPDATED: Sending 1000 requests per second with a total of XX,000 requests using Locust was causing a log to not
be written correctly. Solution was to `fs.createWriteStream` and to only write to log after avery 1000 requests.

```js
// example
if (requestLog % 1000) fs.createWriteStream...
```

> Need to test without the the modulus condition.

ALSO: a `keep-alive` interval was needed to keep logs persistant. This is because, when the
NeRu server went to sleep. The log file is trashed.

The log file is named using the date in format `Mon Dec 12 2022`.

## Run the demo

See if Log file exists via GET:

1. Check if there is a log file for today. In browser visit: `https://NERU_URL/`
   e.g. `https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/`

```js
// Server will respond with
{"logFile":"/home/app/code/Mon Dec 12 2022.txt","logFileExists":true}
```

Append content to today's log file via GET /append route:

1. Append a line to the log file. In browser visit: `https://NERU_URL/append?data=new content here.

   e.g. `https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/append?data=new content here`
   We are appending the content `new content here` to the log file.

View the logfile in browser by date via GET /viewlog route:

1. In browser visit: `https://NERU_URL/viewlog?date=TODAYS_DATE`

   e.g. `https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/viewlog?date=Mon Dec 12 2022`

Download the entire log file via GET /downlaod route:

1. In browser visit: `https://NERU_URL/download?date=TODAYS_DATE`

   e.g. `https://neru-4f2ff535-neru-assets.use1.serverless.vonage.com/download?date=Mon Dec 12 2022`
