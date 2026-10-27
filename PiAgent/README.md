# Pi Agent

`upstream/` 是 Pi 官方源码的 Git 子模块，跟踪 `stable` 分支，由主仓库固定具体提交。
实际启动使用与子模块版本一致的官方 npm 发布包，安装在本目录的 `node_modules` 中；启动器会核对两者版本。
这样可以阅读和更新源码，同时省去完整 monorepo 的本机编译。
Pi 1.4.0 原始依赖固定了存在已知漏洞的 undici 8.10.2，本工作区通过 npm overrides 使用修复版本 8.12.2。

## 启动

在 PowerShell 中运行：

```powershell
cd E:\SoftApp\AI\PiAgent
.\pi.cmd
```

也可以运行 `npm.cmd run pi`。这些入口把工作目录固定到本目录，将 Pi 的配置、登录凭据和会话保存在 `.pi-agent` 中。

首次启动后，输入 `/login` 连接模型服务商，再用 `/model` 选择模型。安装 Pi 本身不会提供模型或 API 额度。

检查安装：

```powershell
.\pi.cmd --version
.\pi.cmd --help
```

## 连接 Ollama

Ollama 负责运行模型，Pi 负责与模型交互、读取文件和执行工具。Ollama 主要用于推理；训练算法仍需要 Python / PyTorch 等工具。

`config/models.ollama.example.json` 是未启用的连接模板。Ollama 准备好后：

1. 用 `ollama list` 获取实际模型名称；作为 Agent 使用的模型需要支持工具调用。
2. 复制模板到 `.pi-agent/models.json`，将占位模型名改为实际名称。已有 models.json 时合并配置，不要覆盖已有服务商。
3. 启动 Pi，输入 `/model` 选择 Ollama 模型。

本机 Ollama 默认使用 `http://127.0.0.1:11434/v1`。若 Ollama 部署在自己的云服务器，可以通过 SSH 隧道连接：

```powershell
ssh -N -L 11434:127.0.0.1:11434 用户名@服务器地址
```

保持隧道终端开启，Pi 仍使用模板中的本机地址。这样无需将 Ollama 的默认无认证接口直接开放到公网。

Ollama 官方云模型是另一种方式：使用官方账号和 API，不需要自己租 GPU 服务器。其鉴权和模型名称与上述自建服务模板不同，按实际选用方式另行配置。

## 首次安装和更新

克隆主仓库后，在本目录安装与子模块对应的运行包：

```powershell
.\setup.cmd
```

先退出正在运行的 Pi 会话，再更新到官方最新 stable 并同步运行包：

```powershell
.\update.cmd
```

更新完成后，在父仓库提交 `PiAgent/upstream`、`PiAgent/package.json` 和 `PiAgent/package-lock.json`，再推送。
仅执行 `git submodule update --remote` 会改变源码提交；此后要运行 `setup.cmd` 同步运行包。
setup/update 会保留已有 `.pi-agent` 配置和凭据；首次安装使用 `config` 下的模板。
如果更新中断，重新运行 `setup.cmd` 完成当前子模块版本的安装。

`.pi-agent`、`.npm-cache`、`node_modules` 和环境变量文件已加入 `.gitignore`。不要分享 `.pi-agent/auth.json`，其中可能保存登录凭据。

官方资料：[Pi](https://pi.dev/) · [Pi 模型配置](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md) · [Ollama](https://docs.ollama.com/) · [Ollama Cloud](https://docs.ollama.com/cloud)
