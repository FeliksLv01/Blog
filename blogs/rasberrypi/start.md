---
title: 树莓派64位系统无屏幕配置
date: 2021-07-13
tags:
 - 树莓派
---

## 下载并烧写系统

使用的64位系统为树莓派爱好者基地的开源系统。
[仓库地址](https://gitee.com/openfans-community/Debian-Pi-Aarch64/)
使用官方工具烧写系统。烧写完，进行ssh和wifi的配置。

## ssh和wifi配置

SSH

```bash
cd /Volumes/boot
touch ssh
```

Wi-Fi

```bash
touch wpa_supplicant.conf
```

文件内容如下

```shell
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
 
network={
ssid="WiFi-A"
psk="12345678"
key_mgmt=WPA-PSK
priority=1
}
 
network={
ssid="WiFi-B"
psk="12345678"
key_mgmt=WPA-PSK
priority=2
}
```

ssh可以通过这样连接，默认密码为`raspberry`。

```shell
ssh pi@raspbian.local
```

### SSH免密

```shell
ssh-copy-id -i ~/.ssh/id_rsa.pub pi@raspbian.local
```

之后在本地的ssh config文件里加上下面的部分

```shell
Host pi
    HostName raspbian.local
    User pi
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
```

之后就可以直接通过`ssh pi`来进行连接。

## apt-get国内镜像

系统默认是华为云镜像，这一步是可选的。
修改`/etc/apt/sources.list`

```bash
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main contrib non-free rpi
```

然后执行

```shell
sudo apt-get update && apt-get upgrade -y
```

## 开启root

```shell
sudo passwd root # 设置root密码
sudo passwd --unlock root # 开启root用户
su # 切换至root
```

## 安装zsh和omz

使用国内github镜像站

```shell
sudo apt-get install zsh
git clone https://hub.fastgit.org/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
chsh -s /bin/zsh
```

### 安装命令高亮插件

```shell
sudo git clone https://hub.fastgit.org/zsh-users/zsh-syntax-highlighting ~/.zsh/zsh-syntax-highlighting
```

之后编辑`.zshrc`，在最后添加下面这一行

```shell
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
```

之后再生效一下。

```shell
source .zshrc
```

## 配置内网穿透

如果你有服务器的话，可以使用frp来实现内网穿透，具体方法在之前的一篇树莓派监控的文章里已经介绍过了。

这里介绍不需要使用服务器的一种方式，即借助[「网云穿」](https://www.xiaomy.net/)平台。这个平台提供了免费内网穿透服务，注册账号 → 领取免费隧道，然后跳转控制台点击隧道管理、配置隧道信息即可。

### 安装客户端

```shell
wget http://xiaomy.net/download/linux/wyc_linux_arm
sudo chmod 777 wyc_linux_arm
```

运行

```shell
/home/pi/wyc_linux_arm -token XXXX
```

### 编写启动脚本

`SITE_TO_CHECK`可以改成你的网关地址。之所以添加这样一个启动脚本，是因为直接启动的话，有可能系统网络还没有连接好，这样就会启动失败。

```shell
#!/bin/bash

# check network availability
while true
do
  TIMEOUT=5
  SITE_TO_CHECK="192.168.199.1"
  RET_CODE=`curl -I -s --connect-timeout $TIMEOUT $SITE_TO_CHECK -w %{http_code} | tail -n1`
  if [ "x$RET_CODE" = "x200" ]; then
  echo "Network OK !!!"
  break
  else
  echo "Network not ready, wait..."
  sleep 1s
  fi
done

nohup /home/pi/wyc_linux_arm -token=xxx &
```

### 设置开机自启

编辑`/etc/rc.local`

在`exit 0`之前加上一行`/home/pi/start.sh`

之后就可以通过域名连接

```shell
ssh -p 端口号 pi@域名
```

