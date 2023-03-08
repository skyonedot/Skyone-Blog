---
title: 'Curve九问'
date: '2023-03-03'

---

![](https://images.pexels.com/photos/10255591/pexels-photo-10255591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

> Photo by Mike Marchetti


## Curve基础知识

1. Curve是什么? 
   - 专注于稳定币的Dex, V2也开始着手非稳定性资产
     - 与V2着手争取长尾资产流动性, 对应的其实是Uni V3的稳定币市场 
     - 就目前来看, 大额稳定币(100k+)的数额来看, Curve更好一些
2. Curve的ve模型是怎么运行的
   - 用户持有CRV, 可以选择把CRV锁起来(一年到四年) 
     - 如果锁一年 则1CRV=0.25veCRV, 如果锁四年 则1CRV=1veCRV
     - 目前最少可以锁一周, 最多可以锁四年, **如果锁一周, 10CRV对应0.05veCRV** 
   - 持有veCRV的好处
     - 持有veCRV 可以拿到交易手续费的50%(剩下的50%是分给了LP)
       - 这部分钱是用3pool池子的LPToken的形式返回回去, 即以[3CRV](https://etherscan.io/token/0x6c3f90f043a72fa612cbac8115ee7e52bde6e490)  :link: Token的形式分发奖励
     - 投票决定每周CRV的排放配比, 即如何分配CRV在Pool中的排放
       - Curve上的池子如果想要提高自己深度, 那么需要尽可能吸引LP 
       - 而如果争取到了非常多的CRV排放, 那么可以吸引很多LP
       - **其中治理投票权是 $veCRV 最为重要的功能**
         - 投票的话, CRV没有投票权, **只有veCRV有**
         - 可以通过这里查看, 每个池子的分配占比 [戳我](https://dao.curve.fi/minter/gauges)  :link:
     - Booster, 即拥有veCRV可以助力自己的LP, 使其有更高的年化
       - 首先需要明确 你需要锁多少CRV, 不同的池子有不同的要求  
         - [戳我](https://dao.curve.fi/minter/calc)  :link: 可以计算出针对某个池子, 多少CRV/veCRV可以获得多少boost 
         - 如果说此时此刻, 手里有veCRV了, 那么下面就需要进行Boost, **所有的在池子中的LP都会自动获得Boost** :apple:  
           - 注意这里, 比如我有3000veCRV, 那么我的所有LP是自动获得Boost的, 比如A,B两池子, A池子需要3000veCRV才能达到2.5x, 而B池子3000veCRV只能1.5x, 那么当我持有3000veCRV的时候, 我A池子会获得2.5x, B池子会获得1.5x
3. Deposit和Stake是什么意思, 代表什么意思? 
   -  Deposit对应Base奖励
      - Deposit这一步, 是把你的Token变成LPToken, 即钱包里少了相应的Token, 但是多了LPToken
        - 拿到LPToken之后, 还能去别的平台Stake, 不一定局限在Curve中
   -  Stake对应CRV奖励
      - 对应50%的交易手续费
      - Stake这一步 是把你的LPToken 放到了池子里, 即把你的LPToken放到了池子中
   -  这里要重点解释一些Deposit和Stake :red_circle: 
      -  Deposit指的是, 把你的真金白银放到了Curve, 返回给你一个存款凭证(LPToken), 这时候你可以享受到Swap的奖励(即Curve标注的Base奖励)
      -  Stake值得是, 你把你的凭证(LPToken), 又放到了某个池子里, 这时候你享受的是Curve给你的CRV奖励(对应上面Boost的那部分奖励)
         -  当然, 这一步的Stake 可以不必选择Curve, 一些衍生平台, 比如Convex也可以的
   -  反过来看 Withdraw和unStake, 一样的道理, 不再多说
4. CRV的代币模型
   - 总量3.03b
     - 62%给到LP, 即将LPToken放到池子中的人, 对应上面我们讲的Stake那些人
     - 30%给团队和投资者, 在2--4年内归属完毕
     - 3%给到员工, 2年归属完毕
     - 5%作为社区的储备金
   - CRV释放 以及 veCRV的数量查看, [戳我](https://dao.curve.fi/releaseschedule) :link:
   - 当前时刻以及下一周的池子占比查看面板, [戳我](https://dao.curve.fi/gaugeweight)  :link:
   - 注意一点, 每条链上不一定会有CRV的排放, 比如OP上就没有CRV排放
5. Curve的Revenu和Fee? 
   - 这里区分一下Fee和Revenue
   - Fee指的是手续费, 比如Curve 3pool的池子的手续费是0.01%, 即你想Swap 1MUSDT变成DAI的话, 在3pool池子, 需要交100U的手续费, 其中50U返回给LP, 剩余的50U给veCRV的持有人
   - Revenue则是指的是收入, 由于veCRV的持有可以分到大量的手续费, 所以整个CurveDAO是有着很好的经济收入的
6. Curve上的Swap, Deposit, Stake需要收费吗?
   - Swap需要收费, **这个费率由池子的创建者来定, 和veCRV持有人没有关系, 不一定是0.04%, 比如3pool的Fee就是0.01%**
     - 这里要指出来的是, 很多文章都说Fee是固定在0.04%是不对的, 只是大多数stable pool的fee是0.04% :battery: 
   - 关于Deposit/Withdraw的手续费, 重点看, 这里其实很多文章模糊其词 :red_circle: 
     - 有可能收费, 有可能不收费, 看情况来定, 举个例子来看
     - 如果你想单边存入池子, 比如ETH/stETH 的池子, Fee是0.04%, 由于单边存入, 即钱包里只有ETH, 所以你在Deposit的时候, 系统会自动帮你Swap一半的ETH变成stETH, 这一笔Swap的费率是要收的, 即这一笔Deposit收取了整体资金的0.02%作为Fee
     - 如果你正好存入等同数量的ETH和stETH, 那就没有Deposit Fee 
     - 关于Withdraw, 同理, 如果你想单边取, 则是收一半的Swap Fee(因为只有一半资金去Swap了), 如果两边取, 没有Fee的抽取
   - 关于Stake和unStake手续费
     - Stake/unStake 没有手续费
7. Pool会分类吗? 会分成Basepool和高级Pool吗?

   - 如果有足够多的veCRV, 那么可以设定Metapool, 甚至设定Basepool, 而basepool是curve上面很重要的一环, 作为curve上的基础流动性, 不但其余的项目方非常认可, 而且享受着各个项目在Curve上的补贴

   - 什么是basepool和metapool?
     - 3pool, [fraxbp](https://curve.fi/#/ethereum/pools/fraxusdc/deposit) :link: 肯定是base, 3pool是最常见最知名的, fraxbp的tvl也蛮高的
     - 如何分辨basepool?
       - 其实这里没有很明确的划分界限, 比如有一个池子是A\B配对, 并且A\B很知名, 大家都想跟A\B一起做一个池子, 那么A\B就是一个basepool, 衍生出来的那些就叫做Metapool
   - 什么是Metapool ?
     - 和basepool组合起来的池子, 比如gusd和3pool池子, [戳我](https://curve.fi/#/ethereum/pools/gusd/deposit) :link:
8. Factory是什么意思? 
   - 任何人都可以在Curve上部署池子, 但是, 但是不一定会在UI界面显示, 需要满足某些审计, TVL要求等等才会在UI显示
   - **未经认证的池子**, 会有Factory的字样提示
     - 未经认证的池子, 也会有50%的Fee给到Cruve (那的确比不上在Uni建池子 :heart_eyes_cat: )
     - Curve不对任何Factory的池子负责, 他们能做的只是调整池子的某个参数
   - 如果要变成Curve认证的池子的话, 需要veCRV投票决定
9. Curve War
   - 由于上面提到, 项目方想要自己的池子足够大, 就要争取足够多的CRV排放奖励, 那么有两种办法
     - 自己买CRV
     - 贿赂veCRV的持有人, 使其帮自己投票
       - Curve War的发生, 主要是围绕**贿赂**开展
       - 比如项目A想要自己的代币池子有更高的CRV排放, 那么A就可以拿出自己的代币, 来奖励那些投票给自己池子增加CRV排放的地址
   - 直接的贿选平台 [Bribe.crv](https://bribe.crv.finance/) :link:   [votium.app](https://votium.app/) :link:

---

下面是一些关于Convex的简单介绍

1. Convex

   - 经历Curve War之后, 就目前而言 , Convex手里拿到了最多的veCRV, [Dune查看面板](https://dune.com/queries/56185/111481):link:  这意味着Convex在Curve治理中有着举足轻重的地位, **因为Convex能决定CRV对池子的排放比重**
   - 用户可以选择将自己的CRV, 质押到Convex, 获得cvxCRV, 注意, cvxCRV是不能直接被转换成CRV的(veCRV是到期之后可以转换), 即CRV--->cvxCRV这一步不可逆, 当然, 可以从二级市场把cvxCRV兑换回去, 但是这一步并不是刚性兑换, 有失锚的风险
   - 持有cvxCRV的好处
     - 原来持有veCRV会获得50%的交易手续费, 这一部分不变, 持有cvxCRV仍然能获得
     - Convex上面质押CRV的奖励 :red_car:
     - 额外的CVX奖励 :red_car: 
     - **但是注意, cvxCRV是没有办法在Curve上投票的** :heart: 

2. CVX的经济模型

   - 最大供应量100M, 50%给Convex上的LP, 25%给平台流动性挖矿奖励
     - 类似于CRV, 用户可以锁定CVX16周(远远小于CRV的一年到四年), 拿到一个vlCVX, 有了vlCVX就可以参与对Convex的治理, 投票决定Convex持有的veCRV来分配Curve上各个池子的CRV排放
       - **套娃王中王**

   - 拥有CVX就拥有了对Convex的治理, 就控制了Convex持有的veCRV, 进而控制了Curve

   - CVX的持仓情况, [戳我](https://daocvx.com/leaderboard/) :link:





---

## 参考文献

1. https://mirror.xyz/0xdebox.eth/8adEblyOn5h3fBUlroQCulnblHVZ6Kw7PaHqmtsr2CU
1. https://medium.com/@cic.ethan/%E6%B7%BA%E8%AB%87%E7%A9%A9%E5%AE%9A%E5%B9%A3%E4%BA%92%E6%8F%9B%E6%A9%9F%E5%88%B6-%E5%BE%9E-balancer-%E5%88%B0-curve-f638f29b33f9
1. https://youtu.be/-mgTFaOFcvg
1. https://www.reddit.com/r/CurveFinance/comments/iukcmo/whats_the_diff_of_deposit_and_deposit_and_stake/
1. https://twitter.com/HaowiWang/status/1625360485658025985?s=20
1. https://resources.curve.fi/crv-token/understanding-tokenomics