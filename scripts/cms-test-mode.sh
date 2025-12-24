#!/bin/bash

# CMS 测试模式切换脚本
# 用于快速切换 CMS 配置到测试模式

ADMIN_DIR="public/admin"
CONFIG_FILE="$ADMIN_DIR/config.yml"
BACKUP_FILE="$ADMIN_DIR/config.yml.backup"
TEST_FILE="$ADMIN_DIR/config-simple.yml"

echo "🔧 CMS 配置切换工具"
echo "===================="
echo ""

# 检查是否在项目根目录
if [ ! -d "$ADMIN_DIR" ]; then
    echo "❌ 错误: 未找到 public/admin 目录"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 显示菜单
echo "请选择操作："
echo "1) 切换到测试模式 (无需 OAuth)"
echo "2) 切换到生产模式"
echo "3) 切换到本地开发模式"
echo "4) 查看当前配置"
echo "5) 退出"
echo ""
read -p "输入选项 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📦 切换到测试模式..."

        # 备份当前配置
        if [ -f "$CONFIG_FILE" ] && [ ! -f "$BACKUP_FILE" ]; then
            cp "$CONFIG_FILE" "$BACKUP_FILE"
            echo "✅ 已备份当前配置到 config.yml.backup"
        fi

        # 使用测试配置
        cp "$TEST_FILE" "$CONFIG_FILE"
        echo "✅ 已切换到测试模式"
        echo ""
        echo "📝 测试模式特点:"
        echo "   - 无需 OAuth 认证"
        echo "   - 可预览 CMS 界面"
        echo "   - 更改不会保存到 GitHub（仅本地预览）"
        echo ""
        echo "🌐 现在可以访问: http://localhost:3000/admin/ (开发模式)"
        echo "   或: https://qiankemeng.github.io/admin/ (部署后)"
        ;;

    2)
        echo ""
        echo "🚀 切换到生产模式..."

        if [ ! -f "$BACKUP_FILE" ]; then
            echo "❌ 未找到备份配置文件"
            echo "请确保 config.yml.backup 存在"
            exit 1
        fi

        cp "$BACKUP_FILE" "$CONFIG_FILE"
        echo "✅ 已恢复生产配置"
        echo ""
        echo "⚠️  生产模式需要配置 Netlify Identity"
        echo "详情请查看: CMS_SETUP.md"
        ;;

    3)
        echo ""
        echo "💻 切换到本地开发模式..."

        # 备份当前配置
        if [ -f "$CONFIG_FILE" ] && [ ! -f "$BACKUP_FILE" ]; then
            cp "$CONFIG_FILE" "$BACKUP_FILE"
            echo "✅ 已备份当前配置"
        fi

        # 使用本地配置
        cp "$ADMIN_DIR/config-local.yml" "$CONFIG_FILE"
        echo "✅ 已切换到本地开发模式"
        echo ""
        echo "📝 本地模式使用步骤:"
        echo "   1. 在终端运行: npx decap-server"
        echo "   2. 在另一个终端运行: npm run dev"
        echo "   3. 访问: http://localhost:3000/admin/"
        echo ""
        echo "💡 本地模式会直接编辑你的本地文件"
        ;;

    4)
        echo ""
        echo "📄 当前配置:"
        echo "===================="
        head -20 "$CONFIG_FILE"
        echo "..."
        echo ""

        # 检测后端类型
        backend=$(grep "name:" "$CONFIG_FILE" | head -1 | awk '{print $2}')
        echo "🔍 后端类型: $backend"

        case $backend in
            "test-repo")
                echo "   状态: 测试模式 (数据不持久化)"
                ;;
            "github")
                echo "   状态: GitHub 直接认证 (需要 OAuth App)"
                ;;
            "git-gateway")
                echo "   状态: Git Gateway (需要 Netlify Identity)"
                ;;
            *)
                echo "   状态: 未知"
                ;;
        esac
        ;;

    5)
        echo "👋 再见!"
        exit 0
        ;;

    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "✨ 完成!"
