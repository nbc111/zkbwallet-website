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
    const websiteDir = '/var/www/zkbwallet';
    const targetFile = `${websiteDir}/zkbwallet.apk`;
    const backupDir = `${websiteDir}/backups`;

    try {
        // 创建备份目录
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // 备份当前APK（如果存在）
        if (fs.existsSync(targetFile)) {
            const backupName = `zkbwallet-backup-${Date.now()}.apk`;
            fs.copyFileSync(targetFile, `${backupDir}/${backupName}`);
            console.log(`已备份当前APK到: ${backupDir}/${backupName}`);
        }

        // 复制新APK文件
        fs.copyFileSync(uploadedFile, targetFile);

        // 设置权限
        exec(`chown www-data:www-data "${targetFile}" && chmod 644 "${targetFile}"`, (error) => {
            // 清理临时文件
            fs.unlink(uploadedFile, (err) => {
                if (err) console.error('清理临时文件失败:', err);
            });

            if (error) {
                console.error('设置权限失败:', error);
                return res.status(500).json({ 
                    error: `设置权限失败: ${error.message}` 
                });
            }

            const stats = fs.statSync(targetFile);
            const fileSize = (stats.size / 1024 / 1024).toFixed(2);

            console.log('APK更新成功');
            res.json({ 
                success: true, 
                message: 'APK更新成功！',
                details: `文件大小: ${fileSize} MB\n下载地址: http://206.238.197.207:8081/zkbwallet.apk`
            });
        });

    } catch (error) {
        // 清理临时文件
        fs.unlink(uploadedFile, (err) => {
            if (err) console.error('清理临时文件失败:', err);
        });

        console.error('更新APK失败:', error);
        res.status(500).json({ 
            error: `更新失败: ${error.message}` 
        });
    }
});

// 获取当前APK信息
app.get('/apk-info', (req, res) => {
    const apkPath = '/var/www/zkbwallet/zkbwallet.apk';
    
    fs.stat(apkPath, (err, stats) => {
        if (err) {
            return res.status(404).json({ error: 'APK文件不存在' });
        }

        res.json({
            size: stats.size,
            sizeFormatted: (stats.size / 1024 / 1024).toFixed(2) + ' MB',
            lastModified: stats.mtime,
            downloadUrl: 'http://206.238.197.207:8081/zkbwallet.apk'
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
