---
name: tradingview-replay
description: Practice trading in TradingView replay mode — step through historical bars, take trades, track P&L. Use when practicing entries/exits, backtesting manually, or replaying historical price action.
---

# Replay Practice Trading

## Quick Start

```bash
# 1. Set up
tv symbol ES1!
tv timeframe 5
tv replay start --date 2025-03-01

# 2. Step through bars
tv replay step                     # advance one bar
tv replay autoplay --speed 1000   # auto-advance (ms between bars)
tv replay status                   # check date, position, P&L

# 3. Take trades
tv replay trade --action buy
tv replay trade --action sell
tv replay trade --action close

# 4. Finish
tv replay stop
```

## All Commands

```bash
tv replay start --date 2025-03-01  # enter replay at date
tv replay step                     # advance one bar
tv replay autoplay --speed 500     # auto-advance (speed in ms)
tv replay trade --action buy       # enter long
tv replay trade --action sell      # enter short
tv replay trade --action close     # close position
tv replay status                   # position, P&L, current date
tv replay stop                     # return to realtime
```

## Practice Workflow

1. **Setup** — pick symbol, timeframe, starting date
2. **Pre-trade analysis** — `tv ohlcv --summary`, `tv values`, `tv screenshot -r chart`
3. **Step through** — use `tv replay step` or `tv replay autoplay` to advance
4. **Identify setups** — slow down when price approaches key levels
5. **Execute** — `tv replay trade --action buy/sell`
6. **Manage** — check `tv replay status` for P&L
7. **Exit** — `tv replay trade --action close`
8. **Review** — summarize trades and lessons

## Tips

- Step 5-10 bars at a time to scan for setups, then slow down for entries
- Use `tv draw shape` to mark your entry/exit points for later review
- `tv screenshot -r chart` at key moments to build a trade journal
- After session: `tv replay status` for final P&L summary
