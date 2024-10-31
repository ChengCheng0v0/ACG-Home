/* global swal, marked */

// 获取网站配置
function getWebsiteConfig() {
    return {
        content: {},
        init() {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "../../config.json", false); // 使用同步请求
                xhr.send();

                if (xhr.status >= 200 && xhr.status < 300) {
                    this.content = JSON.parse(xhr.responseText); // 动态更新 config 对象
                } else {
                    throw new Error("无法获取网站配置文件");
                }
            } catch (error) {
                console.error("无法获取网站配置文件: ", error);
            }
        },
    };
}

// 获取网站配置
const config = getWebsiteConfig();
config.init();

// 对象递归初始化代理
function autoInitObject() {
    return new Proxy({}, {
        get(target, prop) {
            // 如果属性不存在，则递归返回一个新的代理
            if (!(prop in target)) {
                target[prop] = autoInitObject();
            }
            return target[prop];
        },
        set(target, prop, value) {
            // 正常设置属性
            target[prop] = value;
            return true;
        }
    });
}

// Markdown 渲染器
function renderMarkdown() {
    // 获取页面中的所有 .markdown-content 元素
    const markdownElements = document.querySelectorAll(".markdown-content");

    // 遍历每个元素，获取其 src 指定的 Markdown 文件并渲染
    markdownElements.forEach((element) => {
        const src = element.getAttribute("src"); // 获取 src 属性

        if (src) {
            // 使用 fetch 来获取 .md 文件内容
            fetch(src)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`无法获取 Markdown 文件: ${src}`);
                    }
                    return response.text();
                })
                .then((markdownContent) => {
                    // 使用 marked 库将 Markdown 转换为 HTML
                    const renderedHTML = marked.parse(markdownContent);

                    // 使用渲染后的 HTML 直接替换原始内容
                    element.innerHTML = renderedHTML;
                })
                .catch((error) => {
                    console.error(error);
                    element.innerHTML = `<span style='color: red;'>加载 Markdown 文件失败: ${src}</span>`;
                });
        } else {
            element.innerHTML = "<span style='color: red;'>加载 Markdown 文件失败: 未在 src 属性中指定文件路径</span>";
        }
    });
}

// 将方法挂载到全局对象 window
window.autoInitObject = autoInitObject;
