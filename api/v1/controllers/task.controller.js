const Task = require("../models/task.model");
const paginatonHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    $or: [
      {
        createdBy: req.user.id,
      },
      {
        listUser: req.user.id,
      },
    ],
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
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

//[PATCH] /api/v1/tasks//change-status/:id
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

//[PATCH] /api/v1/tasks//change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          },
        );
        res.json({
          message: "Cập nhật trạng thái thành công",
          code: 200,
        });
        break;
      case "deleted":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          },
        );
        res.json({
          message: "Cập nhật trạng thái thành công",
          code: 200,
        });
        break;
      default:
        res.json({
          message: "Cập nhật trạng thái KHÔNG thành công",
          code: 400,
        });
        break;
    }
  } catch (error) {
    res.json({
      message: "Cập nhật trạng thái KHÔNG thành công",
      code: 400,
    });
  }
};
// [POST] /api/v1/tasks/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      messsage: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      messsage: "Tạo không thành công !!! LỖI !!!",
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      messsage: "Sửa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      messsage: "Sửa không thành công !!! LỖI !!!",
    });
  }
};

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.deleteOne({ _id: id });
    res.json({
      code: 200,
      messsage: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      messsage: "Xóa không thành công !!! LỖI !!!",
    });
  }
};
