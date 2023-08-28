const multer =require('multer')
const path=require('path')



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/product/');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname; // Use the original file name only
    cb(null, fileName);
  }
});


  const  upload= multer({ storage: storage })
   

  module.exports = upload
  