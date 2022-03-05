export const getDiff = (object1, object2) => {
  const result = {};
  Object.keys(object1).forEach((r) => {
    const element = object1[r];
    if (object2[r]) {
      if (element !== object2[r]) {
        result[r] = object2[r];
      }
    }
  });
  return result;
};
