import dotenv from 'dotenv'

dotenv.config()

class Test {
  constructor(str){
    console.log('Hello Test class constructed. My secret:' + str);
    debugger
  }
}

var test = new Test(process.env.MY_SECRET)

