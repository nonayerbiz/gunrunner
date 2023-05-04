let Gun = require('gun');
require('gun/lib/open.js')
// require('gun/sea');

const gun = Gun({
  peers:['https://gun.runner.towr.cc/gun'],
  localStorage: false
});


gun.get('bc_sub').get('value').put('TEST_VAL')

// gun.get('test1').open((data) => {
//   console.log('SUBSCRIPTION TEST1')
//   console.log(data)
// })

// gun.get('test1').get('test2').on(function(data){
//   console.log('SUBSCRIPTION TEST1/TEST2')
//   console.log(data)
// })

// LISTEN ON -- OUT -- EVENT HAPPENING 
gun.on('out', function(event){
  console.log('------  CATCH OUT EVENT  ------')
  this.to.next(event)   // MAGIC LINE
  if(event['get']){
    if(event['get']['#'] && event['get']['.']){
      if(event['get']['#'].startsWith('~@') && event['get']['.'].startsWith('~')){
        console.log('SUSPECT USER CREATION')
        console.log(event['get'])

        let user_pub = event['get']['.']
        let user_name = event['get']['#']
        gun.get('bc_sub').get('value').put(`catch ${user_name} creation`)

        console.log('SUBSCRIPTION TO ', user_name)
        gun.get(user_pub).open((data) => {
          console.log('user space being modifed')
          console.log(data)
          let res = `user_name -- ${data}`
          gun.get('bc_sub').get('value').put(res)
        })
      }
    }
  }
})


// // LISTEN ON -- GET -- EVENT HAPPENING 
// gun.on('get', (event) => {
//   console.log('------  CATCH GET EVENT  ------')
//   // if(event['get']['#'].startsWith('~') && !event['get']['#'].startsWith('~@')){
//   //  let user_pub = event['get']['#'].substring(1)
//   //  console.log(' +++++ GET USER NODE +++++ ')
//   //  console.log(user_pub)
//   // }
// })

// LISTEN ON -- PUT -- EVENT HAPPENING 
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
  console.log(' ------- CATCH PUT EVENT   ------- ')
  console.log(event)
})

// // LISTEN ON -- AUTH -- EVENT HAPPENING 
gun.on('auth', function(event) {
  this.to.next(event)
  console.log('------  CATCH AUTH EVENT  ------')
  // console.log(event)
})
