/* global swal, marked */

//Markdown 渲染器
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

// 复制文本
function copy(data) {
    let input = document.createElement("input");
    input.setAttribute("readonly", "readonly");
    input.value = data;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
    swal("复制成功！");
}

// 显示邮箱
function email() {
    swal({
        title: "E-mail",
        text: "suxinchengcheng@gmail.com",
        buttons: ["复制", true],
    }).then((OK) => {
        if (OK) {
            /* empty */
        } else {
            copy("suxinchengcheng@gmail.com");
        }
    });
}

// 显示 URL
function page_url() {
    const url = window.location.href;
    swal({
        title: "URL",
        text: url,
    });
}
