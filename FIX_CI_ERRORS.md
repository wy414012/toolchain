# 修复 CI 错误的更新

## 问题

1. **install_nightly** - Error: The process '/home/runner/.cargo/bin/rustup' failed with exit code 1
2. **install_stable_in_docker** - Error: Unable to locate executable file: rustup

## 修复内容

### 1. 修复 rustup 命令语法
- 将 `rustup install` 更改为 `rustup toolchain install`
- 将 `--component` 参数更改为 `-c` (短格式)
- 添加 `--profile` 参数支持,直接在安装时设置 profile

### 2. 简化 profile 设置逻辑
- 之前: 先调用 `rustup set profile`,再安装 toolchain
- 现在: 直接在 `rustup toolchain install` 命令中使用 `--profile` 参数

### 3. 修复组件安装
- 使用正确的组件参数格式: `-c component1 -c component2`
- 添加 `--allow-downgrade` 支持(用于 nightly + 组件的情况)

### 4. 修复版本检查逻辑
- 实现 `execCapture` 方法来捕获命令输出
- 从 `rustup --version` 解析版本号来确定支持的功能

### 5. 代码清理
- 移除重复的代码行
- 保持向后兼容性

## 测试结果

✅ 所有测试通过  
✅ 构建成功  
✅ TypeScript 编译通过  
✅ ESLint 检查通过

## 预期效果

修复后,CI 工作流中的 `install_nightly` 和 `install_stable_in_docker` 应该都能正常工作。
