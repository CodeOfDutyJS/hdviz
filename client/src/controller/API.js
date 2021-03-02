const API_URL = 'http://192.168.178.144:3213/api';

export async function getDatabases() {
  const response = await fetch(`${API_URL}/databases`);
  return response.json();
}

export async function getTables(db) {
  const response = await fetch(`${API_URL}/tables/${db}`);
  return response.json();
}

export async function getData(table) {
  const response = await fetch(`${API_URL}/data/${table}`);
  return response.json();
}
