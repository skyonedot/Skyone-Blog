---
title: 'Sparrow Wallet (Bitcoin)'
date: '2023-05-10'
---


![](https://images.pexels.com/photos/15658170/pexels-photo-15658170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

> Photo by Artūras Kokorevas

## Sparrow Wallet (Bitcoin)

### 理论

1. UTXO是什么

   - UTXO, 全称为**Unspent Transaction Outputs**, 即**未花费的交易支出**.
   - 比特币中, 任何一笔transaction, 都有一个 input, 以及相应的 output 

   - 相较于EVM生态, BTC更像是纸币, 而EVM更像是银行  [:point_right: 以下例子均不考虑实际RMB面额限制 :point_left:  ]
     - 举个例子, 你有100元现金RMB, 一张纸币, 10快钱转账给老王, gas设置为5, 那么最后你会剩下一张面额为85的UTXO, 你的一张100元纸币, 变成了一张面额为85的纸币
     - 上面的花销中, 100元纸币就作为 tx的input, 而output分别是 
       1. 85(返回给自己的UTXO), 会返回给你自己的钱包, 
       2. 10(这个UTXO, 即面额为10的纸币) 是给到了对方的钱包
       3. 5(面额为5的纸币) 是给到了矿工的钱包
     - 后面你再花钱, 只能花这1张纸币(面额为85). 作为交易的输入, 去发起新的transaction.
     - 最后 你想给把自己面额85的UTXO拆掉, 拆成30+50, 那么你发起第二笔tx, 接收方是自己, 面额为50. 那么, input是85的UTXO, output有三个
       1. 自己发给自己, 面额为的50的UTXO
       2. 剩下的面额为30的UTXO
       3. 还有面额为5的UTXO进了矿工的钱包

2. 加速交易的两种方法

   >  :heart: :heart: :heart:  不管你用RBF 还是用CPFP, 都需要确保自己UTXO的Balance是足够的, 不然是无法加速的 :heart: :heart: :heart: 

   1. RBF, 全称为**Replace-by-fee**, 即未确认的transaction, 可以用新的transaction(并给予新tx更高的gas) 来替代掉, 

      - 首先明确 只有是你自己的UTXO作为input, 才能去发起RBF :apple: 

      - 其次, 来[Here](https://mempool.space/zh/tx/235f48c900da514567d1e2a9a7e11e4611f5f4c0741ee9bd8903f57f28c28afe)查看你的tx是否可以RBF, 比如下面这一笔就可以进行RBF

      ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230510200518.png)

      - 最后 举个例子来说明, RBF是什么
        - 同样以上面钱包里只有 30+50 这两笔UTXO来说, 我新发起一笔tx, 利用50的UTXO 再次向老王转账10, gas设置为5, 这笔tx记为tx1
        - 那么如果tx1成交, 
          - 那么我的钱包里应该会有两个UTXO, 分别是30, 35这两张, 前者是没动的UTXO, 后者是tx1完成后返回来的UTXO
          - 老王钱包里则是 10+10, 两张UTXO
          - 矿工钱包是5+5+5 三张UTXO
        - 但是我发起tx1之后, 我想加速一下(这里有两个方面)
          1. 我不想给老王钱了, 想赖掉 
             - 那么这时候就可以用 RBF 来加速, 发起一笔新的tx, 称之为tx2, tx2是利用面额为50的这笔UTXO, 给自己转20, gas设置为10.
             - 这笔tx2 完成之后
               - 我的钱包里会有20 + 20 + 30, 这三张UTXO
               - 老王的钱包只有 10, 一张UTXO
               - 矿工的钱包里有 5+5+10, 三张UTXO
             - tx2会成交, 因此可以赖掉给老王的转账 :strawberry: 
          2. 我嫌弃gas太低, 想快点成交
             - 同样可以用 RBF进行交易, 发起一笔新的tx2, 利用面额为50的这笔UTXO, 给老王转账10, gas设置为10
             - 那么tx2完成之后
               - 我的钱包里会有 30+30 这两张
               - 老王钱包里会有 10+10 这两张
               - 矿工钱包里 则是 5+5+10, 这三张

   2. CPFP, 全称为 **Child Pays For Parent**, 即利用发起一笔gas高的子交易, 来加速父交易,

      > 因为想要确认高gas的子交易, 就一定要确认父交易

      - 首先明白, 所谓子交易指的是, 子交易的input, 用的是未能确认的父交易的output. 
        - 即我发起tx1, 给老王转账100 gas设置为10.  100作为tx1的output.
        - 老王想用我给他这100作为input, 给老李转50, 但是由于我的这笔tx1还没确认, 因此他只能发起一笔子交易tx2, gas设置为20, 来加速父交易.
        - 这里的父交易即tx1, 子交易即为tx2.

---

### 实践

1. 以[Sparrow Wallet](https://sparrowwallet.com/)来说, 启动testnet >>>> Tools-->Restart Testnet

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511131341.png)

   > 可以在测试网多玩一玩 :funeral_urn: 

2. Connect, 连接区块的时候, 可能不会很顺利, Clash开Direct会好一些, 如下图

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511131320.png)

   可以在clash配置文件的rules中添加以下内容 即可实现sparrow的这几个网络是直连, 其余的正常rule
   rules:
  - DOMAIN-SUFFIX,smtp,DIRECT
  - DOMAIN-KEYWORD,aria2,DIRECT
  - IP-CIDR,203.132.94.196/32,DIRECT,no-resolve
  - IP-CIDR,35.201.74.156/32,DIRECT,no-resolve
  - IP-CIDR,35.225.54.191/32,DIRECT,no-resolve
  - IP-CIDR,198.244.201.86/32,DIRECT,no-resolve
  - IP-CIDR,135.181.215.237/32,DIRECT,no-resolve
  - IP-CIDR,168.119.33.233/32,DIRECT,no-resolve
  - IP-CIDR,168.119.33.233/32,DIRECT,no-resolve
  # - DOMAIN-KEYWORD,electrum.diynodes,DIRECT
  - IP-CIDR,170.75.162.55/32,DIRECT,no-resolve

