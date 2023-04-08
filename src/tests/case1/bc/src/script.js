const Gun = require('gun'); // in NodeJS
// require('gun/lib/load.js');
// require('gun/lib/not.js');
require('gun/lib/open.js');
require('gun/sea');
// require('gun/lib/radix');
// require('gun/lib/radisk');
// require('gun/lib/store');
// require('gun/lib/rindexed');
require('gun/lib/then.js');
const gun = Gun({
  peers:['https://gun.runner.towr.cc/gun'],
  localStorage: false
});
let USER = gun.user()
console.log(gun)

// PUBLIC NODE GET 
document.getElementById('get-btn').onclick = async() => {
  console.log('get btn on click')
  let node1 = document.getElementById('node1').value
  let node2 = document.getElementById('node2').value
  let res = await gun.get(node1).get(node2).then()
  document.getElementById('pub-res').innerText = `Action: gun.get(${node1}).get(${node2}).then() = ` + res
  console.log(gun)
}


// PUBLIC NODE PUT 
document.getElementById('put-btn').onclick = () => {
  console.log('put btn on click')
  let node1 = document.getElementById('node1').value
  let node2 = document.getElementById('node2').value
  let node_val = document.getElementById('node_val').value
  let res = `Action: gun.get('${node1}').get('${node2}').put(${node_val})`
  document.getElementById('pub-res').innerText = res
  gun.get(node1).get(node2).put(node_val)
  console.log(res)
}


// USER CREATION
document.getElementById('user-create-btn').onclick = () => {
  console.log('user create on click')
  let username = document.getElementById('usernode1').value
  let password = 'testing123'
  USER.create(username, password, async(ack) => {
    console.log('ack', ack);
    if (ack.err) {gun.get('bc_sub').get('value')
      alert(ack.err);
      return;
    } else {
      alert('USER CREATION SUCCESSFUL')
    }
  })
}


// USER AUTHENTICATION
document.getElementById('user-auth-btn').onclick = () => {
  console.log('user auth on click')
  let username = document.getElementById('usernode1').value
  let password = 'testing123'
  USER.auth(username, password, async(ack) => {
    console.log('ack', ack)
    if (ack.err) {
      alert(ack.err);
    } else {
      alert('USER AUTHENTICATION SUCCESSFUL')
    }
  })
}

// USER SIGN OUT
document.getElementById('user-leave-btn').onclick = () => {
  USER.leave()
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


gun.get('bc_sub').get('value').on((data) => {
  console.log('update from nc!!!')
  document.getElementById('subscription-res').innerHTML = `Subscription <b>gun.get('bc_sub').get('value')</b>: ${data}`
})





