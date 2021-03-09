/* eslint-disable no-undef */
import Dataset from '../model/Dataset';

describe('Test DataSet', () => {
  const row = {
    id: 0,
    name: 'giorgio',
    surname: 'rossi',
  };
  const link = {
    source: 0,
    target: 1,
    distance: 5,
  };
  const selection = ['name', 'surname'];
  const dataset = new Dataset();
  beforeEach(() => {
    dataset.dataFlush();
  });
  it('should pass a new row to next when using Columnselect', () => {
    let newRow = {};
    Dataset.columnSelect(row, selection, (r) => {
      newRow = r;
    });
    // eslint-disable-next-line eqeqeq
    const same = (newRow == row);
    expect(same).toEqual(false);
  });
  it('should cut coloumns correctly', () => {
    let newRow = {};
    Dataset.columnSelect(row, selection, (r) => {
      newRow = r;
    });
    const comp = {
      name: 'giorgio',
      surname: 'rossi',
    };
    expect(newRow).toEqual(comp);
  });
  it('should add a row', () => {
    dataset.addRow(row);
    expect(dataset.data.nodes.length).toEqual(1);
  });
  it('should add the correct row', () => {
    dataset.addRow(row);
    expect(dataset.data.nodes[0]).toEqual(row);
  });
  it('should add the correct link', () => {
    dataset.addLinkRow(link);
    expect(dataset.data.links[0]).toEqual(link);
  });
  it('should pass the correct node to next', () => {
    let newRow = {};
    dataset.addRow(row, (r) => {
      newRow = r;
    });
    expect(newRow).toEqual(row);
  });
  it('should pass the correct link to next', () => {
    let newLink = {};
    dataset.addLinkRow(link, (r) => {
      newLink = r;
    });
    expect(newLink).toEqual(link);
  });
  it('should return the data', () => {
    dataset.addRow(row);
    expect(dataset.getNodes()[0]).toEqual(row);
  });
  it('should return the links', () => {
    dataset.addLinkRow(link);
    expect(dataset.getLinks()[0]).toEqual(link);
  });
  it('should add the nodes', () => {
    const d = {
      nodes: [{
        id: 0,
        name: 'giorgio',
        surname: 'rossi',
      }],
      links: [],
    };
    const r = [{
      id: 0,
      name: 'giorgio',
      surname: 'rossi',
    }];
    dataset.addData(r);
    expect(dataset.getData()).toEqual(d);
  });
  it('should add the links', () => {
    const d = {
      nodes: [],
      links: [{
        source: 0,
        target: 1,
        distance: 5,
      }],
    };
    const l = [{
      source: 0,
      target: 1,
      distance: 5,
    }];
    dataset.addLinks(l);
    expect(dataset.getData()).toEqual(d);
  });
});
