---
title: 'Test'
date: '2020-02-01'
---



# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote



A note[^1]

[^1]: Big note.

## Strikethrough
$x_i=3$

:apple: 

🍄

$$x_2=3$$

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

> bushi

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |
| a | b  |  c |  d  |

## Tasklist

* [ ] to do
* [x] done


```javascript
function myFunction() {
  return true;
}
```

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract TimeDelayed is Ownable {
    uint32 constant timePeriod = 60 * 60 * 24 * 30;// one month
    uint256 public lastWithdrawTime;
    mapping(address => uint256) public remainTokens;
    uint256 public constant withdrawEtherNumber = 0.01 ether;
    uint256 public constant depositEtherNumber = 0.01 ether;
    uint32 triedNumber;
    bool isRegister;

    modifier counter() {
        triedNumber++;
        _;
    }

    modifier onlyOnce() {
        require(isRegister == false, "Already registered!");
        _;
        isRegister = true;
    }

    function withdraw() counter public {
        unchecked {
            require(block.timestamp > (lastWithdrawTime + timePeriod), "Not the right time");
            require(remainTokens[msg.sender] <= address(this).balance,"Contract does not have enough token");
            require(remainTokens[msg.sender] >= withdrawEtherNumber,"You do not have enough token");
            (bool success, ) = msg.sender.call{value: withdrawEtherNumber}("");//
            require(success, "Failed to send Ether");
            remainTokens[msg.sender] -= withdrawEtherNumber;
            lastWithdrawTime = block.timestamp;
        }
    }

    function deposit() payable counter public {
        require(block.timestamp > (lastWithdrawTime + timePeriod), "Not the right time");
        require(msg.value >= depositEtherNumber);
        remainTokens[msg.sender] += depositEtherNumber;
        if(msg.value > depositEtherNumber) {
            (bool success, ) = msg.sender.call{value: (msg.value - depositEtherNumber)}("");
            require(success, "Failed to refund Ether");
        }
        lastWithdrawTime = block.timestamp;
    }

    function depositByOwner() payable onlyOwner public {

    }
}
```

---
