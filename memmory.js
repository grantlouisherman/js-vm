const createMemmory = sizeInBytes => {
  const ab = new ArrayBuffer(sizeInBytes);
  const dv = new DataView(ab);
  return dv;
}

module.exports = createMemmory