4. 领水合集

   1. https://testnet-faucet.com/btc-testnet/ 
   2. https://bitcoinfaucet.uo1.net/send.php
   3. https://testnet-faucet.mempool.co/

5. 面板介绍

   - ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511131701.png)

   - ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511131803.png)

   - ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511132019.png)

   - ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511132106.png)

   - ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511132305.png)

     - 介绍下左边的这几个面板
     - Transactions 指的是你作为接收方 或者 发送方的tx
     - Send, 是给某个地址发送BTC, 
       - payto字段是发送给谁
       - label是标识字符, 类似于注释
       - amount 是发送多少
       - Fee这里, 可以自己拖动来调节gas, 最后的 Fee = tx大小*gas 
     - Receive 这里, 即你可以选择用某个地址 接受外部转账
     - Address这里注意, 这里面的Address 都是你可以用的地址, 由于一套助记词生成N多地址, 所以这些地址都归属于你了, 他们名下的UTXO 你也都可以用, 如果想用某个UTXO, 直接选择该UTXO, 然后“Send Selected”即可 如下图![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511133200.png) 

     - UTXOs 这一栏, 即你可以花的UTXO, 与上面同理, 想花哪个选中, 选择小飞机图标即可, 如下图![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20230511133326.png)
     - Setting这一栏, 就不过多叙述了 :walking: 

