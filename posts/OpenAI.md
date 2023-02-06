---
title: 'ChatGPT替代品'
date: '2023-02-06'
---

![](https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)



ChatGPT太卡顿? 经常出问题? 

你应该看看它的孪生兄弟, 市面上的ai工具大多都是基于这个的API进行开发  戳 [Here](https://platform.openai.com/playground) 

其实都是OpenAI旗下产品, 目前很火的chatGPT https://chat.openai.com/chat 只是对model做了更人性化的封装. 不过也更加集成, 无法调整相应参数. 

今天讲的主要是如何替代掉chatGPT 以及openAI旗下text generation的一些基础用法

---

### 用户注册

需要一个sms服务用来接受手机号, 

推荐这两个服务 https://sms-activate.org/en/getNumber#  https://sms-activation-service.com/  我个人这次用的是第一个

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230206201555.png)

**如果你运气比较好, 那么这个号码没有注册过, 你会获得为期三个月18美金的体验金,** 如果运气不太好 号码被用掉了. 那就只能花钱买**Token(openai的计价单位, 多数情况下一个简单的英文单词耗费1Token, 复杂较长的单词可能多个Token, 所以大概数值是750个单词消耗1000token)** . 对于英文单词/中文字体的Token计价可以查看 [Here](https://platform.openai.com/tokenizer)

:strawberry: 购买Token挺操蛋的一点是 国内外币visa信用卡貌似不能绑定, 我试了试俺自己的卡, **报错显示不能服务国内**, 这个还没找到好的办法

> 如果你有国外的credit card, 可以试试, 成功之后, 方便的话可以反馈一下, 联系[twitter](https://twitter.com/skyonedot)即可

这里简单说下价格, 参考这里 [Here](https://openai.com/api/pricing/). 以**最贵最好的模型来说**, 1美金对应50000token. 对应生成37500个英文单词, [我这里看了下, 一个中文字对应2Token, 即1美金可以生成25000个中文汉字, 这个分量还是很足的 :apple:]

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230206202251.png)

---

### 替代ChatGPT

先说最简单最直接的, 如何替代掉chatGPT. 

1. 来到 [Here](https://platform.openai.com/playground) 这个地址, 屏幕如下图所示

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230206205704.png)

2. 右边一列上面是三个模式, **第一个模式即最像chatGPT的模式**, 其余两个模式较为高级, 在后面

3. **再往上走一行, 有一个“Load a present...” 这个是可以导入一下预设的环境, 比如语法纠正, Q&A, 翻译等等**

4. 下面Model 这个选项, 是可以选择一些语言模型,  默认davinci003就好, 最强大最丰富[当然也最贵, 不过价格非常非常便宜了]

5. 下面Temperature这个讲究发散幻想能力, 数值越高越会引入新的信息, 数值是0的时候, 不会引入新的信息 答案会很死板 枯燥无味

   - 如果temperature设置为0, 那么每次生成固定的词后面是一样 :x:

6. Maximum length这个数字是代表一次request的最大消耗Token, 比如上图256, 那大概一次**最多**返回192个单词或者128个汉字

   > 这里没必要设置的非常大, 可以一次一次request, 多次请求达到自己想要的结果. 最大写2048

7. 下面Top p代表着**Top-p (nucleus) sampling**, 一种NLP中的采样方法, 这个值大小决定该词的累积概率阈值  可以决定最小可能单词集 ,中间值0.5 即可

   > TopP和Temperature 这两个, 主要调控一个, 将另外一个设置为中间值就好. 我一般是调控temperature

8. Frequency penalty, 惩罚项, 根据现有text对新词是否重复的惩罚, 值越小 越有可能出现重复的单词或者意思. 

9. Presence penalty, 另外一个惩罚项目, **值越大, 越容易出现新颖的东西, 扩展性更强** **值越小越死板枯燥**

   > 这个惩罚项和temperature有一丢丢的重复

10. 下面的 best of, 设置为1即可

11. 后面两个inject 主要是作为format使用, 默认即可

12. 最后一个 展示概率这里, 起到的效果是输出文本会有颜色标识, 可以试试玩一玩, 不过正常用时设置为off即可.

---

### 文本插入

我们返回三个模式, 第二个模式是插入模式, 你给出一段文本, 然后里面想要插入的部分用 [insert], 即可自动生成, 中英文均可, 不过英文效果好一些, 如果是中文, 在框框开始那里约定一下 ”生成内容全部为中文“

参数和上面说的大同小异, 使用如下图

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230206221342.png)

---

### 编辑模式

这个模式相当把第一个模式拆开, 限定环境用法放在左下面框框, 左上面放内容, 右边则是生成的内容, 效果个人感觉一般般

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230206221426.png)

---

参考文献

1. https://www.twilio.com/blog/ultimate-guide-openai-gpt-3-language-model
2. https://towardsdatascience.com/gpt-3-parameters-and-prompt-design-1a595dc5b405