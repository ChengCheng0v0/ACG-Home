/* global swal */

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