6. BRF实践

   1. [txB](https://mempool.space/testnet/tx/88a1cbf571e041ea5abc73ad9c6444305f5056a3193bc2b09a021b4c3bb6fb5f) 替代 [txA](https://mempool.space/testnet/tx/b670e8df517b298716d8e6cdf512743d33013d2f0b08aac64f8250a7a258cd5b), 针对的是 “我嫌弃gas太低, 想快点成交” 这种情况, 大概原理如下
      - 我首先发起txA, 用 tb1qn2zt7xzc4nwe4m5rzg8jt4gr446h069vjunapj 地址中的一个面值为 1282sats的utxo(简称U1), 给tb1q66spu0n20ru23yhc6katlwu4j9xl4sn9yxrnwh 这个地址转账1131sats, gas花 151stas. (151 + 1131 = 1282)
      - 后面发起RBF, 即为txB, 用上面的 U1 以及 另外一个面值为 1712sats的UTXO(简称U2), 这两个utxo, 作为input, 给tb1q66spu0n20ru23yhc6katlwu4j9xl4sn9yxrnwh 这个地址 转了 2610sats, gas花了384,  (1282 + 1712  = 2610 + 384)
      - 最后可见, txB成交, 而txA并没有成交
      - 这一笔之所以用两个UTXO, 是因为U1的balance不足以支撑txB
   2. [txB](https://mempool.space/testnet/tx/ba61a2570ac84df4ef944a9ddd395f96062faca0b34674b3a4a04fe2ea5dc030) 替代 [txA](https://mempool.space/testnet/tx/c137e29073fef2e7c68a523fdb0a36451a63e36d19a9806ed68c76ff5ce248fa), 针对的是 “我不想给老王钱了, 想赖掉 ” 这种情况, 大概原理如下
      - 我发起txA, 用 tb1qn2zt7xzc4nwe4m5rzg8jt4gr446h069vjunapj 地址中的一个面值为 8135sats的utxo(简称U1), 给tb1q4eqr370h7w37quke9nes5yc9ncnpctfpejv8df 地址转账294sats, gas为158sats
      - 后发起txB, 同样用U1, 给 tb1q4eqr370h7w37quke9nes5yc9ncnpctfpejv8df转账 294sats, gas为748
      - 最后txB成交, txA没有成交

7. CPFP实践

   1. [父交易](https://mempool.space/testnet/tx/8a7085d884f4f054cdae4457b3aeb52742329906db2ad446be1605db3d45764a) 和 [子交易](https://mempool.space/testnet/tx/03dbfd05e31c3d3fe02a47ef269856dff483f272233ff5d4dc1e1cbd9cda1ff5), 大概经过如下
      - 我首先发起父交易, 即tb1qn2zt7xzc4nwe4m5rzg8jt4gr446h069vjunapj (简称地址A) 一张面额为12281sats的UTXO(U1)作为input, 向tb1q4eqr370h7w37quke9nes5yc9ncnpctfpejv8df (简称地址B) 转账1000sats, 其余的11140sats退回到 tb1qzk35rutqjcuj7la95hvvcdqkczjv7dqwtyh6ls (简称地址C)
      - 然后我用地址C收到的11140sats, 发起向 tb1q80262jz5ytdfhj38ur4l7duect6qppc4j6unj7 (简称地址D)转账1000sats的子交易.
      - 由于子交易的提速, 所以父交易的有效费率 由1.01-->1.43, 而子交易的有效费率 由1.85-->1.43

8. 再强调一点, 玩BRC20的话, 不要RBF, 用CPFP(至于为什么 我了解不多, 不多说)

9. Sparrow中, 想发起加速的时候, Fee 和 amount 为什么标红?

   1. 如果有一个utxo, 并不是自己发起的, 只是别人给我的, 并且这个UTXO的value 只有546, 那就是太小了,
   2. 换句话说, 这个UTXO的余额 不足以支撑新UTXO的输入 以及 提升gas的费用(即不足以支付children)

---

<!-- ### 碎碎念(下面不必细看, 只是自己Record)

1. Bank
   - 以Mint Bank的 这笔tx举例 https://mempool.space/tx/235f48c900da514567d1e2a9a7e11e4611f5f4c0741ee9bd8903f57f28c28afe, 
   - 这笔交易的输入钱包是 https://mempool.space/address/bc1p04knh5g4nrhjg93m6698sgegpvt9zcpmsj5a3665m432p4kwqxjshjfsuf, 这个钱包并不受我们控制, 而是unisats的.,
   - 注意去看交易历史, 这地址是有一笔由我们的地址 发过去的tx: https://mempool.space/tx/d1bf11c9753ec1da44a53e53b6d09eea0eae98b772582d4253ccd8641ffac17b 并且gas并不高 还能成交, 也没有parent, 可能是我加速或者矿池的原因?
   - 我们把钱打到他的地址上, 然后他帮我们发起Mint Bank的那笔tx
   - **我们其实是没有办法加速mint bank的这笔 tx的, 因为只有一个输出归属于我们 就是546sats的, 不足以支付gas以及amount**
   - 其余的uf 都是铭文, m6结尾的钱包 我们也不能控制

2. VMPX
   - Mint的tx: https://mempool.space/tx/451e589d20b8204fa6c80ba422119053c3d89099287bb0b69e1f9248a2feb1e8 
   - 同上面, 我们是给这个地址转账的 https://mempool.space/address/bc1ptx70g83k0hvsk2ay3xayy9ver4hwvv9vqt4j87pgtshqmgusvcgsldlyam 

3. Sparrow中, 想发起加速的时候, Fee 和 amount 为什么标红?
   1. 如果有一个utxo, 并不是自己发起的, 只是别人给我的, 并且这个UTXO的value 只有546, 那就是太小了,
   2. 换句话说, 这个UTXO的余额 不足以支撑新UTXO的输入 以及 提升gas的费用(即不足以支付children)


4. $RUN
   这次我用Looks 打得, 打完之后发现可以退款 (但是显示的那个数额不对, 退不回来那么多)
   它是在哪里下功夫了呢, 我们打NFT 需要用自己的钱包A 发给 平台钱包B 一定数额的钱, 第二步 B钱包会给N个小钱包打钱, 最后小钱包会给我们546sats, 里面是铭文
         他在第二部 也就是 B钱包给N个小钱包打钱的时候, 用了RBF 给替换掉了, 拉高gas冲的 (可能需要覆盖掉小钱包交易的gas) 如tx所示: https://mempool.space/zh/tx/69b8e6ab0f2d384a70dd3a67d4a1ffe4a4465e6a99ea5facbc541670cdf90261 
--- -->

感谢康纳和alex两位大哥的技术指导
