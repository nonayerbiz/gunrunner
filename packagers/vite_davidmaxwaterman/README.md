1. start relay peer

on two computers:

2. set the relay peer URL in the VITE_GUN_RELAY_URL env.

3. npm run dev

4. open browser on the url in the stdout
   notice the initial values put into gun

6. click the button to put 3 changes to gun.
   the data received by the local on() shows 3 updates, one for each change
   the data received by the remote on() only shows 1 update - the first one of the 3.
