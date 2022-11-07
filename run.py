
import sys
import sh
import os
import time
import json


class DckrRunner(object):
  def get_dckr_images(self):
    return [x.strip() for x in sh.docker.image.ls('--format', '{{json .}}').strip().split('\n')]

  def get_containers(self):
    return [x.strip() for x in sh.docker.container.ls('--format', '{{json .}}').strip().split('\n')]

  def build_gunserver(self):
    dckr_image_exists = False
    for line in self.get_dckr_images():
      entry = json.loads(line)
      if entry.get('Repository') == 'gunrunner/gundb':
        dckr_image_exists = True
    if not dckr_image_exists:
      sh.docker.build('.',  '-t', 'gunrunner/gundb', _out=sys.stdout, _cwd='./servers/docker')

  @property
  def gun_server_is_up(self):
   for item in self.get_containers():
    entry = json.loads(item)
    if entry.get('Image') == 'gunrunner/gundb' and entry.get('Ports') == '0.0.0.0:8765->8765/tcp':
      if not hasattr(self, 'server_container_id'):
        self.server_container_id = entry.get('ID')
      return True
    return False

  def run_gunserver(self):
    if not self.gun_server_is_up:
      self.server_container_id = sh.docker.run(
        '-d', '--rm', '--name', 'gunrunner', '-p', '8765:8765', 'gunrunner/gundb', 
        _cwd=cwd, _bg=True, _env=os.environ
      ).strip()


  def parcel_with_parcelmw(self):
    cwd ='./packagers/parcel'
    # TEARDOWN INSTRUCTIONS
    print(f'docker stop {self.server_container_id}')
    print("for i in $( ps ax | awk '/[p]arcelserve.js/ {print $1}' ); do kill ${i}; done && ps ax | grep node;")
    npm_install = sh.npm.install
    npm_install(_cwd=cwd, _out=sys.stdout, _bg=False, _env=os.environ)
    sh.npm.run('serve', _cwd=cwd, _bg=False, _out=sys.stdout, _env=os.environ)

    # time.sleep(10)
    # sh.docker.stop(container_id)

  def __call__(self):
    self.build_gunserver()
    self.run_gunserver()
    self.parcel_with_parcelmw()




if __name__ == '__main__':
  dckr = DckrRunner()
  dckr()