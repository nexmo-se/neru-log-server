# neru-log-server

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
