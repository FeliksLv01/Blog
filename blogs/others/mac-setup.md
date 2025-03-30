---
title: Mac基本设置
date: 2021-06-30
---

明天入职，公司发了 iMac，提前写个设置记录，之后就直接翻这个好了。

## HomeBrew 安装

```shell
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

## 终端安装 OMZ

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

备份配置文件

```shell
cp ~/.zshrc ~/.zshrc.orig
```

创建新配置文件

```bash
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

安装命令高亮工具

```bash
brew install zsh-syntax-highlighting
```

在`.zshrc`文件最后添加

```shell
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

## 更改 iterm2 的主题

下载 iterm2 的 Dracula 主题

```shell
git clone https://github.com/dracula/iterm.git
```

设置主题

1. _iTerm2 > Preferences > Profiles > Colors Tab_
2. Open the _Color Presets..._
3. 从列表中选择 import
4. 选择刚才下载主题中`Dracula.itermcolors` 文件，确定

## ssh 配置

```shell
ssh-keygen -t ed25519 -C "felikslv@163.com"
```
