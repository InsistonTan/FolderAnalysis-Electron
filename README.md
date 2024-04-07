1 简介

本项目基于 electron，实现简单的磁盘文件夹分析功能，可以查看每个文件夹占用存储的大小

2 运行项目

2.1 安装项目依赖组件： npm install

2.2 启动项目： npm start

2.3 打包： npm run make

3 界面效果图

首页界面：
![image](https://github.com/InsistonTan/FolderAnalysis/assets/46219581/34301720-8acb-4c9a-bc12-f5bc2578e863)


点击某个硬盘后，会对硬盘文件夹进行分析，硬盘里面文件越多，等待时间就越长（递归扫描硬盘里的所有文件）
![image](https://github.com/InsistonTan/FolderAnalysis/assets/46219581/52364f54-a47a-4cb9-8e23-dc1f804efb50)


扫描完成后的界面：
![image](https://github.com/InsistonTan/FolderAnalysis/assets/46219581/bdc1ab06-f5a4-4944-9334-1791a58d1f5d)
