const API_URL = 'http://localhost:1337/api';


export async function getDatabases() {
  const response = await fetch(`${API_URL}/getDatabases`);
  return response.json();
}

export async function getTables(db) {
  const response = await fetch(`${API_URL}/getTables`, {
    method: "POSt",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'name': db}),
  })
  return response.json();
}

export async function getData(db, table) {
  const response = await fetch(`${API_URL}/getData`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON:stringify({
      "name": db,
      "table": table
    })
  });
  return response.json();
}
