#!/bin/bash

# ZKBWallet APK 更新脚本
# 使用方法: ./update-apk.sh /path/to/new/apk/file.apk

# 检查参数
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <新APK文件路径>"
    echo "示例: $0 /tmp/zkbwallet-v2.0.apk"
    exit 1
fi

NEW_APK="$1"
WORK_DIR="/var/www/zkbwallet"
FIXED_APK_PATH="$WORK_DIR/zkbwallet.apk"
BACKUP_DIR="$WORK_DIR/backups"

# 检查新APK文件是否存在
if [ ! -f "$NEW_APK" ]; then
    echo "错误: 文件 '$NEW_APK' 不存在"
    exit 1
fi

# 检查文件是否为APK格式
if [[ ! "$NEW_APK" =~ \.apk$ ]]; then
    echo "错误: 文件必须是APK格式"
    exit 1
fi

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份当前APK（如果存在）
if [ -f "$FIXED_APK_PATH" ]; then
    BACKUP_NAME="zkbwallet-backup-$(date +%Y%m%d-%H%M%S).apk"
    cp "$FIXED_APK_PATH" "$BACKUP_DIR/$BACKUP_NAME"
    echo "已备份当前APK到: $BACKUP_DIR/$BACKUP_NAME"
fi

# 复制新APK文件
cp "$NEW_APK" "$FIXED_APK_PATH"

# 设置正确的权限
chown www-data:www-data "$FIXED_APK_PATH"
chmod 644 "$FIXED_APK_PATH"

# 获取文件信息
FILE_SIZE=$(du -h "$FIXED_APK_PATH" | cut -f1)
echo "APK更新成功!"
echo "文件路径: $FIXED_APK_PATH"
echo "文件大小: $FILE_SIZE"
echo "下载地址: http://206.238.197.207:8081/zkbwallet.apk"

# 清理旧备份（保留最近5个）
cd "$BACKUP_DIR"
ls -t zkbwallet-backup-*.apk 2>/dev/null | tail -n +6 | xargs -r rm
echo "已清理旧备份文件"
