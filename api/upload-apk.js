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
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 简化的处理逻辑，先测试基本功能
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
