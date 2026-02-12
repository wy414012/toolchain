# 修复 CI 错误的更新

## 问题

1. **install_nightly** - Error: The process '/home/runner/.cargo/bin/rustup' failed with exit code 1
   - 错误信息: `error: invalid value 'clippy' for '[TOOLCHAIN]...': invalid toolchain name: 'clippy'`

2. **install_stable_in_docker** - Error: Unable to locate executable file: rustup
   - Docker 容器中没有预装的 rustup,安装失败

## 修复内容

### 1. 修复 rustup 组件参数格式 (install_nightly)
**问题**: 之前使用 `-c ...components` 扩展语法,导致命令变成:
```bash
rustup toolchain install nightly -c rustfmt clippy --allow-downgrade
```
这会被解析为 toolchain 名称是 `rustfmt`,另一个 toolchain 名称是 `clippy`。

**修复**: 使用循环为每个组件单独添加 `-c` 参数:
```typescript
if (options?.components && options.components.length > 0) {
    for (const component of options.components) {
        args.push("-c", component);
    }
}
```
生成的正确命令:
```bash
rustup toolchain install nightly -c rustfmt -c clippy --allow-downgrade
```

### 2. 修复 rustup 安装方法 (install_stable_in_docker)
**问题**: 之前使用错误的安装方法,`input` 参数不能这样使用:
```typescript
await exec.exec("sh", ["-s", "--", "-y", "--default-toolchain", "none"], {
    input: Buffer.from(`curl -fsSL ${installerUrl}`),
});
```

**修复**: 使用正确的下载并执行方法:
```typescript
await exec.exec("sh", [
    "-c",
    `curl -fsSL ${installerUrl} | sh -s -- -y --default-toolchain none`,
]);
```

并且添加 PATH 环境变量更新:
```typescript
const cargoPath = process.env.HOME || (os.platform() === "win32" ? process.env.USERPROFILE : undefined);
if (cargoPath) {
    const cargoBin = `${cargoPath}/.cargo/bin`;
    const currentPath = process.env.PATH || "";
    if (!currentPath.includes(cargoBin)) {
        core.addPath(cargoBin);
    }
}
```

### 3. 修复 rustup 命令语法
- 将 `rustup install` 更改为 `rustup toolchain install`
- 添加 `--profile` 参数支持,直接在安装时设置 profile
- 添加 `--allow-downgrade` 支持(用于 nightly + 组件的情况)

### 4. 修复版本检查逻辑
- 实现 `execCapture` 方法来捕获命令输出
- 从 `rustup --version` 解析版本号来确定支持的功能

## 测试结果

✅ 所有测试通过 (6/6)
✅ 构建成功 (dist/index.js: 484KB)
✅ TypeScript 编译通过
✅ ESLint 检查通过

## 预期效果

修复后,CI 工作流应该:
- ✅ `install_nightly` 正确安装 nightly 工具链和组件
- ✅ `install_stable_in_docker` 正确安装 rustup 并使用它
- ✅ 不再显示 `set-output is deprecated` 警告
- ✅ 所有测试 job 成功通过
