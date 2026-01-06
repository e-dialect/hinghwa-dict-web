# hinghwa-dict-web

## 项目简介

兴化语记是 [E方言](https://edialect.top) 中`莆仙方言公共服务包` 的别称，主要服务对象包括福建省莆田市及其周边地区的莆仙方言使用者。

兴化语记目前包括网页端 ( https://pxm.edialect.top , https://hinghwa.cn )，微信小程序端（兴化语记），计划在本项目中通过 `uni-app` 增加移动端 ( https://m.pxm.edialect.top )，QQ小程序端等。

## 技术栈

> 项目采取前后端分离架构，其他的前端仓库可前往 https://github.com/e-dialect 进行寻找

采用 `Vue2` + `Ant Design of Vue` 开发。

## 移动端自动跳转

本项目实现了智能的移动端自动跳转功能，会根据设备类型和屏幕宽度自动跳转到移动版网站 (https://m.hinghwa.cn)。

### 跳转逻辑

系统会同时检查两个条件，只有当**两者都满足**时才会跳转到移动版：
1. **设备识别**：User-Agent 识别为移动设备（iPhone、iPod、Android 等）
2. **屏幕宽度**：视口宽度 ≤ 768px（实际为竖屏模式）

### 使用场景

- ✅ 手机竖屏访问 → 自动跳转到移动版
- ✅ 手机"桌面模式"（宽视口）→ 保持桌面版（不跳转）
- ✅ 平板/桌面浏览器 → 保持桌面版
- ✅ 用户可选择始终使用桌面版

### 如何强制使用桌面版

如果您在移动设备上希望始终使用桌面版，可以：

1. 在任意 URL 后添加 `?desktop=1` 参数，例如：
   ```
   https://hinghwa.cn?desktop=1
   https://hinghwa.cn/search?desktop=1
   ```

2. 系统会记住您的选择，之后访问时不会再自动跳转

3. 如需恢复自动跳转，只需清除本网站在浏览器 localStorage 中保存的该偏好设置（键名为 `preferDesktopSite`）即可，无需清空全部 localStorage
