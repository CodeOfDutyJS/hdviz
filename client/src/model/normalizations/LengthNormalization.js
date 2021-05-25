import NormalizationsCollector from './NormalizationsCollector';

function euclideanNorm(obj, columns) {
  let length = 0;
  columns.forEach((feat) => {
    length += obj[feat] ** 2;
  });
  return Math.sqrt(length);
}

function taxicabNorm(obj, columns) {
  let length = 0;
  columns.forEach((feat) => {
    length += Math.abs(obj[feat]);
  });
  return length;
}

function LengthNormalization(normFn) {
  return (data, columns) => data.map((value) => {
    const length = normFn(value, columns);
    const obj = { ...value };
    columns.forEach((feat) => {
      obj[feat] = value[feat] / length;
    });
    return obj;
  });
}

NormalizationsCollector.addNormalization({
  id: 'EuclideanLengthNorm',
  label: 'Euclidean Length Normalization',
  func: LengthNormalization(euclideanNorm),
});

NormalizationsCollector.addNormalization({
  id: 'ManhattanLengthNorm',
  label: 'Manhattan Length Normalization',
  func: LengthNormalization(taxicabNorm),
});
