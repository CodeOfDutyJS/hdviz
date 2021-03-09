const API_URL = 'http://localhost:1337/api';

export async function getDatabases() {
  const response = await fetch(`${API_URL}/getDatabases`);
  return response.json();
}

export async function getTables(db) {
  const response = await fetch(`${API_URL}/getTables?dbname=${db}`);
  return response.json();
}

export async function getData(db, table) {
  const response = await fetch(`${API_URL}/getData?dbname=${db}&dbtable=${table}`);
  return response.json();
}
