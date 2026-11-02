# ImprintFlux 个人主页

这是用于自有域名与星辰云空间的静态前端，无数据库、构建步骤或第三方 CDN。公开名称暂用 ImprintFlux，未添加未经提供的履历、联系方式、项目客户或业务指标。

## 上传

1. 先下载或备份空间中原有的 index.html。
2. 打开星辰云文件管理的 wwwroot。
3. 上传 imprintflux-home.zip，解压到当前目录。
4. 首页应直接为 wwwroot/index.html，同时存在 wwwroot/style.css 和 wwwroot/app.js。不要多套 imprintflux-home 文件夹。
5. 访问 http://imprintflux.asia，必要时 Ctrl+F5 刷新缓存。HTTPS 需要在空间面板另行配置证书。

也可将 imprintflux-home 目录内的三个文件分别上传。

## 修改

- index.html：个人介绍、项目说明与实现笔记。
- style.css：配色、版式和手机适配。
- app.js：三个项目的架构图、边界和细节文案。

## 内容依据

核对时间：2026-10-25。这里列出的是本次静态阅读依据，并非本次 UE 构建或运行验收。

- Plugins/FormScribe/ARCHITECTURE.md，修订 81；Source/FormScribe/Private/Entity/FormScribeEntityManager.cpp、Private/Manager/FormScribePresentationManager.cpp；Source/FormScribeEditor/Private/FormScribeToolEditorObject.cpp。
- Plugins/FormUSD/ARCHITECTURE.md，修订 41；FormUSD.uplugin；Source/FormScribeUSDEditor/Private/Document/FormUSDDocumentReader.cpp、Private/Import/FormUSDImporter.cpp，以及 Export 下材质清单与转换器实现。
- Plugins/JHPlatform/ARCHITECTURE.md，修订 84；Source/JHPlatform/JHPlatform.Build.cs、Private/JHPlatformActor/JHPlatformPointActor.cpp、Private/JHPlatformSubsystem/JHPlatformMessageHub.cpp。

架构图属于介绍性简化，并非完整类图。FormScribe 当前是向 ECS 演进的 UObject / 服务体系；FormUSD 每次导入重新生成 UE 实体身份；MaterialX 支持范围有限；Focus 移动 Pawn 并保持朝向。未公开源码内容、后端地址、凭据、个人认证信息或本地磁盘路径。

## 前端验证

已检查 JavaScript 语法、HTML ID 唯一性及资源存在性；本地浏览器检查首页与架构标签切换。UE 插件仅阅读，未改动或编译。本地预览不代表域名已上线。

## 第三版设计
参考 https://chenlizhe.cn/ 的个人介绍优先、项目索引和分层阅读思路，使用自己的项目文案与 IF 字母视觉。新增明暗主题、阅读进度和当前导航提示；未添加未知履历或联系方式。上传时更新三个文件，Ctrl+F5 刷新。


## 内容版 v4
新增张家琛姓名、工业设计教育背景、三段开发经历（日期冲突暂不展示），叙事工具研究和图片弹窗。人像来源：CreateAINode/简历/Snipaste_2026-05-06_09-56-46.png；研究配图来源：2077节点内容/image-2 Workspot.png、Scene/image-21.png。游戏编辑器图像仅作为研究对象说明。联系方式未加入。上传包现在包含 assets 文件夹，需一起上传，不能仅替换三个文件。

