const multer = require("multer");
const fs = require('fs');
const maxSize = 5 * 1024 * 1024;

const createDirIfNotExists = dir =>
  !fs.existsSync(dir) ? fs.mkdirSync(dir, { recursive: true }) : undefined;

let profileFiles = multer({
  limits: {
    fileSize: maxSize
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let dir = __basedir + `/public/uploads/profile/`;
      createDirIfNotExists(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split('/')[1]);
    },
  })
})

let profileFilesByAdmin = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let dir = __basedir + `/public/uploads/profile/`;
      createDirIfNotExists(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split('/')[1]);
    },
  })
})

module.exports = {profileFiles, profileFilesByAdmin};