/* eslint-disable class-methods-use-this */
const API_URL = 'http://localhost:1337/api';

class ApiService {
  async getDatabases() {
    const response = await fetch(`${API_URL}/getDatabases`);
    return response.json();
  }

  async getTables(db) {
    const response = await fetch(`${API_URL}/getTables?dbname=${db}`);
    return response.json();
  }

  async getData(db, table) {
    const response = await fetch(`${API_URL}/getData?dbname=${db}&dbtable=${table}`);
    return response.json();
  }
}

export default ApiService;
