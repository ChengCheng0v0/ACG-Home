/* global renderMarkdown*/

// 根据路径更新内容区域的 Markdown
function updateContent(path) {
    const markdown = document.getElementById("content-page-markdown");
    if (path.startsWith("/p/")) {
        switch (path) {
            // 示例路由
            case "/p/example_route":
                markdown.setAttribute("src", "/assets/markdown/static/example_route.md");
                renderMarkdown(document.getElementById("content-page-markdown"));
                break;
            // 错误信息: fetch_failed
            case "/p/error_fetch_failed":
                markdown.setAttribute("src", "/assets/markdown/static/fetch_failed.md");
                renderMarkdown(document.getElementById("content-page-markdown"));
                break;
            // 其它目标
            default:
                markdown.setAttribute("src", "/assets/markdown/" + path.replace(/[/p/]/g, "") + ".md");

                renderMarkdown(document.getElementById("content-page-markdown")).catch(e => {
                    markdown.setAttribute("src", "/assets/markdown/static/fetch_failed.md");
                    renderMarkdown(document.getElementById("content-page-markdown"));
                });
        }
    } else if (path.startsWith("/")) {
        // 根目录
        markdown.setAttribute("src", "/assets/markdown/content-page.md");
        renderMarkdown(document.getElementById("content-page-markdown"));
    } else {
        console.warn("%c[W]%c " + `路由器获取到了一个未定义的目标: ${path}，当前操作为 '根据路径更新内容区域的 Markdown'，未发生任何事情`, "background-color: #e98b2a;", "");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 首次加载时触发更新
    updateContent(location.pathname);
    // URL 更新触发更新
    window.addEventListener("popstate", () => {
        updateContent(location.pathname);
    });

    // 添加全局点击监听器
    document.addEventListener("click", event => {
        const link = event.target.closest("a"); // 找到点击的最近 <a> 元素
        if (
            // 超链接行为我有三不改:
            link && // 1. 不存在的我不改，它都没有我改啥哇
            link.target !== "_blank" && // 2. target 是 _blank 的不改，因为它善，它在新标签页打开我管它干嘛
            (link.href.startsWith(location.origin + "/p/") || link.href.startsWith(location.origin)) // 3. 不指向 '/p/' 或 '/' 开头的我不改，因为它恶，不指向 '/p/'' 容易出事啊
        ) {
            link.classList.add("loading"); // 开始加载动画

            event.preventDefault(); // 阻止默认行为
            history.pushState({}, "", link.href); // 更新浏览器地址栏
            updateContent(location.pathname); // 使用路由行为加载新内容

            // link.classList.remove("loading"); // 停止加载动画  NOTE: 这里对加载动画标签的移除应该是非必要的

            // 移动至顶部
            window.scrollTo({
                top: 0,
                behavior: "smooth", // 平滑滚动
            });
        }
    });
});
