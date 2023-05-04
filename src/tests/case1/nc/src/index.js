let Gun = require('gun');
require('gun/lib/open.js')
require('gun/lib/load.js')
require('gun/lib/then.js')
const SEA = require('gun/sea');

const gun = Gun({
  // peers:['https://gun.runner.towr.cc:8765/gun'],  // express
  peers:['https://gun.runner.towr.cc/gun'],  // traefik
  localStorage: false
});
let USER = gun.user()

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
  // console.log('------  CATCH OUT EVENT  ------')
  this.to.next(event)   // MAGIC LINE
  // if(event['get']){
  //   if(event['get']['#'] && event['get']['.']){
  //     if(event['get']['#'].startsWith('~@') && event['get']['.'].startsWith('~')){
  //       console.log('SUSPECT USER CREATION')
  //       console.log(event['get'])

  //       let user_pub = event['get']['.']
  //       let user_name = event['get']['#']
  //       gun.get('bc_sub').get('value').put(`catch ${user_name} creation`)

  //       console.log('SUBSCRIPTION TO ', user_name)
  //       gun.get(user_pub).open((data) => {
  //         console.log('user space being modifed')
  //         console.log(data)
  //         let res = `user_name -- ${data}`
  //         gun.get('bc_sub').get('value').put(res)
  //       })
  //     }
  //   }
  // }
})

gun.on('put', function(event){
  // var foo = this
  // setTimeout(()=> {
  //   // CAN MAKE IT CONDITIONAL
  //   let jwttoken = true
  //   if(jwttoken){
  //     foo.to.next(event)  
  //   }
  // }, 2000)
  this.to.next(event)
})

// NODE_USER
let nu_alias = "node_user"
let nu_pw = "testing123456"
let nu_pub = "Rm5ikamzozxx8xhQk9TjKzJJnp-jdTy0LQau_ASk18s.9H0BaMZgT-iNnn5-Gg6eoCN4NFL5m_J8zOuMx_9LBfI"
let nu_epub = "s7XebPTuBeOEMruKg_DQBZ9HU6UISKYMUgVihpjZXA0.y7OXDkdyljOZwDhkBNfcsXBmuFOsuDnD2odyjJJOl6Q"
let nu_pair = {
  epriv: "CkSwiYxSGEucqMvLT1OiBgTdwADkFC7PbJ4ZwTBIshA",
  epub: "s7XebPTuBeOEMruKg_DQBZ9HU6UISKYMUgVihpjZXA0.y7OXDkdyljOZwDhkBNfcsXBmuFOsuDnD2odyjJJOl6Q",
  priv: "saqbz8V9Hmkcyar8wuAgruFJgHkMbvyD1nkbS9D6HOI",
  pub: "Rm5ikamzozxx8xhQk9TjKzJJnp-jdTy0LQau_ASk18s.9H0BaMZgT-iNnn5-Gg6eoCN4NFL5m_J8zOuMx_9LBfI"
}

// USER CREATION SUBSCRIPTION
gun.get(`~${nu_pub}`).get('req').open(async(data, key) => {
  console.log(' -- user create req event --')
  // delete data._
  for(let user_pub in data) {
    console.log(user_pub, '-----', data[user_pub])
    if(data[user_pub] != null){
      if(typeof data[user_pub] == 'string'){
        data[user_pub] = JSON.parse(data[user_pub])

        gun.user().auth(nu_alias, nu_pw, async(ack) => {
          if(ack.err){
            console.log('user signup procedure ack error')
            console.log(ack.err)
          } else {
            console.log('user signup procedure')

            let nu_pair = ack.sea
            // AUTH REQUEST CERT 
            let a_req_c = await SEA.certify([user_pub], [{"*": "a_req", "+": "*"}], nu_pair, null)
            gun.get(`~${nu_pub}`).get('a_req_c').get(user_pub).put(a_req_c)

            gun.get(`~${nu_pub}`).get('req').get(user_pub).put(null)
          }
        })
      }
    }
  }
})

// USER AUTHENTICATION SUBSCRIPTION
gun.get(`~${nu_pub}`).get('a_req').open((data, key) => {
  console.log(' -- CATCH auth req event -- ')
  for(let user_pub in data){
    console.log(data[user_pub])
    // BREAK CHECK IF IT'S NULL
    if(data[user_pub] != null){
      let auth_req_obj = JSON.parse(data[user_pub])
      gun.user().auth(nu_alias, nu_pw, async(ack) => {
        // console.log('auth miner sign in', ack)
        if(ack.err){
          console.log(ack.err)
        } else {
          let nu_pair = ack.sea
          let res = JSON.stringify({
            dt: auth_req_obj['dt'],
            value: `${auth_req_obj['value']} -- NODE CLIENT`
          })

          console.log('RESULT ----- ',res)
          gun.get(`~${nu_pub}`).get('session').get(user_pub).put(res) 

          // NULL OUT THE AUTH REQUEST OBJECT
          setTimeout(async()=> {
            console.log('3 seconds null out a_req')
            await gun.get(`~${nu_pub}`).get('a_req').get(user_pub).put(null)
          }, 3000)

          // CHECK SESSION OBJECT OBJECT
          setTimeout(async()=> {
            console.log('4 seconds session value check')
            let _val = await gun.get(`~${nu_pub}`).get('session').get(user_pub).then()
            console.log(_val)
          }, 4000)

          // NULL OUT SESSION
          setTimeout(async()=> {
            let res = JSON.stringify({
              dt: auth_req_obj['dt'],
              value: null
            })
            console.log('5 seconds null out session')
            await gun.get(`~${nu_pub}`).get('session').get(user_pub).put(res)
          }, 5000)
        }
      })
    }
  }
})

