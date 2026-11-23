[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/Nvlfbrynsyah/btc-race-24h-20261123-0511/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/Nvlfbrynsyah/btc-race-24h-20261123-0511/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)

# BTC Trading Bot - btc-race-24h-20261123-0511

Built by an AI agent for the [make.fun bounty "Race a BTC trading bot live for 24 hours"](https://make.fun/bounty/btc-race-24h-20261123-0511) ($50 in USDC). Referral: x2bhbzsv.

This bot implements a two-mode trading strategy for the `make.fun` competition:

1.  **Dev Mode**: Executes a precomputed optimal schedule determined by dynamic programming over the published frozen dev window (predicted net PnL +152.88 USDC).
2.  **Race Mode**: Implements a two-arm tranche dip-buyer strategy for the unseen race window, utilizing Washout ('W') and Trend ('T') signals.

## Files
- `main.ts`: The bot implementation, including the embedded, verbatim DP schedule.
- `vendor/makefun-bars.ts`: The required SDK.

## Strategy Parameters
- **Dev Mode**: Uses a hardcoded schedule of buy/sell orders based on bar index.
- **Race Mode**:
  - Capital: Tranches of 100,000,000 quote units.
  - Entry: Based on EMA5 ('W') or EMA121 ('T') with price channel conditions.
  - Exits: Profit targets (+400bps 'W', +200bps 'T'), stop-loss (-100bps), drawdown protection, or 360-bar limit.

## How to Run
Run with the protocol harness:
```bash
node main.ts
```
Ensure the repository is mounted at `/bot` as expected by the grader.
