# AIImprintFlux

机器学习、模型训练、算法与 AI 工具的个人学习仓库。

```text
AI/
├── PiAgent/              Pi 的启动、配置模板和更新脚本
│   └── upstream/         Pi 官方源码 Git 子模块，跟踪 stable 分支
├── Ollama/               模型部署相关配置与记录
├── AIProject/            AI 实验与项目
└── Node笔记/             Node.js 学习笔记
```

## 获取仓库

```powershell
git clone --recurse-submodules https://github.com/ZhangChen429/AIImprintFlux.git
cd AIImprintFlux
.\PiAgent\setup.cmd
.\PiAgent\pi.cmd
```

需要 Git、Node.js 22.19 或更新版本以及 npm。Windows 下 Pi 的 Bash 工具使用 Git for Windows。
首次启动后用 `/login` 连接模型服务商，再用 `/model` 选择模型。

## 更新 Pi

先退出正在运行的 Pi 会话（Windows 会锁住运行中的原生库），再在仓库根目录执行：

```powershell
.\PiAgent\update.cmd
git diff --submodule=short
git add PiAgent/upstream PiAgent/package.json PiAgent/package-lock.json
git commit -m "chore: update Pi stable release"
git push
```

`update.cmd` 更新官方 stable 子模块，并安装源码版本对应的官方 npm 运行包。源码用于查看、学习和锁定版本；实际启动使用发布包，无需在本机编译完整 monorepo。
父仓库记录子模块的具体提交，因此其他机器能恢复相同源码版本。更新脚本不会自动提交或推送。

已有克隆同步本仓库时：

```powershell
git pull --recurse-submodules
git submodule update --init --recursive
.\PiAgent\setup.cmd
```

Pi 登录凭据、会话、安装依赖、模型权重和缓存均留在本地，不提交到 GitHub。
配置与启动详见 [PiAgent/README.md](PiAgent/README.md)。
