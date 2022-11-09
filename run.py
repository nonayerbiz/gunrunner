
import json
import os
import sys
import time

import sh

from utils import *

HERE = os.getcwd()
PKGR = os.path.join(HERE, 'packagers')
SRVS = os.path.join(HERE, 'servers')

def __call_relay__(self):
  print(">>>---> LAUNCHING RELAY <---<<<")
  self.launch_relay()

def __call_peer__(self):
  print("installing project")
  self.code_dir = os.path.join(PKGR, 'parcel')
  npm_install = sh.npm.install
  npm_install(_cwd=self.code_dir, _out=sys.stdout, _bg=False, _env=os.environ)
  
  print("running project")
  sh.npm.run('serve', _cwd=self.code_dir, _bg=True, _out=sys.stdout, _env=os.environ)
  time.sleep(5)

  print("opening tabs")
  sh.open("http://localhost:1234/", _bg=True)
  sh.open("http://localhost:8765/gun", _bg=True)

if __name__ == '__main__':
  teardown = []

  # RELAY
  # kwargs = {}
  # kwargs.update({'__call__':__call_relay__}) # these become class props & attrs
  # Relay = type('Relay', (DckrRunner,), kwargs) # define
  # myrelay = Relay() # instantiate it
  # myrelay()
  # teardown.append(f'docker stop {myrelay.server_container_id}')

  # PEER
  peer_kwargs = {'__call__':__call_peer__}
  type('MyPeer', (object,), peer_kwargs)()()
  teardown.append("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done && ps ax | grep node;")
  
  # TEARDOWN
  print(">>>---> TEARDOWN INSTRUCTIONS <---<<<")
  if len(teardown) > 1:
    print(" && ".join(teardown))
  else:
    print(teardown[0])
