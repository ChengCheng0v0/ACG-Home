/* global swal */

document.addEventListener("DOMContentLoaded", async () => {
    // 控制台欢迎消息
    console.log("%c 乾杯 - ( ゜- ゜)つロ", "background:#24272A; color:#ffffff", "");
    console.log("");

    // 浏览器动态标题
    /*
    var OriginTitle = document.title;
    var titleTime;
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.title = "╭(°A°`)╮ 快回来！";
            clearTimeout(titleTime);
        } else {
            document.title = "(ฅ>ω<*ฅ) 总算回来啦~";
            titleTime = setTimeout(() => {
                document.title = OriginTitle;
            }, 1000);
        }
    });
    */

    // 夜间模式
    function dark() {
        var element = document.body;
        element.classList.toggle("dark-mode");
    }

    // 访问问候
    const now = new Date();
    const hour = now.getHours();
    if (hour > 0) {
        if (hour < 6) {
            swal({ title: "凌晨了!", text: "注意休息~", icon: "info" });
        } else if (hour > 6) {
            if (hour < 9) {
                swal({
                    title: "早上好!",
                    text: "Good morning",
                    icon: "info",
                });
            } else if (hour > 21) {
                if (hour < 24) {
                    swal({
                        title: "晚上好!",
                        text: "开启夜间模式可以让页面不那么刺眼哟~",
                        icon: "info",
                        buttons: ["夜间模式", true],
                    }).then((OK) => {
                        if (OK) {
                            /* empty */
                        } else {
                            dark();
                        }
                    });
                }
            }
        }
    }

    // 将方法挂载到全局对象 window
    window.dark = dark;
});
