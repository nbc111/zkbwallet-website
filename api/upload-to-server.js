const formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

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

    // 将文件转发到您的服务器
    const formData = new FormData();
    formData.append('apk', fs.createReadStream(uploadedFile.filepath), {
      filename: uploadedFile.originalFilename,
      contentType: 'application/vnd.android.package-archive'
    });

    // 调用您的服务器API
    const serverResponse = await fetch('http://206.238.197.207:3333/upload-apk', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await serverResponse.json();
    
    // 清理临时文件
    fs.unlinkSync(uploadedFile.filepath);
    
    if (serverResponse.ok) {
      res.json(result);
    } else {
      res.status(500).json({ error: result.error || '服务器处理失败' });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: `上传失败: ${error.message}` 
    });
  }
}
