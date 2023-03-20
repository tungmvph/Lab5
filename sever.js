const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))

const upload = multer({
    limits: {
      fileSize: 1 * 1024 * 1024, // 5MB
    },
    // Thiết lập thư mục lưu trữ
    storage: multer.diskStorage({
  destination: function (req, file, cb) {
        var dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        var tenGoc = file.originalname;
        arr = tenGoc.split('.');

        let newFileName = '';

        for (let i = 0; i < arr.length; i++) {

            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.'+ arr[i]);
            }
        }

        cb(null, newFileName)
    }
    })
  });

//   var upload=multer({storage:storage,limits:{fieldSize:1*1024*1024}});
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 5), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})
// tai tẹp jpg

// Hàm kiểm tra định dạng tệp tin





app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        error: 'Tệp quá lớn',
      });
    } else {
      next(err);
    }
  });
  



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

