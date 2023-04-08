# GunRunner

## Getting started

Originally to deploy gun.eco graphs. Reincarnated to test and debug sync issues across multiple gun clients using pinned versions of gun and node. docker-compose will vacuum in your configuration of test cases, build a browser dist, corresponding images and then run the containers for local testing of remote graphs.

- Add test cases to the tests directory in src
- Pin browser and node version in the **bc** and **nc** directory in test cases.
- Specify which case you intent to run in the .env file

[On deck is Case1](https://matrix.to/#/!apmkrFyPwFRRvQgtEw:gitter.im/$irYr8sWKLRg0EHgnq4KJuSjCcsIUDK8d706zkfoxVIw?via=gitter.im&via=matrix.org&via=matrix.thisisjoes.site)

> #### Mark Nadel
> 
> I am noticing several hosts being very tempermental about sync. BLEH if I run a test on localhost, no sync issues, but if I run a test on the host... suddenly sync issues often pop up. So this has me pretty worried & annoyed now. Didn't happen on Heroku, and doesn't happen on some of my other machines - so I'm pulling hair out if it has to do with WebSocket sticky sessions with the host? OR maybe the host has clock drift and GUN is delaying sync (I've seen this several times), OR a bug in AXE, or... its really rather annoying. Be super nice if somebody good with SSH could help brute force testing a bunch of these things for me on my various hosts now. Cause once we have a stable non-Heroku alternatives working, we should be able to get a ton of volunteer relays running again.

## Three important folders

##### GunRelay "gr"

- This is to demonstrate the code that is running the relay. 
- Our docker-compose ignores it since the relay is presumably running on a domain with SSL/WSS
- Currently has **disable gun public space usage** with **secure: true** flag in gun initialization

```javascript
// gr-code
var express = require('express');
var app = express();
let Gun = require('gun');
var path = require('path')
app.set("views", path.join(__dirname))
app.set("view engine", "ejs")
require("dotenv").config();

const port = process.env.PORT || 8765;
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`App listening at ${port}`);
});

var gun = Gun({ 
  peers:[`https://${process.env.relay_peer}/`], 
  musticast: false,
  localStorage: false,
  file: false,
  web:server,
  s3: {
    key: process.env.aws_access_key_id,
    secret: process.env.aws_secret_access_key,
    bucket: process.env.s3_bucket,
    region: 'ap-southeast-1',
    prefix: 'gun/'
  },
  secure: true
})

gun.on('out', {
  'put': true,
  'get': {
    '#': {
       '*': ''
    }
  }
})
```

##### BrowserClient "bc"
- Wherein you pin a version of gun in the package.json. 
- Assuming you're using DockerDesktop on macOS a corresponsing web artifact should be served out to your browser on static.localhost. 

##### NodeClient "nc"
- Wherein you pin a version of gun in the package.json
- Runs your "node client" in a node container defined in this [Dockerfile](./docker/build/nc/Dockerfile)

## Test Case 
##### Case 1 - BAD
> Testing Behavior: Whether node client able to catch browser client user creation & put event
>
> **Node Client** - catch user creation & made subscription: gun.get('~user_pub').get('test1').on() && gun.get('~user_pub').open()
>
> **Browser Client** - Create user && gun.get('~user_pub').get('test1').put('test_val')
>
> Expected: Browser Client create user & Node Client should catch the user creation event (current alternative is out event signal)
>
> Expected: Browser Client put event will trigger the 'on' and 'open' subscription in Node Client

##### Case 2 - BAD
> Testing Behavior: Whether browser client able to catch node client event
>
> **Node Client** - gun.get('bc_sub').get('value').put(res)
>
> **Browser Client** - subscription: gun.get('bc_sub').get('value').on()
>
> Expected: Node Client put event will trigger the 'on' subscription in Browser Client

## Installation & Execution
1. cd ./src
2. Make sure .env file has **case=case1**
3. run cmd: **COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=0 DOCKER_DEFAULT_PLATFORM=linux/arm64/v8 docker-compose up --build**
4. Navigate to [browser](http://static.localhost)
5. Compare the **browser console** & **terminal** 

## Notes
- The server serving dist at [http://static.localhost](http://static.localhost) has **CORS ENABLE** for any graphs you specifed for all domains 
- This allowed you to specify any graphs
