function beautySize(size) {
    if (size === 0) {
        return '0';
    }

    let tempSize = Number.parseInt(size, 10);
    const unitArray = ['B', 'KB', 'MB', 'GB', 'TB'];

    for (let i = 0; ; i++) {
        if (tempSize > 1024) {
            tempSize = tempSize / parseFloat('1024');
        } else {
            if (parseFloat(tempSize.toFixed(0)) === parseFloat(tempSize.toFixed(1))) {
                return tempSize.toFixed(0) + ' ' + unitArray[i];
            }

            return tempSize.toFixed(1) + ' ' + unitArray[i];
        }
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const cp = require('child_process')
    cp.exec('wmic logicaldisk get size,freespace,caption', (error, stdout) => {
        //console.log(stdout);
        const strings = stdout.split("\n");
        const diskStage = [];
        for (let i = 1; i < strings.length; i++) {
            let str = strings[i];
            const split = str.split(new RegExp(" +"));
            if (split && split.length === 4)
                diskStage.push({
                    caption: split[0],
                    free: split[1],
                    size: split[2],
                    used: Number.parseInt(split[2]) - Number.parseInt(split[1]),
                    freeStr: beautySize(split[1]),
                    sizeStr: beautySize(split[2])
                })
        }

        //console.log(diskStage);

        window.localStorage.setItem('diskStage', JSON.stringify(diskStage));
    })
});


const {contextBridge, ipcRenderer} = require('electron')
//引用文件系统模块
const fs = require('fs');



// 存放文件信息
let result = {};

function listFiles(path, rootPath) {
    // 读取文件
    const files = fs.readdirSync(path);
    files.forEach((item, index) => {
        let filePath = path + item;
        try {
            const stat = fs.statSync(filePath);
            filePath = stat.isDirectory() ? filePath + '/' : filePath;

            // 将文件大小加到父级目录上
            result[rootPath].size += stat.size;

            // 如果是目录，则继续递归
            if (stat.isDirectory()) {
                listFiles(filePath, rootPath);
            }
        } catch (e) {
        }
    });
}

contextBridge.exposeInMainWorld(
    'electron',
    {
        'getFiles': (path) => {
            result = {};
            //listFiles(path);

            const startMs = new Date().getTime();

            // 读取文件
            const files = fs.readdirSync(path);
            files.forEach((item, index) => {
                let filePath = path + item;
                try {
                    const stat = fs.statSync(filePath);
                    filePath = stat.isDirectory() ? filePath + '/' : filePath;
                    if (!result[filePath]) {
                        result[filePath] = {
                            name: item,
                            path: filePath,
                            updateTime: stat.mtime.toLocaleString(),
                            size: stat.size,
                            isDirectory: stat.isDirectory()
                        };
                        // 如果是目录，则继续递归
                        if (stat.isDirectory()) {
                            listFiles(filePath, filePath);
                        }
                    }

                } catch (e) {
                }
            });

            console.log(`分析文件夹[${path}]，耗时：${new Date().getTime() - startMs} ms`);

            return result;
        },
        'beautySize': (size) => {
            return beautySize(size);
        },

    }
)
