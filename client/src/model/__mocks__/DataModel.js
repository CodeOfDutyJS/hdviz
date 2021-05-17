import DataModel from '../DataModel';
import createMockFromClass from '@jest/globals';

const model = createMockFromClass(DataModel);

function mockGetSelectedDataset() {
  return [
    {
      name: 'Pinco', color: 'blu', height: 1, width: 4,
    },
    {
      name: 'Pallo', color: 'green', height: 2, width: 5,
    },
    {
      name: 'Jinx', color: 'red', height: 3, width: 6,
    },
    {
      name: 'Jinx', color: 'red', height: 8, width: 6,
    },
  ];
}

model.getSelectedDataset = mockGetSelectedDataset;

export default model;
