# SafeCDP

SafeCDP is a decentralized protocol for preventing [CDPs](https://cdp.makerdao.com/) from auto liquidation.  CDP is the lending service that underpins the stablecoin [DAI](https://makerdao.com/en/whitepaper/).

## Disclamer

Most of the code in this repo is the remains from [ETHDenver 2019](https://www.ethdenver.com/), where this project was selected as a winner.  We are currently rewriting the code to make it suitable for production usage.  Until then, you are discouraged from using it on any valuable CDP.

## Motivations

A CDP is [automatically liquidated](https://makerdao.com/en/whitepaper/) when the value of its collateral has fallen to a point that it's deemed too risky.  When liquidation occurs, part of the collateral is sold (at a discount) to cover the outstanding debt.  This is typically highly undesirable for the CDP owner, who would much rather keep their collateral intact.

To prevent their CDP from being liquidated, a CDP owner typically over-collateralize the CDP by 300%-400%.  While this does provide a high degree of safety (though by no means any guarantees), it's highly capital inefficent comparing to most centralized lending solutions, who typically only require a collateralization ration between 100%-200%.  In other words, given the same amount of collateral, you'd be able to borrow less from CDP than from most other lending platforms.

## Solution 

SafeCDP aims to provide a lending experience similar to a traditional lending platform, albeit in a decentralized and trustless way.  In SafeCDP, if the value of your collateral falls below a certain threshold, you are given a "margin call", i.e. a notification to add more collateral or repay some debt.  As long as you respond to the margin call within a given period of time, nothing can happen to your collateral.  Your collateral is only sold if you fail to respond to your margin call.

To accomplish this, SafeCDP is made up of three major components: CDP Manager, keeper, and liquidity pool.

### CDP Manager

A CDP Manager is a smart contract that owns a CDP.  To use SafeCDP, you first need to transfer your CDP to a CDP Manager.

A CDP Manager allows a third party, namely keepers, to wipe your debt for you when your CDP is close to liquidation.  The manager guarantees that if you don't eventually repay the keeper plus some interest, then the keeper is entitled to part of your collaterals.

Note that as a corollary, you only ever need to pay a keeper if the keeper in fact paid your debt for you.  If your CDP was never in any danger of liquidation, then you don't have to pay anything.  This means it's almost always a good idea to secure your CDP with SafeCDP, since it resembles an insurance plan with no upfront cost (beyond gas fees).

### Keeper

A keeper is a computer program that monitors CDPs owned by CDP Managers.  When the value of the collateral for such a CDP drops below a certain threshold, the keeper wipes some debt for the CDP through the CDP Manager.

The CDP owner is expected to repay the keeper with the principal plus some interest.  If the CDP owner does not repay the keeper, the keeper can liquidate some collateral through the CDP manager to cover its expenses and some more.

The keeper does not necessarily need to use its own money to cover the debt, however.  Some CDPs can be quite large, so it's unreasonable to expect a keeper to happen to own enough money to cover the debt.  If the keeper prefers, they can instead use money from the liquidity pool.  

### Liquidity Pool

The liquidity pool is a smart contract that holds a reserve of DAI.  Anyone can deposit DAI to the pool in exchange for shares.  Shares can be later redeemed for presumably more DAI than what you originally deposited, should the size of the pool grows.

When a keeper draws DAI from the pool to cover debt, the keeper is obligated (guaranteed by smart contracts) to share part of the revenue with the pool.

The pool is programmed such that DAI can only be drawn when used by keepers to cover debt for CDPs, ensuring that the fund cannot be stolen or used for other purposes.

One outstanding question is how we can put the capital in the pool to more effective use when it's not being used to cover debt.  One obvious idea is to put it in [Compound](https://compound.finance/) to accure interest, and withdraw only when needed by keepers.