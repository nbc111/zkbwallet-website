const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.apk || files.apk.length === 0) {
      return res.status(400).json({ error: 'No APK file uploaded' });
    }

    const uploadedFile = files.apk[0];
    
    // 验证文件类型
    if (!uploadedFile.originalFilename.toLowerCase().endsWith('.apk')) {
      fs.unlinkSync(uploadedFile.filepath);
      return res.status(400).json({ error: 'File must be an APK file' });
    }

    // 这里需要将文件上传到实际的服务器
    // 由于Vercel是无状态的，我们需要通过API调用将文件传输到您的服务器
    
    // 模拟成功响应
    const fileSize = (uploadedFile.size / 1024 / 1024).toFixed(2);
    
    // 清理临时文件
    fs.unlinkSync(uploadedFile.filepath);
    
    res.json({
      success: true,
      message: 'APK上传成功！',
      details: `文件大小: ${fileSize} MB\n注意：此版本为演示版本，实际部署需要配置服务器端处理`
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: `上传失败: ${error.message}` 
    });
  }
}
