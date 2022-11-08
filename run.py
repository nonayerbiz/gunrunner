
import json
import os
import sys
import time

import sh

from utils import *


def __call__(self):
  self.launch_relay()
  ###
  print(">>>---> TEARDOWN INSTRUCTIONS <---<<<")
  print(f'docker stop {self.server_container_id}')
  print("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done && ps ax | grep node;")
  print()

  print("installing project")
  npm_install = sh.npm.install
  npm_install(_cwd=self.code_dir, _out=sys.stdout, _bg=False, _env=os.environ)
  print("running project")
  sh.npm.run('serve', _cwd=self.code_dir, _bg=True, _out=sys.stdout, _env=os.environ)
  time.sleep(5)
  print("opening tabs")
  sh.open("http://localhost:1234/", _bg=True)
  sh.open("http://localhost:8765/gun", _bg=True)
  # time.sleep(10)
  # sh.docker.stop(container_id)

kwargs = {
  'known_gun_peers':known_gun_peers,
  '__call__':__call__
}
MyGunRunner = type('MyGunRunner', (DckrRunner,), kwargs)



if __name__ == '__main__':
  MyGunRunner()()