const Task = require("../models/task.model");
const paginatonHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = { deleted: false };
  if (req.query.status) {
    find.status = req.query.status;
  }
  console.log(req.query);
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }

  //Pagination
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };
  const countTask = await Task.countDocuments(find);
  let objectPagination = paginatonHelper(initPagination, req.query, countTask);
  //Pagination

  //Search
  const objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  //Search
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch {
    res.json("THAI VAN THI");
  }
};

//[PATCH] /change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      },
    );
    res.json({
      message: "Cập nhật trạng thái thành công",
      code: 200,
    });
  } catch {
    res.json({
      message: "Cập nhật trạng thái KHÔNG thành công",
      code: 400,
    });
  }
};
