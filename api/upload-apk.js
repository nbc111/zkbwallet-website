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
      limit: '10MB',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 检查请求体大小
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: '文件太大',
        message: `文件大小 ${(contentLength / 1024 / 1024).toFixed(2)} MB 超过了 10 MB 限制`,
        limit: '10MB',
        received: `${(contentLength / 1024 / 1024).toFixed(2)} MB`
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
