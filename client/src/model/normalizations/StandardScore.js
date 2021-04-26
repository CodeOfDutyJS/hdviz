import mean from 'ml-array-mean';
import standardDeviation from 'ml-array-standard-deviation';
import NormalizationsCollector from './NormalizationsCollector';

function toArray(data, feat) {
  return data.reduce((acc, row) => {
    // eslint-disable-next-line no-param-reassign
    acc.push(row[feat]);
    return acc;
  }, []);
}

function StandardScore(data, columns) {
  const means = {};
  const deviations = {};
  columns.forEach((feat) => {
    means[feat] = mean(toArray(data, feat));
    deviations[feat] = standardDeviation(toArray(data, feat), { unbiased: true });
  });
  const d = data;
  d.forEach((value) => {
    columns.forEach((feat) => {
      // eslint-disable-next-line no-param-reassign
      value[feat] = (value[feat] - means[feat]) / deviations[feat];
    });
  });
  return d;
}

export default StandardScore;

console.log('e');
NormalizationsCollector.addNormalization({
  id: 'SS',
  label: 'Standard Score',
  func: StandardScore,
});
