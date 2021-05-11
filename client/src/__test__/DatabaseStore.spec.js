import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { RootStore } from '../store/index';

jest.mock('mobx');

let rootStore;
let databaseStore;

beforeEach(() => {
  makeAutoObservable.mockClear();

  rootStore = new RootStore();
  databaseStore = rootStore.databaseStore;
});

describe('DBStore', () => {
  describe('setDatabases', () => {
    test('two db from api call', async () => {
      const apiMock = {
        getDatabases() {
          return [{ databases: ['db1', 'db2'] }];
        },
      };

      databaseStore.apiService = apiMock;

      await databaseStore.setDatabases();
      expect(databaseStore.databases).toStrictEqual(['db1', 'db2']);
    });

    test('error in the db name call', async () => {
      const apiMock = {
        getDatabases() {
          return { error: 'Error test', msg: 'error test message' };
        },
      };

      databaseStore.apiService = apiMock;

      await databaseStore.setDatabases();
      expect(rootStore.uiStore.dataError).toStrictEqual([{ status: 'error', message: 'error test message' }]);
    });
  });

  describe('setTables', () => {
    test('two tables from api call', async () => {
      const apiMock = {
        getTables(db) {
          return ['table1', 'table2'];
        },
      };

      databaseStore.apiService = apiMock;
      databaseStore.databaseSelected = 'db1';

      await databaseStore.setTables();
      expect(databaseStore.tables).toStrictEqual(['table1', 'table2']);
    });

    test('error in the table name call', async () => {
      const apiMock = {
        getTables(db) {
          return { error: 'Error test', msg: 'error test message' };
        },
      };

      databaseStore.apiService = apiMock;
      databaseStore.databaseSelected = 'db1';

      await databaseStore.setTables();
      expect(rootStore.uiStore.dataError).toStrictEqual([{ status: 'error', message: 'error test message' }]);
    });
  });

  describe('getData', () => {
    test('two row from api call', async () => {
      const apiMock = {
        getData(db, table) {
          return [{ col1: 12, col2: 13 }, { col1: 14, col2: 15 }];
        },
      };

      databaseStore.apiService = apiMock;
      databaseStore.databaseSelected = 'db1';
      databaseStore.tableSelected = 'table1';

      await databaseStore.getData();
      expect(rootStore.modelStore.data.dataset).toStrictEqual([{ col1: 12, col2: 13 }, { col1: 14, col2: 15 }]);
    });

    test('error in the data call', async () => {
      const apiMock = {
        getData(db, table) {
          return { error: 'Error test', msg: 'error test message' };
        },
      };

      databaseStore.apiService = apiMock;
      databaseStore.databaseSelected = 'db1';
      databaseStore.tableSelected = 'table1';

      try {
        await databaseStore.getData();
      } catch (error) {
        expect(error).toStrictEqual(new Error('error test message'));
      }
    });
  });
});
