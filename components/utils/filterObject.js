export default function filterObject(obj, filterPredicate) {
  const results = [];
  function _filterObject(o, filterPredicate, parent = null) {
    for (let key in o) {
      const val = o[key];
      if (filterPredicate(val)) {
        results.push(val);
      }
      if (typeof val === "object") {
        _filterObject(val, filterPredicate, parent);
      }
    }
  }
  _filterObject(obj, filterPredicate);
  return results;
}
