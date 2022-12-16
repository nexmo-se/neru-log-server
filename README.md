# neru-log-server

## Run demo

1. Check if Instance is running

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/

2. Get the State of the Test - shoud be empty

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/test-state

3. Set the Testing state to true

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/test-start

4. Get the State of the Test - should be true

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/test-state

5. Send Requests

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/append?line=This%20is%20a%20new%20entry

6. Set the Testing state to false

   https://api-us.vonage.com/v1/neru/i/neru-4f2ff535-neru-assets/test-stop

7. List all Assets

   ```js
   neru assets ls
   ```

8. List all Logs in directory mutant

   ```js
   neru assets ls -r /mutant
   ```

9. Download Logs

   ```js
   neru assets get mutant/"baa220b23fe8 Fri Dec 16 2022.log" .
   ```

10. Remove Assets

    ```js
    neru assets remove mutant/"baa220b23fe8 Fri Dec 16 2022.log"
    ```

## Notes

[VCR Assets Docs](https://vonage-neru.herokuapp.com/neru/providers/assets)

Without keep-alive route

> Without the `keep-alive` route, the VCR Instance goes to sleep, and any new requests
> will overwrite the existing Assets log.

With keep-alive route

> The `keep-alive` route allows the Assets log to stay persistant.

> What happens when the instance is scaled?

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
