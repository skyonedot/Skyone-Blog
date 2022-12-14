---
title: '分布式系统'
date: '2022-11-26'
---

![](https://images.pexels.com/photos/2693529/pexels-photo-2693529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

### 分布式知识点

分布式一致性算法 顾名思义, 解决分布式的系统下如何达成一致的算法. 

>  为什么要分布式? 因为数据不能存在于单个节点上, 否则容易出现单点故障
>
>  为什么要一致性? 因为多个节点需要保证具有相同的数据

分布式指的是部署在不同的网络计算机上, 彼此仅通过消息传递进行通讯

---

###### 分布式系统主要存在两种问题

1. BFT问题(Byzantine Fault Tolerance)
   - 考虑的重点在于恶意节点的存在 :apple: 
2. CFT问题(Crash Fault Tolerance)
   - 考虑的重点在于系统崩溃性问题, 比如单点故障、 网络延迟等系统问题 :banana: 

---

###### 分布式系统的请求

只有三种状态

1. 成功
2. 失败
3. 超时, 超时又有两种情况
   1. 接收方根本就没有接收到消息
   2. 接收方接收到了, 返还给发送方的时候出了问题

---

###### ACID事务

指的是数据库管理系统(DBMS) 在写入或更新时, 为了确保Transaction是正确可靠的, 必须满足的四个特性

1. 原子性(Atomicity  Or 不可分割性) ------ 要么都完成, 要么都不完成.
2. 一致性(Consistency) ------ Transaction开始以前或者结束以后, 整个数据库的完整性没有被破坏 , 即写入的信息必须符合所有的要求.
3. 隔离性(Isolation, Or 独立性) ------ 数据库允许并发读写或者修改,  隔离性可以防止并发时由于交叉执行而导致的数据不一致
4. 持久性(Durability) ------ Transaction 完成之后, 对于数据的修改是永久的.

---

###### Base理论

指的是为了**解决强一致性而导致的可用性降低的一种方案** 

1. Basically Avaiable, 基本可用, 即分布式系统在出现故障时, 允许损失部分可用性, 
2. Soft State, 软状态, 即允许不同节点的数据副本之间的同步过程存在延迟
3. Eventually consistent, 最终一致, 即弱一致性

---

###### CAP理论

1. Consistency(一致性) , 分为强一致性和弱一致性
   1. 弱一致性: 也叫最终一致性, 即某个节点提交以后, 不会立即改变集群状态, 但是随着时间推移, 最后的状态是一样的
      1. 模型: DNS系统, Gossip系统
   2. 强一致性: 数据一致更新, 所有的数据变动是同步的. 即有一个节点更新, 则其余节点一起更新.
      1. 模型: Paxos, Raft(Multi-Paxos), ZAB(Multi-Paxos)
2. Availability(可用性) 指的是 响应性能
3. Partition tolerance(分区容错性), 可靠性, 即某一网络分区出现故障的时候, 仍然需要对外提供满足一致性和可用性的服务, 除非整个系统发生瘫痪.

**任何分布式的系统只能同时满足两点, 无法三者兼顾**

- CA系统, 即放弃P, 指的是所有的数据都放在一个节点上, 没有网络分区, 没有分布式, 所以**强一致性和可用性得到满足**
- CP系统, 即放弃A, 即要求分布式的情况下, 数据是一致的, 然后会导致无限的延迟, 同步的时间增大
  - 坚持ACID原则的DB 以及对于结果一致性非常看重的 一般会选择这个
- AP系统, 即放弃C, 并不是完完全全放弃一致性, 而是用的弱一致性,
  - 一些Base原则的数据库, Cassandra, CouchDB 一般是这样

> - 区块链不可能三角: 去中心化, 高可用性, 安全性
>
> - 货币不可能三角: 资本的自由流动, 固定汇率, 货币政策独立性

---

###### CFT一致性解决

1. 二阶段提交协议 2PC

   > 2PC和3PC 引入了两个角色
   >
   > - 协调者: 负责统一调度分布式节点的自信逻辑 [一个]
   > - 参与者: 被调度的分布式节点 [多个]

   - 先尝试, 后提交 

2. 三阶段提交协议 3PC

   - 先询问, 再执行, 最后提交

   > - 将2PC中的第一阶段, 拆成了先询问, 在执行
   > - 同时在协调者和参与者中引入超时机制

3. Paxos

   - 1990年提出, 基于消息传递且具有高度容错性特性的一致性算法, 公认的解决分布式一致性问题最有效的算法之一

   - 有三种角色, 可以一个节点多个角色

     - Proposers 提出提案, 提案信息包括提案编号和提议的Value
     - Acceptors , 对提案进行回复, 获得多数派yes的会被批准 $\frac{n}{2}+1$
     - learners, 只能学习被批准的提案

   - 有两个阶段, Proposer提编号为N的提案, 没有具体内容, 请求Acceptor,  然后, 提出具体内容

     > 如果两个Proposer 处于第一阶段, 互相提出编号更大的提案, 会陷入死循环,
     >
     > 防治机制: 选出一个主要的proposer
     >
     > 可以参考raft 竞选, 谁快谁当. 或者 PBFT依次成为leader

4. Zookeeper的ZAB协议

5. Raft

   > 动画版本Raft 链接 👉 [Here](http://thesecretlivesofdata.com/raft/). 强烈推荐  :heart:

   1. 两个阶段, leader选举 和 日志复制
   2. 三个角色
      - Leader. 负责发送要共识的数据
      - Follower 参与共识的角色
      - Candidate  Follower没有收到leader的心跳回应, follower会成为candidate 申请成为新的leader

---

### 区块链和分布式的关系

1. 一致性算法和冗余的数据存储: 共识算法和数据存储是两者最为相似的一点, 但是, 但是他们在目的上是完全不同的
   - **区块链的目的是构建一个尽可能去中心化, 数据资产所有权的永久保护和自由转让的世界**
     - **并不是对外提供某项服务, 而是对内构建资产世界**
   - 分布式数据库的目的这是构建一个逻辑中心, 这个中心可以对外提供尽可能的高性能, 低成本和扩展性好的服务
2. 不可能三角
   1. 区块链的不可能三角是安全, 去中心化, 可扩展性
   2. 分布式数据库这是 对业务的支持度, 工程实现复杂度 以及 硬件要求
3. 一致性含义是不一样的
   1. 区块链的一致性指的是多个节点对同一个数据状态的共同维护
   2. 分布式数据库的一致性则是多个数据副本对外的呈现
4. 共识算法是不一样的
   1. 区块链考虑的是BFT, 不超过1/3
   2. 分布式数据库考虑的是CFT, 不超过1/2

---

PBFT的三分之一

这里讲一下为什么PBFT的作恶节点数量不能超过1/3

预先知识

1. 每一个节点只能同时参加一轮投票, 即未出结果时, 该节点是lock的状态
2. 作恶节点的数量为f

作恶节点数量为f, 那么 善良节点最起码要为f+1, 还要给故障节点预留f的名额

> 故障节点的预留名额是f, 即故障的节点不能超过作恶节点数量, 因为超过之后, 无法达到2/3的投票, 即无法达成共识, 
>
> 之所以说预留是因为, 它在每轮的故障节点可以小于等于f, 
>
> - 如果小于f, 那么其余的则是诚实的节点, f+1 + N, 这样更好. 
> - 如果等于f, 那么在这轮投票中, 收集到了2f+1, 其中f+1是诚实, 那么结果也是好的

**那我们再说双花这个问题, 即在某个投票进行中, 会不会有一个同高度的 投票产生 **

> Tendermint

首先说, 不会, 因为在这一轮中投票的节点是锁死的状态, 无法为进行其他投票. 

当validator commit了区块B, 那么就有大于2/3的节点在R轮投了precommit, 这表明至少有

这里, 我还是没太懂 https://zhuanlan.zhihu.com/p/87370262

---

### PBFT

拜占庭容错算法(Byzantine Fault Tolerant)面向拜占庭问题的容错算法，解决的是在网络通信可靠，但节点可能故障和作恶情况下如何达成共识 

最早的讨论出现于1982年的 The Byzantine Generals Problem, 知道1999年PBFT的提出, 计算复杂度大大降低

BFT算法恶意节点都不可以超过三分之一

PBFT解决的什么? 

- 解决1982年提出的BFP, 原始的通讯效率过慢
- 解决的通讯效率和异步环境的问题
- client发送给primary, 三阶段共识, client回收
- view-change过程

---

### TenderMint

**共识层和应用层分开**. 分为两部分

> 共识层, 应用层, 网络层,. Tendermint是把应用拿出来
>
> Data available, consensus, (settlement, exeuction), Celistia是吧DA拿出来

1. Tendermint Core 负责共识 账本
2. Application BlockChain Interface, ABCI, 负责应用层建设. 支持任何语言的交易处理实现

先说TenderMintCore, **属于PBFT的变种, 但是引入了锁定机制**

整个系统中的节点分为两类

- Validator 负责Propose, Vote等
- Non Validator 同步状态 传递消息

节点与节点之间是Gossip协议 相互同步信息或共识状态, 节点不一定是两两相连

共识过程是若干个Round 加上Commit, NewHeight, 如下图所示

Round里面会包括

- Propose
- Prevote
- Precommit

如果一轮中有元素没有满足, 这会开始新一期Round

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221128225125.png)



#### TenderMint和PBFT

- 相同点
  - 同属BFT体系.
  - 抗1/3拜占庭节点攻击.
  - 三阶段提交, 第一阶段广播交易(区块), 后两阶段广播签名(确认).
    - Tendermint 的propose->pre-vote->pre-commit
    - PBFT的 pre-prepare, prepare, commit
  - 两者都需要达到法定人数才能提交块.
- 不同点
  - 节点概念不同, PBFT是节点数量,  Tendermint这是节点权益
  - PBFT需要预设固定的Validator, 而Tendermint是变动的 2/3认证的
  - 关于超过1/3节点是拜占庭节点的情况下
  - PBFT的View-Change机制





---

### 参考文献

[分布式一致性算法，你确定不了解一下](https://juejin.cn/post/6854573216174702605)

[区块链是分布式数据库吗(解析区块链和分布式数据库的区别)](https://www.yuanyuzhouneican.com/article-176750.html)

[Tendermint共识协议详解](https://juejin.cn/post/6844903973086822408)

[深度解析Tendermint, 快速融入Cosmos生态](https://zhuanlan.zhihu.com/p/38252058)

[Tendermint BFT协议](https://zhuanlan.zhihu.com/p/111770050)