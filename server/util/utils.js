const functionWithPromise = (item) => Promise.resolve("ok");

const asyncFunc = async (item) => functionWithPromise(item);

module.exports = {
  asyncFunc,
};
