通过上面的学习，我们知道了，单页面应用路由的实现原理，我们也尝试去实现一个。在做管理系统的时候，我们通常会在页面的左侧放置一个固定的导航 sidebar，页面的右侧放与之匹配的内容 main 。点击导航时，我们只希望内容进行更新，如果刷新了整个页面，到时导航和通用的头部底部也进行重绘重排的话，十分浪费资源，体验也会不好。这个时候，我们就能用到我们今天学习到的内容，通过使用 HTML5 的 pushState 方法和 replaceState 方法来实现，

思路：首先绑定 click 事件。当用户点击一个链接时，通过 preventDefault 函数防止默认的行为（页面跳转），同时读取链接的地址（如果有 jQuery，可以写成$(this).attr('href')），把这个地址通过pushState塞入浏览器历史记录中，再利用 AJAX 技术拉取（如果有 jQuery，可以使用$.get方法）这个地址中真正的内容，同时替换当前网页的内容。

为了处理用户前进、后退，我们监听 popstate 事件。当用户点击前进或后退按钮时，浏览器地址自动被转换成相应的地址，同时popstate事件发生。在事件处理函数中，我们根据当前的地址抓取相应的内容，然后利用 AJAX 拉取这个地址的真正内容，呈现，即可。

最后，整个过程是不会改变页面标题的，可以通过直接对 document.title 赋值来更改页面标题。


在做管理系统的时候，我们通常会在页面的左侧放置一个固定的导航 sidebar，页面的右侧放与之匹配的内容 main 。

点击导航时，我们只希望内容进行更新，如果刷新了整个页面，到时导航和通用的头部底部也进行重绘重排的话，十分浪费资源，体验也会不好。

这个时候，我们就能用到我们今天学习到的内容，通过使用 HTML5 的 pushState 方法和 replaceState 方法来实现，

思路：首先绑定 click 事件。当用户点击一个链接时，通过 preventDefault 函数防止默认的行为（页面跳转），同时读取链接的地址（如果有 jQuery，可以写成$(this).attr('href')），把这个地址通过pushState塞入浏览器历史记录中，再利用 AJAX 技术拉取（如果有 jQuery，可以使用$.get方法）这个地址中真正的内容，同时替换当前网页的内容。

为了处理用户前进、后退，我们监听 popstate 事件。

当用户点击前进或后退按钮时，浏览器地址自动被转换成相应的地址，同时popstate事件发生。在事件处理函数中，我们根据当前的地址抓取相应的内容，然后利用 AJAX 拉取这个地址的真正内容，呈现，即可。

最后，整个过程是不会改变页面标题的，可以通过直接对 document.title 赋值来更改页面标题。
