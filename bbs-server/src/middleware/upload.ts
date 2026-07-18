/**
 * 文件上传中间件模块
 * 基于 Multer 配置帖子图片与头像上传
 */
import multer from 'multer'
import path from 'path'

/**
 * 创建 Multer 磁盘存储配置
 */
function createStorage(subDir: string): multer.StorageEngine {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '../../uploads', subDir))
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
    }
  })
}

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error('仅支持 jpg/png/gif/webp 格式'))
  }
}

const limits = { fileSize: 5 * 1024 * 1024 }

export const uploadPost = multer({ storage: createStorage('posts'), fileFilter, limits })
export const uploadAvatar = multer({ storage: createStorage('avatars'), fileFilter, limits: { fileSize: 2 * 1024 * 1024 } })
