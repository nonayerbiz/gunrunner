import Gun from "gun";

const gun = Gun([import.meta.env.VITE_GUN_RELAY_URL]);
const testing = gun.get("testing");

testing.map().on((data, key) => {
  const row = document.querySelector('#output').insertRow();
  const keyCell = row.insertCell(0);
  const dataCell = row.insertCell(1);

  const keyText = document.createTextNode(key);
  keyCell.appendChild(keyText);
  const dataText = document.createTextNode(data);
  dataCell.appendChild(dataText);
});

const initialState = {
  '0.children.1.children.0': '{"title":"High Performance Computing (HPC) Solutions | HPE","type":"bookmark","url":"https://www.hpe.com/us/en/compute/hpc.html"}',
  '0.children.1.children.1': '{"title":"Nokia Corporation","type":"bookmark","url":"https://www.nokia.com/"}',
  '0.children.1.children.2': '{"title":"Intel | Data Center Solutions, IoT, and PC Innovation","type":"bookmark","url":"https://www.intel.co.uk/content/www/uk/en/homepage.html"}',
};

Object.entries(initialState).forEach(([key, value]) => {
  testing.get(key).put(value);
});

const updates = {
  '0.children.1.children.0': '{"title":"Intel | Data Center Solutions, IoT, and PC Innovation","type":"bookmark","url":"https://www.intel.co.uk/content/www/uk/en/homepage.html"}',
  '0.children.1.children.1': '{"title":"High Performance Computing (HPC) Solutions | HPE","type":"bookmark","url":"https://www.hpe.com/us/en/compute/hpc.html"}',
  '0.children.1.children.2': '{"title":"Nokia Corporation","type":"bookmark","url":"https://www.nokia.com/"}',
};

document.querySelector('#button').addEventListener('click', () => {
  Object.entries(updates).forEach(([key, value]) => {
    testing.get(key).put(value);
  });
});

