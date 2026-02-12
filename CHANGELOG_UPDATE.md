# 更新日志 - v2.0.0

## 重大变更

### 依赖升级
- 将 `@actions/core` 从 v1.2.6 升级到 v1.10.1
- 将 `@actions/exec` 从 v1.0.4 升级到 v1.1.1
- 将 `@actions/io` 从 v1.0.2 升级到 v1.1.3
- 移除了已废弃的 `@actions-rs/core` 依赖,使用本地的 RustUp 实现

### Node.js 运行时
- 将 GitHub Actions 运行时从 `node12` 升级到 `node20`

### 代码变更
- 将 `core.setOutput()` 替换为 `core.setOutput()` 和 `core.exportVariable()` 的组合
  - `core.setOutput()` 用于向后兼容
  - `core.exportVariable()` 用于导出环境变量
- 创建了本地的 `RustUp` 类替代已废弃的 `@actions-rs/core`
- 更新了所有 TypeScript 类型以匹配新的依赖版本

### CI 工作流修复
- 修复了所有 "set-output is deprecated" 警告
- 修复了 Node.js 12 不再支持的警告
- 确保与现代 GitHub Actions 兼容

### 测试
- 所有现有测试通过
- 确保向后兼容性

## 迁移说明
此更新保持了向后兼容性。所有现有的 action 使用方式继续有效。
