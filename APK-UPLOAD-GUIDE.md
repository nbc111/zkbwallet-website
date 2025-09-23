# ZKBWallet APK上传指南

## 概述

本系统提供了多种方式让开发人员上传和更新APK文件，同时保持下载地址不变。

## 固定下载地址

**APK下载地址**: `https://206.238.197.207:36345/down/zkbwallet.apk`

这个地址永远不会改变，无论APK文件如何更新。

## 上传方式

### 方式1：使用SCP/SFTP（推荐）

#### 步骤：
1. **上传APK文件到服务器**：
```bash
scp /path/to/your/app.apk root@206.238.197.207:/tmp/
```

2. **SSH登录服务器并执行更新**：
```bash
ssh root@206.238.197.207
/usr/local/bin/update-apk.sh /tmp/app.apk
```

#### 使用SFTP客户端：
- **主机**: `206.238.197.207`
- **用户名**: `root`
- **密码**: `Tk%Cv7AgMwpIv&Z`
- **上传到**: `/tmp/` 目录
- **然后SSH执行**: `/usr/local/bin/update-apk.sh /tmp/your-file.apk`

### 方式2：使用Web上传界面

#### 部署Web上传服务：

1. **在服务器上安装Node.js**：
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

2. **部署上传服务**：
```bash
# 创建上传服务目录
mkdir -p /var/www/apk-uploader
cd /var/www/apk-uploader

# 复制文件
cp /path/to/upload-server.js .
cp /path/to/package.json .
cp /path/to/upload-apk.html ./public/

# 安装依赖
npm install

# 创建systemd服务
cat > /etc/systemd/system/apk-uploader.service << EOF
[Unit]
Description=ZKBWallet APK Uploader
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/apk-uploader
ExecStart=/usr/bin/node upload-server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl enable apk-uploader
systemctl start apk-uploader
```

3. **访问上传界面**：
   - 地址: `http://206.238.197.207:3001/upload-apk.html`
   - 支持拖拽上传
   - 自动验证APK格式
   - 实时显示上传进度

### 方式3：使用GitHub Actions（自动化）

创建 `.github/workflows/upload-apk.yml`：

```yaml
name: Upload APK

on:
  workflow_dispatch:
    inputs:
      apk_path:
        description: 'APK文件路径'
        required: true
        default: 'app-release.apk'

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Upload APK
        run: |
          scp ${{ github.workspace }}/${{ github.event.inputs.apk_path }} root@206.238.197.207:/tmp/
          ssh root@206.238.197.207 "/usr/local/bin/update-apk.sh /tmp/${{ github.event.inputs.apk_path }}"
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

## 更新脚本功能

`/usr/local/bin/update-apk.sh` 脚本提供以下功能：

- ✅ **文件格式验证**：确保上传的是APK文件
- ✅ **自动备份**：更新前自动备份当前版本
- ✅ **权限设置**：自动设置正确的文件权限
- ✅ **版本管理**：保留最近5个备份版本
- ✅ **错误处理**：详细的错误信息和回滚机制

## 安全考虑

1. **访问控制**：
   - Web上传界面建议添加身份验证
   - 限制上传文件大小（默认100MB）
   - 验证文件格式

2. **备份策略**：
   - 自动备份旧版本
   - 保留最近5个版本
   - 支持快速回滚

3. **监控**：
   - 上传日志记录
   - 文件变更通知
   - 健康检查接口

## 故障排除

### 常见问题：

1. **权限错误**：
```bash
chown www-data:www-data /var/www/apk-downloads/zkbwallet.apk
chmod 644 /var/www/apk-downloads/zkbwallet.apk
```

2. **服务未启动**：
```bash
systemctl status apk-uploader
systemctl restart apk-uploader
```

3. **磁盘空间不足**：
```bash
df -h
# 清理旧备份
rm /var/www/apk-downloads/backups/zkbwallet-backup-*.apk
```

## 联系信息

如有问题，请联系开发团队或查看服务器日志：
```bash
journalctl -u apk-uploader -f
```
