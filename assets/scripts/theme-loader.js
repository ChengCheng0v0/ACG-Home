/* global config */

var themePath;
var metaData;

// 配色方案切换加载动画的最短显示时间
const minimumColorSwitchTime = 650;
const colorSwitchSleepTime = 310;

class ThemeManager {
    constructor() {
        this.parse();
    }

    // 解析主题
    parse() {
        // 构建主题目录
        themePath = window.location.href + "/assets/themes/" + config.content.theme.theme;
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

    // 加载主题
    load() {
        // 创建一个数组，用来存放生成的 Style 外部资源链接 HTML
        var styleLinks;

        // 解析基本样式 URL 并赋值给数组
        styleLinks = metaData.files.styles
            .map(key => {
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
            .map(key => {
                let targetColor = localStorage.getItem("theme.color"); // 存储目标配色方案的变量

                // 如果目标配色方案为保留关键字“!autoSwitch”（自动切换配色方案），将其改为实际需要加载的配色方案
                if (targetColor === "!autoSwitch") {
                    console.log("%c[I]%c " + `当前配色方案为 !autoSwitch 自动切换，用户的浏览器深色模式启用状态为: ${window.matchMedia("(prefers-color-scheme: dark)").matches}`, "background-color: #00896c;", "");
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        targetColor = config.content.theme.colors.autoSwitch.dark;
                    } else {
                        targetColor = config.content.theme.colors.autoSwitch.light;
                    }
                }

                const styles = metaData.colors.list[key].files.styles; // 获取对应的 styles

                // 根据目标配色方案决定是否生成标签
                if (styles && targetColor === key) {
                    // 如果 styles 是数组，生成多个 link 标签
                    return styles.map(file => `<link rel="stylesheet" href="${themePath}/colors/${key}/styles/${file}" />`).join(""); // 将生成的所有 link 标签拼接成字符串
                } else if (localStorage.getItem("theme.color") !== key) {
                    console.log("%c[I]%c " + `跳过了生成 ${key} 配色方案样式标签的步骤，因为 key 的值不符合用户设置`, "background-color: #00896c;", "");
                    return;
                }
                console.error("%c[E]%c " + `配色方案 ${key} 样式 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("配色方案样式 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean) // 过滤掉无效的值
            .forEach(linkTags => {
                styleLinks.push(linkTags); // 将生成的 link 标签插入到数组中
            });

        console.log("%c[I]%c " + `待插入的 Style 外部资源链接: ${styleLinks}`, "background-color: #00896c;", "");

        // 创建一个数组，用来存放生成的 Script 外部资源链接 HTML
        var scriptLinks;

        // 解析基本脚本 URL 并赋值给数组
        scriptLinks = metaData.files.scripts
            .map(key => {
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
            .map(key => {
                let targetColor = localStorage.getItem("theme.color"); // 存储目标配色方案的变量

                // 如果目标配色方案为保留关键字“!autoSwitch”（自动切换配色方案），将其改为实际需要加载的配色方案
                if (targetColor === "!autoSwitch") {
                    console.log("%c[I]%c " + `当前配色方案为 !autoSwitch 自动切换，用户的浏览器深色模式启用状态为: ${window.matchMedia("(prefers-color-scheme: dark)").matches}`, "background-color: #00896c;", "");
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                        targetColor = config.content.theme.colors.autoSwitch.dark;
                    } else {
                        targetColor = config.content.theme.colors.autoSwitch.light;
                    }
                }

                const scripts = metaData.colors.list[key].files.scripts; // 获取对应的 scripts

                // 根据目标配色方案决定是否生成标签
                if (scripts && targetColor === key) {
                    // 如果 scripts 是数组，生成多个 script 标签
                    return scripts.map(file => `<script src="${themePath}/colors/${key}/scripts/${file}"></script>`).join(""); // 将生成的所有 link 标签拼接成字符串
                } else if (localStorage.getItem("theme.color") !== key) {
                    console.log("%c[I]%c " + `跳过了生成 ${key} 配色方案脚本标签的步骤，因为 key 的值不符合用户设置`, "background-color: #00896c;", "");
                    return;
                }
                console.error("%c[E]%c " + `配色方案 ${key} 脚本 Tag 生成失败，元数据可能存在问题`, "background-color: #cb1b45;", "");
                throw new Error("配色方案脚本 Tag 生成失败，无法继续执行操作");
            })
            .filter(Boolean) // 过滤掉无效的值
            .forEach(linkTags => {
                scriptLinks.push(linkTags); // 将生成的 link 标签插入到数组中
            });

        console.log("%c[I]%c " + `待插入的 Script 外部资源链接: ${scriptLinks}`, "background-color: #00896c;", "");

        // 拼接 styleLinks 和 scriptLinks
        const resTag = [...styleLinks, ...scriptLinks];

        // 将生成的外部资源链接插入到 theme 元素中
        document.querySelector("theme").innerHTML = resTag.join("");

        console.log("%c[I]%c " + `准备执行 <theme> 中的所有 Script 脚本`, "background-color: #00896c;", "");

        // 执行 <theme> 中的所有 Script 脚本
        this.runScripts();
    }

    // 设置配色方案
    setColor(colorId) {
        if (colorId === localStorage.getItem("theme.color")) {
            console.warn("%c[W]%c " + `当前配色方案已是 ${colorId}，与其白白重载一次，不如我现在就中断更改`, "background-color: #e98b2a;", "");
        } else {
            // 隐藏滚动条
            document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // 给 body 加一个与滚动条宽度相同的右边距以防止页面抖动
            document.body.style.overflow = "hidden";

            // 开始播放加载动画
            document.getElementById("theme-color-loader-iframe").className = "start"; // 播放开始动画

            // 加载配色方案
            setTimeout(() => {
                // 检查索引中是否存在配色方案
                // 保留关键字 !autoSwitch 可以不需要在索引中存在
                if (metaData.colors.index.includes(colorId) || colorId === "!autoSwitch") {
                    try {
                        localStorage.setItem("theme.color", colorId);

                        // 重新加载主题
                        themeManager.load();

                        console.log("%c[I]%c " + `配色方案已更改为: ${colorId}`, "background-color: #00896c;", "");
                    } catch (error) {
                        console.error("%c[E]%c " + `无法将配色方案更改为 ${colorId}: ${error}`, "background-color: #cb1b45;", "");
                        throw new Error("配色方案更改失败: ", error);
                    }
                } else {
                    console.error("%c[E]%c " + `无法将配色方案更改为 ${colorId}，因为未在主题配色方案索引中匹配到传入的值`, "background-color: #cb1b45;", "");
                    throw new Error("配色方案更改失败，未在主题配色方案索引中匹配到传入的值");
                }

                // 加载配色方案设置的选中效果
                loadThemeSelEff();
            }, colorSwitchSleepTime);

            // 结束播放加载动画
            (() => {
                setTimeout(() => {
                    document.getElementById("theme-color-loader-iframe").className = "end"; // 播放结束动画
                    document.body.style.paddingRight = "unset"; // 恢复 body 的右边距
                    document.body.style.overflow = "unset"; // 恢复显示滚动条
                }, minimumColorSwitchTime);
            })();
        }
    }

    runScripts() {
        // 遍历 <theme> 中的所有 <script> 标签
        document.querySelectorAll("theme > script").forEach(script => {
            // 获取当前 script 标签的 src
            const src = script.src;

            // 如果 src 存在（确保它是一个外部链接）
            if (src) {
                // 移除原有的 script 标签
                script.remove();

                // 创建一个新的 script 标签并重新插入
                const newScript = document.createElement("script");
                newScript.src = src;
                document.head.appendChild(newScript);
            }
        });
    }
}

// 加载配色方案设置的选中效果
function loadThemeSelEff() {
    // 如果存在已加载的选中效果则清除它
    if (document.querySelector(".theme-item.enable")) {
        document.querySelector(".theme-item.enable").setAttribute("class", "theme-item");
    }

    // 插入新的选中效果类
    document.getElementById(`theme-item-${localStorage.getItem("theme.color")}`).setAttribute("class", "theme-item enable");
}

// 创建 ThemeManager 实例
const themeManager = new ThemeManager();

document.addEventListener("DOMContentLoaded", () => {
    // 如果第一次访问，将配色方案设置为默认值
    if (localStorage.getItem("theme.color") === null) {
        themeManager.setColor(config.content.theme.colors.default);
    } else {
        // 否则正常加载主题
        themeManager.load();
    }

    /* 根据可用配色方案生成设置按钮 */

    // 获取 .themes 元素
    const themesElement = document.querySelector(".primary-container > .left-area > .cards > .card-item > .content > .settings-item > .themes");

    // 创建一个数组，用来存放生成的按钮 HTML
    const themeButtons = config.content.theme.colors.enable
        .map(key => {
            let displayName;
            let icon;
            let color;
            let background;

            if (key === "!autoSwitch") {
                console.log("%c[I]%c " + `Website config enabled !autoSwitch`, "background-color: #00896c;", "");

                displayName = config.content.theme.colors.autoSwitch.displayName; // 获取对应的 displayName
                icon = config.content.theme.colors.autoSwitch.icon.icon; // 获取对应的 icon
                color = config.content.theme.colors.autoSwitch.icon.color; // 获取对应的 color
                background = config.content.theme.colors.autoSwitch.icon.background; // 获取对应的 background
            } else {
                displayName = metaData.colors.list[key].displayName; // 获取对应的 displayName
                icon = metaData.colors.list[key].icon.icon; // 获取对应的 icon
                color = metaData.colors.list[key].icon.color; // 获取对应的 color
                background = metaData.colors.list[key].icon.background; // 获取对应的 background
            }

            if (displayName && icon && color && background) {
                // 创建 <div> 标签
                return `
                <div class="theme-item" id="theme-item-${key}" style="color: ${color}; background: ${background};" @click="themeManager.setColor(\`${key}\`);">
                    <i class="${icon}"></i>
                    <span>${displayName}</span>
                </div>
            `;
            } else {
                console.error("%c[E]%c " + `配色方案 ${key} 的设置按钮生成失败，主题元数据的配色方案信息 (${displayName}, ${icon}, ${color}, ${background}) 不满足条件，元数据可能存在问题`, "background-color: #cb1b45;", "");
            }
            return "";
        })
        .filter(Boolean); // 过滤掉无效的值

    // 将生成的按钮插入到 .social-icons 元素中
    themesElement.innerHTML = themeButtons.join("");

    // 加载配色方案设置的选中效果
    loadThemeSelEff();

    /* 根据可用配色方案生成设置按钮 End */
});
