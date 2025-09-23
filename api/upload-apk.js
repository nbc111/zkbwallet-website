export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'APK上传API正在运行',
      limit: '4.5MB',
      note: 'Vercel serverless函数有严格限制',
      recommendation: '建议使用 /api/upload-to-server 接口或直接上传到服务器',
      serverUpload: 'http://206.238.197.207:3333/upload-apk.html',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查请求体大小
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB (Vercel实际限制)
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: '文件太大',
        message: `文件大小 ${(contentLength / 1024 / 1024).toFixed(2)} MB 超过了 4.5 MB 限制`,
        limit: '4.5MB',
        received: `${(contentLength / 1024 / 1024).toFixed(2)} MB`,
        suggestion: '请使用SCP/SFTP直接上传到服务器或压缩APK文件'
      });
    }

    // 简化的处理逻辑
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ 
        error: 'Content-Type must be multipart/form-data',
        received: contentType
      });
    }

    // 模拟成功响应
    return res.status(200).json({
      success: true,
      message: 'APK上传成功！',
      details: '文件已接收，此版本为演示版本',
      fileSize: `${(contentLength / 1024 / 1024).toFixed(2)} MB`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: `上传失败: ${error.message}`,
      timestamp: new Date().toISOString()
    });
  }
}
