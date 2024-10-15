> [!IMPORTANT]  
> 本项目的重构工作正在 develop 分支中进行。  
> 由于目前仍然存在太多问题，不建议现在使用本项目。  
> —— 2024/10/02

## ACG Home

一个二次元风格的个人主页！  

## 预览

[https://acg-home.pages.dev](https://acg-home.pages.dev)

![_20241016_002741.png](https://s2.loli.net/2024/10/16/fvapGBQDeRkzTHh.png)

> [!TIP]
> 上面的预览链接中的内容会即时同步 `main` 分支的更改，但预览图就不一定会及时更新了哦。

## 介绍

这是一个简单的个人网站，没有太多花里花哨的东西。  
其设计理念为简洁至上，拥有较为现代的 UI 风格和合理的页面布局。

网站的内容和公告区域是使用 [Marked](https://github.com/markedjs/marked) 将 Markdown 渲染为 HTML 的（就像 GitHub 主页的 README 一样），这么做的好处是大大降低了网站编写的复杂性，并且这个渲染器不会过滤掉 HTML 内容（这意味着你只需要编写简短的 Markdown 文档就可以做出复杂的页面内容！）。

项目的代码有着较高的可读性，加上其内容与 HTML 样式分离的设计使得你可以轻松地将它修改成你想要的样子！  
网站只有一个简单的最小化框架，你可以在这个基础上增加任何你喜欢的内容，而不会被大型项目的局限性和复杂性所影响。

这个项目目前正处在重构后的第一个大版本！所以未来还会在保留当前设计理念的情况下增加很多模块化的功能，如果感兴趣的话欢迎点个 Star 和关注，谢谢！\(>▽

有任何问题欢迎提 Issue！有希望添加的功能或者有任何建议的话让我们 Discussions 见！

### 使用的项目

- 语言: 前端三件套 (HTML, CSS, JavaScript)
- Markdown 渲染器: [Marked.js](https://github.com/markedjs/marked)
- 文本打字效果: [Typed.js](https://github.com/mattboldt/typed.js)
- 字体图标: FontAwesome
- 字体: Linotte + 汉仪正圆

### 你知道吗？

这个项目原本是基于 [wexuo/home](https://github.com/wexuo/home) 的修改版，现在因为各种问题我完全重写了整个项目。现在本项目的页面排版布局仍然使用了原作者的设计，但代码和设计理念是完全不同的~

## 如何使用？

本项目没有什么复杂的地方，但是有些东西最好可以了解一下！

### 1. 在网页中的任意位置插入 Markdown 内容

其实非常简单，只需要一个 class 为 `markdown-content` 的任意元素就行了！例如：

``` html
<div class="markdown-content" src="./assets/markdown/content-page.md"></div>
```

这段代码使用了一个纯净的 `div` 元素来包裹内容，Marked 解析后的 HTML 元素都将插入到这个 `div` 中。  
其 `src` 属性定义了需要渲染的源 `.md` 文件的相对或绝对路径。这个路径指向的可以是一个本地 URL 也可以是一个远程 URL，渲染器会通过 `fetch` 获取 Markdown 源文件并进行渲染。

因为渲染器会在页面 DOM 加载完成的时候查找页面内的所有 `.markdown-content` 元素并将其指定的内容渲染出来，所以你可以在页面内任何地方插入这样的元素！

项目中自带了两个需要渲染的 Markdown 文件：`/assets/markdown/content-page.md` 和 `/assets/markdown/announcement.md`，他们分别存放了网页主要内容区域和侧边栏公告卡片的 Markdown 内容。

关于渲染器的更多可自定义选项，请查看 [Marked.js](https://github.com/markedjs/marked) 的官方文档！我会在未来为这个项目加入更多可用的扩展 Markdown 语法。

### 2. 编写主要内容区域的 Markdown 文档时的最佳实践

因为网站排版的问题，在编辑内容时最好在每个标题前的内容后使用 `---` 分割线进行分段，自定义的 CSS 分割线样式会使页面看起来更加协调（当然如果你喜欢的话也可以不用就是啦）。

## 参与贡献

直接提 PR 就行啦！  
\(真的会有人对这个小破项目感兴趣吗 Σ(っ °Д °;)っ  \)
