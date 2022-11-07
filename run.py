
import sys
import sh
import os
import time
import json

def get_dckr_images():
  return [x.strip() for x in sh.docker.image.ls('--format', '{{json .}}').strip().split('\n')]

def build_gunserver():
  build = True
  for line in get_dckr_images():
    entry = json.loads(line)
    if entry.get('Repository') == 'gunrunner/gundb':
      build = False
  if not build:
    sh.docker.build('.',  '-t', 'gunrunner/gundb', _cwd='./servers/docker')


def parcel_with_parcelmw():
  cwd ='./packagers/parcel'
  container_id = sh.docker.run(
    '-d', '--rm', '--name', 'gunrunner', '-p', '8765:8765', 'gunrunner/gundb', 
    _cwd=cwd, _bg=True, _env=os.environ
  ).strip()

  # TEARDOWN INSTRUCTIONS
  print(f'docker stop {container_id}')
  print("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done ")

  npm_install = sh.npm.install
  npm_install(_cwd=cwd, _out=sys.stdout, _bg=False, _env=os.environ)
  sh.npm.run('serve', _cwd=cwd, _bg=False, _out=sys.stdout, _env=os.environ)

  time.sleep(10)
  sh.docker.stop(container_id)

def main():
  build_gunserver()
  # parcel_with_parcelmw()





if __name__ == '__main__':
  main()