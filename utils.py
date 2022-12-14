

import json
import os
import sys
import time

import sh


known_gun_peers = [
  "http://relay.peer.ooo/gun",
  "http://replicant.adamantium.online/gun",
  "http://gun-matrix.herokuapp.com/gun",
  "http://shockblox-gun-server.herokuapp.com/gun",
  "http://mg-gun-manhattan.herokuapp.com/gun",
  "http://gunmeetingserver.herokuapp.com/gun",
  "http://gun-eu.herokuapp.com/gun",
  "http://gunjs.herokuapp.com/gun",
  "http://myriad-gundb-relay-peer.herokuapp.com/gun",
  "http://gun-armitro.herokuapp.com/",
  "http://fire-gun.herokuapp.com/gun",
  "http://34.101.247.230:8765/gun",
  "http://gun-sashimi.herokuapp.com/gun",
  "http://gun-ams1.cl0vr.co:443/gun",
  "http://gun-manhattan.herokuapp.com/gun",
  "http://us-west.xerberus.net/gun",
  "http://dletta.rig.airfaas.com/gun",
  "http://e2eec.herokuapp.com/gun",
  "http://gun-us.herokuapp.com/gun",
  "http://www.raygun.live/gun"
] # http://github.com/amark/gun/wiki/volunteer.dht


class PkgJsonMngr(object):

  def read(self):
    if not hasattr(self, '_pyobj'):
      with open(self.pkg_json_path, 'rt') as pkg_json:
        self._pyobj = json.load(pkg_json)
    return self._pyobj

  def write(self):
    with open(self.pkg_json_path, 'w') as pkg_json:
      json.dump(self._pyobj, pkg_json, indent=2)

  def set_gun_version(self, version):
    self.read()
    if 'devDependencies' in self._pyobj:
      self._pyobj['devDependencies']['gun'] = version
    elif 'dependencies' in self._pyobj:
      self._pyobj['dependencies']['gun'] = version
    self.write()

  def __call__(self, pkg_json_path, gun_version=None):
    self.pkg_json_path = pkg_json_path
    if gun_version:
      self.set_gun_version(gun_version)



  




class DckrRunner(object):
  @property
  def server_container_id(self):
    if not hasattr(self, '_server_container_id'):
      self._server_container_id = ''
      for item in self.get_containers():
        entry = json.loads(item)
        if entry.get('Image') == 'gunrunner/gundb' and entry.get('Ports') == '0.0.0.0:8765->8765/tcp':
          self._server_container_id = entry.get('ID')
    return self._server_container_id

  @property
  def gun_server_is_up(self):
    if self.server_container_id:
      return True
    return False

  def get_dckr_images(self):
    return [x.strip() for x in sh.docker.image.ls('--format', '{{json .}}').strip().split('\n')]

  def get_containers(self):
    containers = sh.docker.container.ls('--format', '{{json .}}')
    if containers:
      containers = containers.strip().split('\n')
      return [x.strip() for x in containers]
    return []

  def build_gunserver(self):
    dckr_image_exists = False
    for line in self.get_dckr_images():
      entry = json.loads(line)
      if entry.get('Repository') == self.gunserver_image_name:
        dckr_image_exists = True
    if not dckr_image_exists:
      sh.docker.build('.',  '-t', self.gunserver_image_name, _out=sys.stdout, _cwd='./servers/docker')

  def run_gunserver(self):
    if not self.gun_server_is_up:
      self._server_container_id = sh.docker.run(
        '-d', '--rm', '--name', 'gunrunner', '-p', '8765:8765', self.gunserver_image_name, 
        _cwd=self.server_dir, _bg=True, _env=os.environ
      ).strip()

  def launch_relay(self):
    self.server_dir = './servers/docker'
    self.gunserver_image_name = 'gunrunner/gundb' # rename it here if you must
    self.build_gunserver()
    self.run_gunserver()

