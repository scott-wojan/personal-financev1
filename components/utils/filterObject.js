export default function filterObject(obj, filterPredicate) {
  const results = [];
  function _filterObject(o, f) {
    for (let key in o) {
      const val = o[key];
      if (f(val)) {
        results.push(val);
      }
      if (typeof val === "object") {
        _filterObject(val, f);
      }
    }
  }
  _filterObject(obj, filterPredicate);
  return results;
}
