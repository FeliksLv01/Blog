(window.webpackJsonp=window.webpackJsonp||[]).push([[82],{583:function(s,a,t){"use strict";t.r(a);var n=t(2),e=Object(n.a)({},(function(){var s=this,a=s._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"环境搭建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#环境搭建"}},[s._v("#")]),s._v(" 环境搭建")]),s._v(" "),a("p",[s._v("直接pip安装即可，可以设置国内镜像来提高下载速度。")]),s._v(" "),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("pip "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" opencv-python\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("h2",{attrs:{id:"测试程序"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#测试程序"}},[s._v("#")]),s._v(" 测试程序")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("import")]),s._v(" cv2 "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("as")]),s._v(" cv\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 获取摄像头，0表示系统默认摄像头")]),s._v("\ncamera "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("VideoCapture"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 打开摄像头，初始化失败时使用，可以去掉")]),s._v("\ncamera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("while")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("True")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 获取画面")]),s._v("\n    flag"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" frame "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" camera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("imshow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'demo'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" frame"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 获取键盘上按下哪个键")]),s._v("\n    keyPress "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("waitKey"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("60")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("print")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'键盘上按下的键是{}'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("format")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("keyPress"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 如果按下的是esc键，则退出循环")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" keyPress "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("27")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("break")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 关闭摄像头")]),s._v("\ncamera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("release"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 关闭图像窗口")]),s._v("\ncv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("destroyAllWindows"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br"),a("span",{staticClass:"line-number"},[s._v("17")]),a("br"),a("span",{staticClass:"line-number"},[s._v("18")]),a("br"),a("span",{staticClass:"line-number"},[s._v("19")]),a("br"),a("span",{staticClass:"line-number"},[s._v("20")]),a("br"),a("span",{staticClass:"line-number"},[s._v("21")]),a("br"),a("span",{staticClass:"line-number"},[s._v("22")]),a("br")])]),a("h2",{attrs:{id:"代码详解"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#代码详解"}},[s._v("#")]),s._v(" 代码详解")]),s._v(" "),a("h3",{attrs:{id:"初始化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#初始化"}},[s._v("#")]),s._v(" 初始化")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("camera "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("VideoCapture"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("camera是"),a("code",[s._v("VideoCapture")]),s._v("类的一个对象。这一行代码执行的是一个初始化操作。OpenCV为"),a("code",[s._v("cv2.VideoCapture")]),s._v("类提供了构造方法，用于打开摄像头以及完成摄像头的初始化操作。")]),s._v(" "),a("blockquote",[a("p",[s._v('捕获 对象= cv2.VideoCapture(" 摄像 头 ID 号")')])]),s._v(" "),a("p",[s._v("摄像头ID是指摄像头的ID编号，这一项默认是"),a("code",[s._v("-1")]),s._v("，表示随机选取一个摄像头，当有多个摄像头时，使用"),a("code",[s._v("0")]),s._v("表示第一个摄像头。")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("camera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token builtin"}},[s._v("open")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("当初始化失败时，可以使用"),a("code",[s._v("open")]),s._v("函数打开摄像头，具体用法如下：")]),s._v(" "),a("blockquote",[a("p",[s._v("retval = cv2.VideoCapture.open(index)")])]),s._v(" "),a("ul",[a("li",[s._v("index为摄像头ID号")]),s._v(" "),a("li",[s._v("retval为返回值，当摄像头成功打开时，返回True")])]),s._v(" "),a("h3",{attrs:{id:"捕获帧"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#捕获帧"}},[s._v("#")]),s._v(" 捕获帧")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("flag"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" frame "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" camera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("read"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("frame为捕获到的帧，flag表示是否捕获成功。")]),s._v(" "),a("h3",{attrs:{id:"显示图像"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#显示图像"}},[s._v("#")]),s._v(" 显示图像")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("imshow"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'demo'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" frame"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("blockquote",[a("p",[s._v("None= cv2.imshow(winname, mat)")])]),s._v(" "),a("p",[a("code",[s._v("imShow")]),s._v("函数是在一个窗口里显示捕获的图像。")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("winname")]),s._v("是窗口的名字")]),s._v(" "),a("li",[a("code",[s._v("mat")]),s._v("为捕获的图像")])]),s._v(" "),a("h3",{attrs:{id:"获取用户输入"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#获取用户输入"}},[s._v("#")]),s._v(" 获取用户输入")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("keyPress "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("waitKey"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("60")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[a("code",[s._v("waitKey")]),s._v("函数用来等待按键，当用户按下键盘后，该语句会被执行，并获取返回值。")]),s._v(" "),a("blockquote",[a("p",[s._v("retval= cv2.waitKey([ delay])")])]),s._v(" "),a("ul",[a("li",[s._v("retval 表示返回值，如果没有按键按下，则返回-1，有按键按下的话，返回该按键的ASCII码。")]),s._v(" "),a("li",[s._v("delay 表示等待键盘触发的时间，单位为ms，当该值为0或者负数时，表示无限等待，默认值为0")])]),s._v(" "),a("p",[s._v("注：python提供了"),a("code",[s._v("ord")]),s._v("函数，来获取字符的ASCII码。")]),s._v(" "),a("h3",{attrs:{id:"释放资源"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#释放资源"}},[s._v("#")]),s._v(" 释放资源")]),s._v(" "),a("p",[s._v("关闭摄像头")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("camera"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("release"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])]),a("p",[s._v("销毁窗口")]),s._v(" "),a("div",{staticClass:"language-python line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[s._v("cv"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("destroyAllWindows"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br")])])])}),[],!1,null,null,null);a.default=e.exports}}]);