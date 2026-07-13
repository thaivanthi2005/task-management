const md5 = require("md5");
const User = require("../models/user.model");
const generateHelper = require("../../../helper/generate");
const ForgotPassword = require("../models/forgot-password");
const sendMailHelper = require("../../../helper/sendMail");
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
// [POST] /api/v1/users/login

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
// [POST] /api/v1/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "EMAIL KHÔNG TỒN TẠI",
    });
    return;
  }
  const otp = generateHelper.generateRandomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
  };
  // console.log(objectForgotPassword);
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // Gửi OTP qua email
  const subject = "Mã OTP xác thực đổi mật khẩu";
  const html = `
    <h3>Xin chào ${user.fullName || email},</h3>
    <p>Mã OTP của bạn là: <b style="font-size: 24px;">${otp}</b></p>
    <p>Mã có hiệu lực trong <b>5 phút</b>. Vui lòng không chia sẻ mã này với ai.</p>
    <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
  `;

  await sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    email: email,
  });
};
// [POST] /api/v1/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const otpexits = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!otpexits) {
    res.json({
      code: 400,
      message: "MÃ OTP KO HỢP LỆ",
    });
    return;
  }
  const user = await User.findOne({ email: email });
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "XÁC THỰC THÀNH CÔNG",
    otp: otp,
  });
};

// [POST] /api/v1/users/password/resetpassword
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const user = await User.findOne({
    token: token,
  });
  console.log(user);
  if (md5(password) == user.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu khác với mật khẩu cũ ",
    });
    return;
  }
  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(password),
    },
  );
  res.json({
    code: 200,
    message: "THAY DOI MK THANH CONG ",
  });
};

module.exports.detail = async (req, res) => {
  const token = req.cookies.token;
  const user = await User.findOne({
    token: token,
    deleted: false,
  }).select("-password -token");
  res.json({
    code: 200,
    message: "TEST",
    info: user,
  });
};
