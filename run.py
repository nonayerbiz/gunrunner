
import json
import os
import sys
import time

import sh

from utils import *

HERE = os.getcwd()
PKGRS = os.path.join(HERE, 'packagers')
SRVRS = os.path.join(HERE, 'servers')

teardown = []

def __call_relay__(self):
  print(">>>---> LAUNCHING RELAY <---<<<")
  self.launch_relay()

def __parcel_test1__(self):
  print("installing project")
  self.code_dir = os.path.join(PKGRS, 'parcel')
  npm_install = sh.npm.install
  npm_install(_cwd=self.code_dir, _out=sys.stdout, _bg=False, _env=os.environ)
  print("running project")
  sh.npm.run('serve', _cwd=self.code_dir, _bg=True, _out=sys.stdout, _env=os.environ)
  teardown.append("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done && ps ax | grep node;")
  time.sleep(5)
  # print("opening tabs")
  # sh.open("http://localhost:1234/", _bg=True)
  # sh.open("http://localhost:8765/gun", _bg=True)

def __webpack_createapp__(self):
  print("installing project")
  self.code_dir = os.path.join(PKGRS, f'{pkgr_type}/{peer_proj}')
  npm_install = sh.npm.install
  npm_install(_cwd=self.code_dir, _out=sys.stdout, _bg=False, _env=os.environ)
  print("running project")
  sh.npm.run('start', _cwd=self.code_dir, _bg=True, _out=sys.stdout, _env=os.environ)
  time.sleep(5)
  # print("opening tabs")
  # sh.open("http://localhost:1234/", _bg=True)
  # sh.open("http://localhost:8765/gun", _bg=True)



if __name__ == '__main__':

  pkgr_type = 'webpack' # or parcel
  peer_proj = 'createapp'
  relay_proj = 'docker'
  gun_version = '0.2020.1232'

  # SET PEER VERSION
  proj_dir = os.path.join(PKGRS, f'{pkgr_type}/{peer_proj}')
  pkg_json_path = os.path.join(proj_dir, 'package.json')
  if os.path.exists(pkg_json_path):
    PkgJsonMngr()(pkg_json_path, gun_version=gun_version)

  # SET RELAY VERSION 
  proj_dir = os.path.join(SRVRS, relay_proj)
  pkg_json_path = os.path.join(proj_dir, 'package.json')
  if os.path.exists(pkg_json_path):
    PkgJsonMngr()(pkg_json_path, gun_version=gun_version)

  # RELAY
  # kwargs = {}
  # kwargs.update({'__call__':__call_relay__}) # these become class props & attrs
  # Relay = type('Relay', (DckrRunner,), kwargs) # define
  # myrelay = Relay() # instantiate it
  # myrelay()
  # teardown.append(f'docker stop {myrelay.server_container_id}')

  # PEER
  func_name = f'__{pkgr_type}_{peer_proj}__'
  func = globals().get(func_name)
  if func:
    peer_kwargs = {'__call__':func}
    type('MyPeer', (object,), peer_kwargs)()()
    
  # TEARDOWN
  if teardown:
    print(">>>---> TEARDOWN INSTRUCTIONS <---<<<")
    if len(teardown) > 1:
      print(" && ".join(teardown))
    else:
      print(teardown[0])



