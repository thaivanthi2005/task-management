module.exports = (objectPagination, query, countTask) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    objectPagination.limitItems = query.limit;
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countTask / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  return objectPagination;
};
