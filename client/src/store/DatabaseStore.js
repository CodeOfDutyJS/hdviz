import { makeAutoObservable, runInAction } from 'mobx';

class DatabaseStore {
  rootStore;

  _databases = [];
  _databasesLoading = false;
  _databaseSelected = null;

  _tables = [];
  _tablesLoading = false;
  _tableSelected = null;

  constructor(rootStore, { apiService }) {
    this.rootStore = rootStore;

    makeAutoObservable(this, { rootStore: false }, { autoBind: true });

    this.apiService = apiService;
  }

  async setDatabases() {
    this.databasesLoading = true;
    const response = await this.apiService.getDatabases();
    if (!response.error) {
      this.databases = response;
    } else {
      throw new Error(response.msg);
    }
    this.databasesLoading = false;
  }

  async setTables() {
    this.tablesLoading = true;
    const response = await this.apiService.getTables(this._databaseSelected);
    if (!response.error) {
      this.tables = response;
    } else {
      throw new Error(response.msg);
    }
    this.tablesLoading = false;
  }

  async getData() {
    const response = await this.apiService.getData(this.databaseSelected, this.tableSelected);
    if (!response.error) {
      this.rootStore.modelStore.dataset = response.rows;
    } else {
      throw new Error(response.msg);
    }
  }

  // GETTER / SETTER
  get databases() {
    return this._databases;
  }

  set databases(value) {
    this._databases = value;
  }

  getDatabaseConnections() {
    try {
      this.setDatabases();
    } catch (error) {
      this.rootStore.uiStore.dataError.push({
        status: 'error',
        message: `${error}`,
      });
    }
  }

  get databasesLoading() {
    return this._databasesLoading;
  }

  set databasesLoading(value) {
    this._databasesLoading = value;
  }

  get databaseSelected() {
    return this._databaseSelected;
  }

  set databaseSelected(value) {
    this._databaseSelected = value;
  }

  setDatabaseSelected(value) {
    this.databaseSelected = value;
    try {
      this.setTables();
    } catch (error) {
      this.rootStore.uiStore.dataError.push({
        status: 'error',
        message: `${error}`,
      });
    }
  }

  get tables() {
    return this._tables;
  }

  set tables(value) {
    this._tables = value;
  }

  get tablesLoading() {
    return this._tablesLoading;
  }

  set tablesLoading(value) {
    this._tablesLoading = value;
  }

  get tableSelected() {
    return this._tableSelected;
  }

  set tableSelected(value) {
    this._tableSelected = value;
  }

  setTableSelected(value) {
    this.tableSelected = value;
    try {
      this.getData();
    } catch (error) {
      this.rootStore.uiStore.dataError.push({
        status: 'error',
        message: `${error}`,
      });
    }
  }
}

export default DatabaseStore;
