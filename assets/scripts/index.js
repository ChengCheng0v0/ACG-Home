/* global Alpine, getWebsiteConfig, Typed, swal, renderMarkdown */

// 获取网站配置
const config = getWebsiteConfig();
config.init();

// 初始化 Alpine
document.addEventListener("alpine:init", () => {
    Alpine.data("getWebsiteConfig", config);
});

document.addEventListener("DOMContentLoaded", async () => {
    // 设置网站标题
    document.title = config.content.title;

    // 输出控制台欢迎消息
    console.log("%c欢迎来到%c" + config.content.title + "！", "padding: 5px; border-radius: 6px 0 0 6px; background-color: #1e88a8; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #b5495b; color: #ffffff;");
    console.group("%c打开开发者工具是想干嘛呢？应该是想扒代码吧！项目是开源的哦 (GPL-v3)，你喜欢的话拿去用就是了！%c" + "o(〃'▽'〃)o", "padding: 5px; border-radius: 6px 0 0 6px; background-color: #00896c; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #986db2; color: #ffffff;");
    console.log("%c注意！此页面内的某些由站长添加的内容可能并不是开源的，直接从本站 CV 代码前最好先问问站长哦~", "padding: 5px; border-radius: 6px 6px 6px 6px; background-color: #b5393b; color: #ffffff;");
    console.log("%cGitHub.com/%c" + "ChengCheng0v0/ACG-Home", "padding: 5px; border-radius: 6px 0 0 6px; background-color: #010101; color: #ffffff;", "padding: 5px; border-radius: 0 6px 6px 0; background-color: #ff9901; color: #ffffff;");
    console.groupEnd();

    // 渲染 Markdown 内容
    renderMarkdown();

    // 加载页首打字标题
    var typed = new Typed(".page-head > .title", {
        strings: config.content.pageHead.typedContent,
        startDelay: 300,
        backDelay: 1000,
        typeSpeed: 100,
        backSpeed: 50,
        showCursor: true,
        loop: true,
    });

    // 获取 Hitokoto 一言
    fetch("https://v1.hitokoto.cn")
        .then((response) => response.json())
        .then((data) => {
            const hitokoto = document.querySelector("#hitokoto-text");
            hitokoto.href = `https://hitokoto.cn/?uuid=${data.uuid}`;
            hitokoto.innerText = data.hitokoto;
        })
        .catch(console.error);
});
