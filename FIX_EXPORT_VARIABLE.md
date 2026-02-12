# 修复 exportVariable 问题

## 问题

当用户尝试使用 cargo 或其他 rust 工具时,出现错误:
```
error: could not execute process `1.93.0 (254b59607 2026-01-19) -vV` (never executed)
Caused by:
  program not found
```

## 根本原因

在 `src/versions.ts` 中,我错误地使用了 `core.exportVariable()` 来导出版本字符串:

```typescript
core.exportVariable("RUSTC", "1.93.0 (254b59607 2026-01-19)");
core.exportVariable("CARGO", "1.93.0 (083ac5135 2025-12-15)");
core.exportVariable("RUSTUP", "1.28.2 (e4f3ad6f8 2025-04-28)");
```

这会覆盖系统环境变量 `RUSTC`、`CARGO`、`RUSTUP`,这些变量本应指向可执行文件的路径,而不是版本字符串。

当后续步骤尝试执行 `cargo build` 时,它会尝试使用 `CARGO` 环境变量的值 `"1.93.0..."` 作为命令,导致 "program not found" 错误。

## 修复

移除所有 `core.exportVariable()` 调用,只保留 `core.setOutput()`:

```typescript
// 之前
core.setOutput("rustc", version.long);
core.exportVariable("RUSTC", version.long);  // ❌ 错误!

// 现在
core.setOutput("rustc", version.long);  // ✅ 正确
```

## GitHub Actions 的正确用法

### core.setOutput()
用于在步骤之间传递数据:
```typescript
core.setOutput("rustc", "1.93.0 ...");
// 在后续步骤中可以通过 ${{ steps.toolchain.outputs.rustc }} 访问
```

### core.exportVariable()
用于导出环境变量给后续步骤使用:
```typescript
core.exportVariable("MY_VAR", "some value");
// 在后续步骤中可以通过 $MY_VAR 访问
```

**重要**: 不要使用与系统命令同名环境变量(如 RUSTC, CARGO),因为这会覆盖命令路径!

## 验证

修复后,以下工作流应该正常工作:

```yaml
- uses: wy414012/toolchain@master
  id: toolchain
  with:
    toolchain: stable

- name: Build
  run: cargo build --release
  # cargo 命令现在可以正常工作,不会被版本字符串覆盖
```

## 提交信息

```
fix: remove exportVariable to avoid overriding command paths

Removes core.exportVariable() calls that were setting RUSTC, CARGO, 
and RUSTUP environment variables to version strings instead of command paths.
This was causing commands like 'cargo' to fail with 'program not found' errors.
```

## 测试

- ✅ 单元测试通过
- ✅ 集成测试通过
- ✅ CI 工作流测试通过
