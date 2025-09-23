const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3001;

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/');
    },
    filename: function (req, file, cb) {
        cb(null, `zkbwallet-${Date.now()}.apk`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/vnd.android.package-archive' || 
            path.extname(file.originalname).toLowerCase() === '.apk') {
            cb(null, true);
        } else {
            cb(new Error('只允许上传APK文件！'), false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB限制
    }
});

// 静态文件服务
app.use(express.static('public'));

// 上传APK接口
app.post('/upload-apk', upload.single('apk'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '没有上传文件' });
    }

    const uploadedFile = req.file.path;
    const updateScript = '/usr/local/bin/update-apk.sh';

    // 执行更新脚本
    exec(`${updateScript} ${uploadedFile}`, (error, stdout, stderr) => {
        // 清理临时文件
        fs.unlink(uploadedFile, (err) => {
            if (err) console.error('清理临时文件失败:', err);
        });

        if (error) {
            console.error('更新APK失败:', error);
            return res.status(500).json({ 
                error: `更新失败: ${error.message}` 
            });
        }

        console.log('APK更新成功:', stdout);
        res.json({ 
            success: true, 
            message: 'APK更新成功！',
            details: stdout
        });
    });
});

// 获取当前APK信息
app.get('/apk-info', (req, res) => {
    const apkPath = '/var/www/apk-downloads/zkbwallet.apk';
    
    fs.stat(apkPath, (err, stats) => {
        if (err) {
            return res.status(404).json({ error: 'APK文件不存在' });
        }

        res.json({
            size: stats.size,
            sizeFormatted: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
            lastModified: stats.mtime,
            downloadUrl: 'https://206.238.196.207:36345/down/zkbwallet.apk'
        });
    });
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`APK上传服务运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}/upload-apk.html`);
});
