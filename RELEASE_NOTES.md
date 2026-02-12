# Release 2.0.0

这是一个主要版本更新,包含了大量的改进和 bug 修复。

## 🚀 主要变更

### 运行时升级
- **Node.js 12 → Node.js 20**: 更新 GitHub Actions 运行时到最新版本
- **最低 Node.js 版本**: 现在要求 Node.js >= 20

### 依赖重写
- 完全移除已废弃的 `@actions-rs/core` 包
- 使用本地实现的 `RustUp` 类替代
- 升级所有 `@actions/*` 包到最新稳定版本

## 🎯 新增功能

- 改进的 rustup 安装逻辑,支持 Docker 容器
- 自动添加 `~/.cargo/bin` 到 PATH
- 同时导出环境变量和 action outputs
- 改进的组件安装支持

## 🐛 修复的问题

- ✅ 修复 24 个 "set-output is deprecated" 警告
- ✅ 修复 `install_nightly` CI 错误
- ✅ 修复 `install_stable_in_docker` CI 错误
- ✅ 修复组件参数格式问题
- ✅ 修复 ESLint 和 TypeScript 兼容性问题

## 📝 使用方法

### 基本使用
```yaml
- uses: wy414012/toolchain@v2
  with:
    toolchain: stable
```

### 使用 profile 和组件
```yaml
- uses: wy414012/toolchain@v2
  with:
    profile: minimal
    toolchain: nightly
    components: rustfmt, clippy
```

### 设置默认 toolchain
```yaml
- uses: wy414012/toolchain@v2
  with:
    toolchain: stable
    default: true
```

## 🔧 迁移指南

从 v1 迁移到 v2 非常简单,只需更改版本号:

```yaml
# 之前
- uses: wy414012/toolchain@v1

# 现在
- uses: wy414012/toolchain@v2
```

所有现有配置和参数都保持兼容!

## 📦 安装

```bash
# 使用 npm
npm install wy414012/toolchain@v2

# 或者在 GitHub Actions 中直接引用
- uses: wy414012/toolchain@v2
```

## 🙏 致谢

感谢所有贡献者和用户的反馈!

---

完整变更日志请查看 [CHANGELOG.md](CHANGELOG.md)
