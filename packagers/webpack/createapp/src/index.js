import "./styles.css";


import Gun from 'gun/gun'
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/rindexed';
import SEA from 'gun'

function onToAllEntries() {
  console.log('--------------------------------------');
  console.log('--- SUBSCRIBE TO LOAD LIST CHANGES ---');
  console.log('--------------------------------------');
  // SUBSCRIBE TO EVERY ROW 
  gun.get('entry').map().on((data, key) => {
    console.log(' --------------  TRIGGERING SUBSCRIPTION TO UPDATE TABLE -------------- ',
        key, data
    )
    document.getElementById('item_id_input').value = key
    document.getElementById('attr_1_input').value = data.attr_1;
    document.getElementById('attr_2_input').value = data.attr_2;
    document.getElementById('attr_3_input').value = data.attr_3;
    document.getElementById('attr_4_input').value = data.attr_4;
  })
}

function initUI(){
  document.getElementById('clicker').onclick = () => {
    console.log("clicked");
    let item_id = document.getElementById('item_id_input').value;
    let attr_1 = document.getElementById('attr_1_input').value;
    let attr_2 = document.getElementById('attr_2_input').value;
    let attr_3 = document.getElementById('attr_3_input').value;
    let attr_4 = document.getElementById('attr_4_input').value;
    addLoadEntry(
      item_id,
      attr_1,
      attr_2,
      attr_3,
      attr_4
    );
  }

  const addLoadEntry = async (
    item_ID,
    attr_1,
    attr_2,
    attr_3,
    attr_4
  ) => {
    console.log('ADD LOAD ENTRY');
    console.log(item_ID,
      attr_1,
      attr_2,
      attr_3,
      attr_4,
    );
    let row_obj = {
      attr_1: attr_1,
      attr_2: attr_2,
      attr_3: attr_3,
      attr_4: attr_4
    };
    gun.get('entry').get(item_ID).put(row_obj)
  }
  onToAllEntries()
}

async function initGUN() {
  console.log("/// initGUN ///")
  const opt = {
    localStorage: true,
    file: 'eyfl',
    peers: ['https://gundb.eyfl.io/gun']
  };
  opt.store = RindexedDB(opt);
  window.gun = Gun(opt);
  return true
}


document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    initGUN().then(initUI)
  }
})

