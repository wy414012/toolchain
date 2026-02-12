# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-12

### Added
- 完全重写,移除已废弃的 `@actions-rs/core` 依赖
- 添加本地 `RustUp` 类实现
- 添加 `--allow-downgrade` 支持
- 添加 `--profile` 参数直接在安装时设置
- 添加 `core.exportVariable()` 以支持环境变量导出

### Changed
- **BREAKING**: 运行时从 Node.js 12 升级到 Node.js 20
- **BREAKING**: 最低 Node.js 版本要求升级到 20
- 将 `@actions/core` 从 v1.2.6 升级到 v1.10.1
- 将所有开发依赖升级到最新稳定版本
- 改进 rustup 安装逻辑,支持 Docker 容器
- 修复组件安装参数格式(每个组件需要单独的 `-c` 参数)

### Fixed
- 修复 24 个 "set-output is deprecated" 警告
- 修复 CI 中 `install_nightly` 错误
- 修复 CI 中 `install_stable_in_docker` 错误
- 修复 ESLint 配置兼容性问题
- 修复 TypeScript 类型错误

### Removed
- 移除 `@actions-rs/core` 依赖(已废弃)
- 移除 GitHub Packages registry 配置

## [1.0.6] - 2020-03-24

### Added

- Pass `allow-downgrade` flag to `rustup` if `nightly` toolchain with components requested

## [1.0.5] - 2020-01-26

### Fixed

- `rustup` version parser does not fail Action execution on `macOS-latest` VM images anymore

## [1.0.4] - 2020-01-26

### Added

- Support for the `rust-toolchain` file: If the toolchain input is not given, we will try and install the version specified in the `rust-toolchain` file.
- Action outputs with `rustc`, `cargo` and `rustup` versions installed

## [1.0.3] - 2019-10-19

### Added

- Support for `rustup set profile` command
- Support for `--component` flag for the `rustup toolchain install` command

## [1.0.2] - 2019-10-14

### Changed

- Missing `rustup` executable will not raise an annotating warning before the installation anymore (#13)

## [1.0.1] - 2019-10-05

### Changed

- `target` input is not used as a `--default-target` argument for `rustup` anymore (#8)

## [1.0.0] - 2019-09-15

### Added

- First public version
