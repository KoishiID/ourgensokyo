/**
 * 处理文件上传并返回可访问的 URL
 * @param {import('express').Request} req - 请求对象，req.file 由 multer 中间件填充
 * @param {import('express').Response} res - 响应对象
 * @returns {Promise<void>}
 */
async function uploadFile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择文件' })
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '上传失败' })
  }
}

module.exports = { uploadFile }
