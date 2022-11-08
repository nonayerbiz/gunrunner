
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
  self.launch_relay()
  print(">>>---> TEARDOWN INSTRUCTIONS <---<<<")
  teardown = []
  teardown.append(f'docker stop {self.server_container_id}')
  teardown.append("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done && ps ax | grep node;")
  print("&&".join(teardown))

def __call_peer__(self):
  self.code_dir = os.path.join(PKGR, 'parcel')
  print("installing project")
  npm_install = sh.npm.install
  npm_install(_cwd=self.code_dir, _out=sys.stdout, _bg=False, _env=os.environ)
  print("running project")
  sh.npm.run('serve', _cwd=self.code_dir, _bg=True, _out=sys.stdout, _env=os.environ)
  time.sleep(5)
  print("opening tabs")
  sh.open("http://localhost:1234/", _bg=True)
  sh.open("http://localhost:8765/gun", _bg=True)

if __name__ == '__main__':
  # RELAY
  relay_kwargs = {'__call__':__call_relay__} # these become class props & attrs
  type('MyRelay', (DckrRunner,), relay_kwargs)()() # define, instantiate & run a python class
  # PEER
  peer_kwargs = {'__call__':__call_peer__}
  type('MyPeer', (object,), peer_kwargs)()()

