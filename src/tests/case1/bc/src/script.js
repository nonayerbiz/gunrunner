const Gun = require('gun'); // in NodeJS
// require('gun/lib/load.js');
// require('gun/lib/not.js');
require('gun/lib/open.js');
const SEA = require('gun/sea');
// require('gun/lib/radix');
// require('gun/lib/radisk');
// require('gun/lib/store');
// require('gun/lib/rindexed');
require('gun/lib/then.js');
const gun = Gun({
  // peers:['https://gun.runner.towr.cc:8765/gun'],  // express
  peers:['https://gun.runner.towr.cc/gun'],  // traefik
  localStorage: false
});
let USER = gun.user()
console.log(gun)

// // GUN HEARTBEAT
// setInterval(() => {
//   let epoch = new Date().getTime()
//   console.log('gun heartbeat', epoch)
//   gun.opt({peers:['https://gun.runner.towr.cc/gun']});
//   gun.get('heartbeat').get('time').put(epoch)
// }, 5000);

gun.on('in', function(event){
  this.to.next(event)
})

gun.on('out', function(event){
  this.to.next(event)
})

gun.on('put', function(event){
  this.to.next(event)
})

// node_user: 
let nu_pub = "Rm5ikamzozxx8xhQk9TjKzJJnp-jdTy0LQau_ASk18s.9H0BaMZgT-iNnn5-Gg6eoCN4NFL5m_J8zOuMx_9LBfI"
let nu_epub = "s7XebPTuBeOEMruKg_DQBZ9HU6UISKYMUgVihpjZXA0.y7OXDkdyljOZwDhkBNfcsXBmuFOsuDnD2odyjJJOl6Q"
let nu_pair = {
  epriv: "CkSwiYxSGEucqMvLT1OiBgTdwADkFC7PbJ4ZwTBIshA",
  epub: "s7XebPTuBeOEMruKg_DQBZ9HU6UISKYMUgVihpjZXA0.y7OXDkdyljOZwDhkBNfcsXBmuFOsuDnD2odyjJJOl6Q",
  priv: "saqbz8V9Hmkcyar8wuAgruFJgHkMbvyD1nkbS9D6HOI",
  pub: "Rm5ikamzozxx8xhQk9TjKzJJnp-jdTy0LQau_ASk18s.9H0BaMZgT-iNnn5-Gg6eoCN4NFL5m_J8zOuMx_9LBfI"
}

// USER CREATION
document.getElementById('user-create-btn').onclick = () => {
  console.log('user create on click')
  let username = document.getElementById('usernode1').value
  let password = 'testing123456'
  USER.create(username, password, async(ack) => {
    console.log('ack', ack);
    if (ack.err) {
      alert(ack.err);
      return;
    } else {
      let user_pub = ack['pub']
      let user_epub = ack['epub']
      alert('USER CREATION SUCCESSFUL')
      let cert = await SEA.certify([user_pub], [{"*": "req", "+": "*"}], nu_pair, null)

      let create_req_obj = {
        pub: user_pub,
        epub: user_epub,
        hihi: 'hihi'
      }
      create_req_obj = JSON.stringify(create_req_obj)
      console.log(create_req_obj)
      gun.get(`~${nu_pub}`).get('req').get(user_pub).put(create_req_obj, null, {opt: {cert: cert}})
    }
  })
}

// USER AUTHENTICATION
document.getElementById('user-auth-btn').onclick = () => {
  console.log('user auth on click')
  let username = document.getElementById('usernode1').value
  let password = 'testing123456'
  USER.auth(username, password, async(ack) => {
    // console.log('ack', ack)
    if (ack.err) {
      alert(ack.err);
    } else {
      let user_pub = ack.sea.pub
      let user_epub = ack.sea.epub
      let user_pair = ack.sea
    }
  })
}

// LISTEN ON -- AUTH -- EVENT HAPPENING 
gun.on('auth', async function(event) {
  this.to.next(event)
  console.log('------  CATCH AUTH EVENT  ------')
  let user_pair = event.sea
  let user_pub = event.sea.pub
  let user_epub = event.sea.epub

  let a_req_cert = await gun.get(`~${nu_pub}`).get('a_req_c').get(user_pub).then()
  let epoch = new Date().getTime()
  let _val =  document.getElementById('usernode4').value

  // GENERATE AUTH REQUEST OBJECT 
  // SHOULD INCLUDE DOMAIN INTO THE AUTH REQ OBJ 
  let auth_req_obj = JSON.stringify({
    dt: epoch,
    value: _val
  })

  // PUT AUTH REQUEST OBJECT INTO UGRP SPACE WITH AUTH REQUEST CERT 
  gun.get(`~${nu_pub}`).get('a_req').get(user_pub).put(auth_req_obj, null, {opt: {cert: a_req_cert}})

  // verification
  let __val = await gun.get(`~${nu_pub}`).get('a_req').get(user_pub).then()
  console.log('REQUEST TO RELAY', __val)

    // LISTEN TO THE JWT TOKEN UPDATE BY NODE MINER
  gun.get(`~${nu_pub}`).get('session').get(user_pub).on(async(data, key) => {
    // this.to.next(data)
    console.log('subscription event on session node')
    console.log(data)
    if(typeof data == 'string'){
      data = JSON.parse(data)
    }

    if(data['dt'] == epoch){
      if(data['value'] != null){
        console.log('UPDATED TOKEN')
        console.log('NAGIVATION HAPPEN HERE ONCE GET THE SESSSSIONNNN')
      } else {
        console.log('++++++ NULL IN SESSION')
      }
    }
  })
})

// USER SIGN OUT
document.getElementById('user-leave-btn').onclick = () => {
  if(USER.is){
    let user_pub = USER.is.pub
    gun.get(`~${nu_pub}`).get('session').get(user_pub).off()
    USER.leave()
    console.log('USER SIGN OUT')
  }
}

// USER PUT 
document.getElementById('user-put-btn').onclick = () => {
  let data = document.getElementById('usernode3').value
  if(USER.is){
    console.log(USER.is)
    console.log('put value -- ', data)
    let pub = USER.is.pub
    gun.get(`~${pub}`).get('test1').put(data)
  }
}

// USER GET TOKEN BUTTON 
document.getElementById('user-get-token-btn').onclick = async () => {
  console.log('user get token on click')
  if(USER.is){
    let user_pub = USER.is.pub
    let jwt = await gun.get(`~${nu_pub}`).get('session').get(user_pub).then()
    console.log(jwt)
  }
}
