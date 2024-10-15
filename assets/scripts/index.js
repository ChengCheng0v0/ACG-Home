/* global getWebsiteConfig, swal, renderMarkdown */

document.addEventListener("DOMContentLoaded", async () => {
    // 获取网站配置
    const config = getWebsiteConfig();
    config.init();

    // 输出控制台欢迎消息
    console.log("欢迎来到 " + config.content.title + "！你在看什么呢？！");

    // 渲染 Markdown 内容
    renderMarkdown();

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
