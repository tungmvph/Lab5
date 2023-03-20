const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Lưu trữ tệp tin trong thư mục uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {

    var tenGoc = file.originalname;
    arr = tenGoc.split('.');

    let newFileName = '';

    for (let i = 0; i < arr.length; i++) {

        if (i != arr.length - 1) {
            newFileName += arr[i];
        } else {
            newFileName += ('-' + Date.now() +path.extname(file.originalname)+ '.'+ arr[i]);
        }
    }

    cb(null, newFileName)
}
  // filename: function (req, file, cb) {
  //   cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  // },
});

// Chỉ cho phép tải lên tệp tin JPEG
const fileFilter = function (req, file, cb) {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG images are allowed"));
  }
};

// Khởi tạo middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Trang tải lên tệp tin
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Xử lý yêu cầu tải lên tệp tin
app.post("/upload", upload.array("files"), (req, res) => {
  // Lặp qua các tệp tin được tải lên
  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];
    // Kiểm tra nếu tệp tin không phải định dạng JPEG, chuyển đổi thành JPEG
    if (file.mimetype !== "image/jpeg") {
      const filePath = file.path;
      const newFilePath = filePath + ".jpeg";
      const cmd = `convert "${filePath}" "${newFilePath}"`;
      require("child_process").execSync(cmd);
      // Xóa tệp tin cũ
      require("fs").unlinkSync(filePath);
      // Cập nhật tên tệp tin mới
      file.filename = file.filename + ".jpeg";
      file.path = newFilePath;
      file.mimetype = "image/jpeg";
    }
  }
  res.send("Files uploaded successfully");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});