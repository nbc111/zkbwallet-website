const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
      if (fs.existsSync(uploadedFile.filepath)) {
        fs.unlinkSync(uploadedFile.filepath);
      }
      return res.status(400).json({ error: 'File must be an APK file' });
    }

    // 模拟成功响应
    const fileSize = (uploadedFile.size / 1024 / 1024).toFixed(2);
    
    // 清理临时文件
    if (fs.existsSync(uploadedFile.filepath)) {
      fs.unlinkSync(uploadedFile.filepath);
    }
    
    return res.status(200).json({
      success: true,
      message: 'APK上传成功！',
      details: `文件大小: ${fileSize} MB\n注意：此版本为演示版本，实际部署需要配置服务器端处理`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: `上传失败: ${error.message}` 
    });
  }
}
