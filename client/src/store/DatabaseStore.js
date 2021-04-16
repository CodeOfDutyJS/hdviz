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
    this.databases = await this.apiService.getDatabases();
    this.databasesLoading = false;
  }

  async setTables() {
    this.tablesLoading = true;
    this.tables = await this.apiService.getTables(this._databaseSelected);
    this.tablesLoading = false;
  }

  async getData() {
    return this.apiService.getData(this.databaseSelected, this.tableSelected);
  }

  // GETTER / SETTER
  get databases() {
    return this._databases;
  }

  set databases(value) {
    this._databases = value;
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
    this.setTables();
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
  }
}

export default DatabaseStore;