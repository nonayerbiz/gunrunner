
import regen from 'regenerator-runtime/runtime'

import m from "mithril"

import 'materialize-css/dist/css/materialize.min.css';
import 'material-icons/iconfont/material-icons.css';
import { TextField, RaisedButton, Button } from 'polythene-mithril';
import { addTypography } from "polythene-css";
import "polythene-css"

import Gun from 'gun/gun'
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/rindexed';
import SEA from 'gun'
const gun = Gun();

//const user = gun.user();
function isAuthentictedAck(ack) {
  if(ack.pub !== '' && !ack.err){
    console.log("LOGIN SUCCEEDED");
  }else if(ack.err !== ''){
    if (ack.err.indexOf('secret') > 0) {
      console.log('Password incorrect');
    }else {
      console.log(ack.err);
    }
  }else {
    console.log("LOGIN FAILED")
  }
}

function procLoginForm(topic, form_params) {
  console.log('/// procLoginForm ///');
  document.addEventListener('signUp',event=>{
    console.log('e',event)
  })
  // var login_callback = function(ack) {
  //   console.log("/// login_callback ///", ack);
  //   isAuthentictedAck(ack);
  //   console.log(gun.get('~@minskmaz'));
  // }
  // var register_callback = function(ack) {
  //   console.log("/// register_callback ///", ack);
  //   user_api.auth(alias, pass, login_callback, opt)//.bind(login_callback);
  // }
  // var user_api = gun.user();
  // var opt = {};
  // var alias = 'minskmaz@minskmaz.com';
  // var pass = 'letmein';
  // user_api.create(alias, pass, register_callback, opt);
}


async function initMITHRIL() {
  console.log("/// initMITHRIL ///")
}

// instantiate gun
async function initGUN() {
  console.log("/// initGUN ///")
  const opt = {
    localStorage: true,
    file: 'eyfl',
    //peers: ['https://gundb.arkfab.com/gun']
  };
  opt.store = RindexedDB(opt);
  window.gun = Gun(opt);
  return true
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    initGUN()
    .then(procLoginForm, 'register_login', {})
      .then(initMITHRIL)
  }
})
