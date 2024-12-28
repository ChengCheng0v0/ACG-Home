/* global renderMarkdown*/

// 根据路径更新正文
function updateContent(path) {
    const markdown = document.getElementById("content-page-markdown");
    if (path.startsWith("/p/")) {
        switch (path) {
            case "/p/example_route":
                console.log("%c[I]%c " + "触发示例路由页面", "background-color: #00896c;", "");
                markdown.setAttribute("src", "/assets/markdown/static/example_route.md");
                renderMarkdown(document.getElementById("content-page-markdown"));
                break;
            case "/p/error_fetch_failed":
                markdown.setAttribute("src", "/assets/markdown/static/fetch_failed.md");
                renderMarkdown(document.getElementById("content-page-markdown"));
                break;
            default:
                markdown.setAttribute("src", "/assets/markdown/" + path.replace(/[/p/]/g, "") + ".md");

                renderMarkdown(document.getElementById("content-page-markdown")).catch(e => {
                    markdown.setAttribute("src", "/assets/markdown/static/fetch_failed.md");
                    renderMarkdown(document.getElementById("content-page-markdown"));
                });
        }
    } else {
        console.log("%c[I]%c " + "位于根目录中，不更改内容区域的 Markdown 文件", "background-color: #00896c;", "");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 首次加载时触发更新
    updateContent(location.pathname);
    // 路径变化时触发更新
    window.addEventListener("popstate", () => updateContent(location.pathname));
});
