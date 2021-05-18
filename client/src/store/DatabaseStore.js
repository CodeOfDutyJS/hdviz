/* eslint-disable no-unreachable */
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
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await this.apiService.getDatabases();

      if (!response.error) {
        this.databases = response[0].databases;
      } else {
        throw response.msg;
      }

      this.databasesLoading = false;
    } catch (error) {
      this.rootStore.uiStore.addError('error', error);
    }
  }

  async setTables() {
    this.tablesLoading = true;
    try {
      const response = await this.apiService.getTables(this._databaseSelected);

      if (!response.error) {
        this.tables = response;
      } else {
        throw response.msg;
      }
      this.tablesLoading = false;
    } catch (error) {
      this.rootStore.uiStore.addError('error', error);
    }
  }

  async getData() {
    const response = await this.apiService.getData(this.databaseSelected, this.tableSelected);

    if (!response.error) {
      this.rootStore.modelStore.setDataset(response);
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

  async getDatabaseConnections() {
    try {
      await this.setDatabases();
    } catch (error) {
      this.rootStore.uiStore.addError('error', error);
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

  async setDatabaseSelected(value) {
    this.databaseSelected = value;
    try {
      await this.setTables();
    } catch (error) {
      this.rootStore.uiStore.addError('error', error);
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

  async setTableSelected(value) {
    this.tableSelected = value;
    try {
      await this.getData();
    } catch (error) {
      this.rootStore.uiStore.addError('error', error);
    }
  }
}

export default DatabaseStore;
