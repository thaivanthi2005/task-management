const md5 = require("md5");
const User = require("../models/user.model");
// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);
  const exitsEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (exitsEmail) {
    res.json({
      code: 400,
      message: "EMAIL ĐÃ TỒN TẠI",
    });
  } else {
    const user = new User(req.body);
    user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "THÊM USER THÀNH CÔNG ",
      token: token,
    });
  }
  console.log(req.body);
};

module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "ĐĂNG NHẬP KHÔNG THÀNH CÔNG ( EMAIL KHÔNG TỒN TẠI )",
    });
    return;
  }
  if (password !== user.password) {
    res.json({
      code: 400,
      message: "ĐĂNG NHẬP KHÔNG THÀNH CÔNG ( SAI MẬT KHẨU )",
    });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "ĐĂNG NHẬP THÀNH CÔNG",
  });
};
