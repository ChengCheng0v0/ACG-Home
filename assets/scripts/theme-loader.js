/* global config */

var themePath;
var metaData;

class ThemeManager {
    constructor() {
        this.parse();
    }

    // 解析主题
    parse() {
        // 构建主题目录
        themePath = window.location.origin + "/assets/themes/" + config.content.theme.theme;
        console.log("%c[I]%c " + `Theme Path: ${themePath}`, "background-color: #00896c;", "");

        // 使用 XML 获取主题的元数据
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", themePath + "/theme.json", false); // 使用同步请求
            xhr.send();

            if (xhr.status >= 200 && xhr.status < 300) {
                metaData = JSON.parse(xhr.responseText);
            } else {
                throw new Error("无法获取主题元数据");
            }
        } catch (error) {
            console.error("%c[E]%c " + `获取主题元数据失败: ${error}`, "background-color: #cb1b45;", "");
            throw new Error("获取主题元数据失败，无法继续执行操作");
        }

        console.log("%c[I]%c " + `主题元数据: ${JSON.stringify(metaData)}`, "background-color: #00896c;", "");

        // 检查元数据是否合法
        if (metaData.id && metaData.name && metaData.version && metaData.files.styles && metaData.files.scripts && metaData.colors) {
            // 输出欢迎语
            console.group("%c主题解析成功！%c" + `${metaData.name} (${metaData.id})`, "padding: 5px; border-radius: 6px 0 0 6px; background-color: #00896c; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #986db2; color: #ffffff;");
            console.log("%cID:%c" + `${metaData.id}`, "padding: 5px; border-radius: 6px 0 0 6px; background-color: #986db2; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #b5495b; color: #ffffff;");
            console.log("%cName:%c" + `${metaData.name}`, "padding: 5px; border-radius: 6px 0 0 6px; background-color: #986db2; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #b5495b; color: #ffffff;");
            console.log("%cVersion:%c" + `${metaData.version}`, "padding: 5px; border-radius: 6px 0 0 6px; background-color: #986db2; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #b5495b; color: #ffffff;");
            console.log("%cRepo:%c" + `${metaData.repo}`, "padding: 5px; border-radius: 6px 0 0 6px; background-color: #010101; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #ff9901; color: #ffffff;");
            console.groupEnd();

            return metaData;
        } else {
            console.error("%c[E]%c " + `主题解析失败，元数据存在问题`, "background-color: #cb1b45;", "");
            throw new Error("主题解析失败，无法继续执行操作");
        }
    }

    load() {
        // 创建一个数组，用来存放生成的 Style 外部资源链接 HTML
        var styleLinks;

        // 解析基本样式 URL 并赋值给数组
        styleLinks = metaData.files.styles
            .map((key) => {
                if (key) {
                    // 创建 <link> 标签
                    return `<link rel="stylesheet" href="${themePath}/styles/${key}" />`;
                }
                console.error("%c[E]%c " + `主题 ${key} 样式 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("主题样式 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean); // 过滤掉无效的值

        // 解析配色方案样式 URL 并插入数组
        metaData.colors.index
            .map((key) => {
                const styles = metaData.colors.list[key].files.styles; // 获取对应的 styles
                if (styles && localStorage.getItem("theme.color") === key) {
                    // 根据用户设置选择是否生成标签
                    // 如果 styles 是数组，生成多个 link 标签
                    return styles.map((file) => `<link rel="stylesheet" href="${themePath}/colors/${key}/styles/${file}" />`).join(""); // 将生成的所有 link 标签拼接成字符串
                } else if (localStorage.getItem("theme.color") !== key) {
                    console.log("%c[I]%c " + `跳过了生成 ${key} 配色方案样式标签的步骤，因为 key 的值不符合用户设置`, "background-color: #00896c;", "");
                    return;
                }
                console.error("%c[E]%c " + `配色方案 ${key} 样式 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("配色方案样式 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean) // 过滤掉无效的值
            .forEach((linkTags) => {
                styleLinks.push(linkTags); // 将生成的 link 标签插入到数组中
            });

        console.log("%c[I]%c " + `待插入的 Style 外部资源链接: ${styleLinks}`, "background-color: #00896c;", "");

        // 创建一个数组，用来存放生成的 Script 外部资源链接 HTML
        var scriptLinks;

        // 解析基本脚本 URL 并赋值给数组
        scriptLinks = metaData.files.scripts
            .map((key) => {
                if (key) {
                    // 创建 <script> 标签
                    return `<script src="${themePath}/scripts/${key}"></script>`;
                }
                console.error("%c[E]%c " + `主题 ${key} 脚本 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("主题脚本 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean); // 过滤掉无效的值

        // 解析配色方案脚本 URL 并插入数组
        metaData.colors.index
            .map((key) => {
                const scripts = metaData.colors.list[key].files.scripts; // 获取对应的 scripts
                if (scripts && localStorage.getItem("theme.color") === key) {
                    // 根据用户设置选择是否生成标签
                    // 如果 scripts 是数组，生成多个 script 标签
                    return scripts.map((file) => `<script src="${themePath}/colors/${key}/scripts/${file}"></script>`).join(""); // 将生成的所有 link 标签拼接成字符串
                } else if (localStorage.getItem("theme.color") !== key) {
                    console.log("%c[I]%c " + `跳过了生成 ${key} 配色方案脚本标签的步骤，因为 key 的值不符合用户设置`, "background-color: #00896c;", "");
                    return;
                }
                console.error("%c[E]%c " + `配色方案 ${key} 脚本 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("配色方案脚本 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean) // 过滤掉无效的值
            .forEach((linkTags) => {
                scriptLinks.push(linkTags); // 将生成的 link 标签插入到数组中
            });

        console.log("%c[I]%c " + `待插入的 Script 外部资源链接: ${scriptLinks}`, "background-color: #00896c;", "");

        // 拼接 styleLinks 和 scriptLinks
        const resTag = [...styleLinks, ...scriptLinks];

        document.addEventListener("DOMContentLoaded", () => {
            // 将生成的外部资源链接插入到 theme 元素中
            document.querySelector("theme").innerHTML = resTag.join("");
        });
    }
}

// 创建 ThemeManager 实例
const themeManager = new ThemeManager();
themeManager.load();
