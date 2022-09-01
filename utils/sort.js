exports.sortByDate = (a, b, attr, order = "desc") => {
  const aDate = new Date(a[attr]);
  const bDate = new Date(b[attr]);
  const sortOrder = order === "desc" ? -1 : 1;
  return aDate > bDate ? sortOrder : aDate < bDate ? -sortOrder : 0;
};
