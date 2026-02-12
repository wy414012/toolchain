# Action 名称更新 - setup-rust-toolchain

## 变更

由于 GitHub 要求 action 名称必须唯一,不能与现有的组织/用户名冲突,已将 action 名称从 `rust-toolchain` 更改为 `setup-rust-toolchain`。

## 新的使用方式

### 使用 v2 标签(需要创建 Release)
```yaml
- uses: wy414012/toolchain@v2
  with:
    toolchain: stable
```

### 使用 master 分支(推荐,包含最新修复)
```yaml
- uses: wy414012/toolchain@master
  with:
    toolchain: stable
```

### 使用特定提交
```yaml
- uses: wy414012/toolchain@d217954
  with:
    toolchain: stable
```

## 完整配置示例

### 基本使用
```yaml
- uses: wy414012/toolchain@master
  with:
    toolchain: stable
```

### 使用 profile 和组件
```yaml
- uses: wy414012/toolchain@master
  with:
    profile: minimal
    toolchain: nightly
    components: rustfmt, clippy
```

### 设置默认 toolchain
```yaml
- uses: wy414012/toolchain@master
  with:
    toolchain: stable
    default: true
```

### 使用 toolchain 文件
```yaml
- uses: wy414012/toolchain@master
```

## 从旧版本迁移

### 如果之前使用 actions-rs/toolchain
```yaml
# 之前
- uses: actions-rs/toolchain@v1

# 现在
- uses: wy414012/toolchain@master
```

所有参数和配置保持兼容!

## 发布 v2 Release

发布 v2.0.0 后,用户可以使用:
```yaml
- uses: wy414012/toolchain@v2
```

创建 Release 步骤:
1. 访问: https://github.com/wy414012/toolchain/releases/new
2. 选择标签: `v2.0.0`
3. 标题: `Release v2.0.0 - setup-rust-toolchain`
4. 粘贴 RELEASE_NOTES.md 的内容
5. 点击 "Publish release"
