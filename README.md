# neru-log-server

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
