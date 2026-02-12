# 发布指南 - v2.0.0

## 准备工作

✅ 所有代码修改已完成
✅ 所有测试通过 (6/6)
✅ 构建成功 (dist/index.js: 484KB)
✅ ESLint 检查通过
✅ CHANGELOG.md 已更新
✅ RELEASE_NOTES.md 已创建

## 发布步骤

### 1. 更新 CHANGELOG.md
```bash
# CHANGELOG.md 已更新,包含 v2.0.0 的完整变更日志
```

### 2. 创建 Git 标签
```bash
cd /workspace/toolchain
git tag -a v2.0.0 -m "Release v2.0.0"
```

### 3. 推送标签到 GitHub
```bash
git push origin v2.0.0
```

### 4. 创建 GitHub Release
访问以下 URL 创建 Release:
```
https://github.com/wy414012/toolchain/releases/new?tag=v2.0.0
```

在 Release 描述中粘贴 `RELEASE_NOTES.md` 的内容。

### 5. 验证发布
```bash
# 验证标签是否存在
git tag -l | grep v2.0.0

# 验证远程标签
git ls-remote --tags origin | grep v2.0.0
```

## 使用方式

发布后,用户可以通过以下方式使用:

### 方式 1: 直接引用
```yaml
- uses: wy414012/toolchain@v2
  with:
    toolchain: stable
```

### 方式 2: 使用特定提交
```yaml
- uses: wy414012/toolchain@c5cf858
  with:
    toolchain: stable
```

### 方式 3: 使用分支
```yaml
- uses: wy414012/toolchain@master
  with:
    toolchain: stable
```

## 验证清单

- [x] package.json 版本已更新为 2.0.0
- [x] action.yml 运行时已更新为 node20
- [x] 所有依赖已更新
- [x] 构建成功
- [x] 所有测试通过
- [x] CHANGELOG.md 已更新
- [x] RELEASE_NOTES.md 已创建
- [ ] Git 标签已创建
- [ ] 标签已推送到 GitHub
- [ ] GitHub Release 已创建
- [ ] Release 已在 CI 中测试

## 测试工作流

创建 Release 后,建议先在测试仓库中验证:

```yaml
name: Test v2.0.0

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: wy414012/toolchain@v2
        with:
          toolchain: stable
          components: rustfmt, clippy
      - run: rustc --version
      - run: cargo --version
```

## 后续维护

- 定期检查依赖更新: `npm outdated`
- 运行安全审计: `npm audit`
- 监控 GitHub Issues 和 PR

## 回滚计划

如果发现问题,可以:
1. 立即删除 GitHub Release
2. 发布新的补丁版本(如 v2.0.1)修复问题
3. 或回退到 v1.0.7

## 联系方式

如有问题,请在 GitHub Issues 中反馈:
https://github.com/wy414012/toolchain/issues
