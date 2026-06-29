/**
 * 文件上传中间件模块
 * 基于 Multer 配置帖子图片与头像上传
 */
const multer = require('multer')
const path = require('path')

/**
 * 创建 Multer 磁盘存储配置
 * @param {string} subDir - 上传子目录名称
 * @returns {import('multer').StorageEngine} Multer 存储引擎
 */
function createStorage(subDir) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads', subDir))
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
    }
  })
}

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('仅支持 jpg/png/gif/webp 格式'))
  }
}

const limits = { fileSize: 5 * 1024 * 1024 }

const uploadPost = multer({ storage: createStorage('posts'), fileFilter, limits })
const uploadAvatar = multer({ storage: createStorage('avatars'), fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })

module.exports = { uploadPost, uploadAvatar }
