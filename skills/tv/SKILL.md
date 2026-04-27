---
name: tv
description: TradingView Desktop control via CLI. Use when working with charts, Pine Script, indicators, replay, screenshots, price data, or any TradingView interaction. Trigger phrases: "tradingview", "my chart", "pine script", "tv", "screenshot chart", "what's the price", "change symbol", "indicators".
---

# TradingView CLI

Control TradingView Desktop via the `tv` command. Auto-detects CDP port.

## Quick Reference

```bash
tv status                         # check connection
tv state                          # symbol, timeframe, indicators
tv quote                          # current price
tv symbol <TICKER>                # change symbol (AAPL, ES1!, BTCUSD)
tv timeframe <TF>                 # change timeframe (1, 5, 15, 60, D, W)
tv type <TYPE>                    # chart type (Candles, Line, HeikinAshi, Area, Renko)
tv ohlcv --summary                # compact price stats
tv screenshot -r chart            # capture chart region
tv info                           # symbol metadata
tv search <QUERY>                 # search symbols
```

## Decision Tree

### "What's on my chart?"
1. `tv state` → symbol, timeframe, chart type, indicator list with IDs
2. `tv values` → current indicator values (RSI, MACD, BBands, EMAs)
3. `tv quote` → real-time price, OHLC, volume

### "Analyze my chart" (full workflow)
1. `tv quote` → current price
2. `tv values` → all indicator readings
3. `tv data lines` → price levels from custom indicators
4. `tv data labels` → text annotations with prices
5. `tv data tables` → session stats, analytics tables
6. `tv ohlcv --summary` → price action summary
7. `tv screenshot -r chart` → visual confirmation

### "Change the chart"
- `tv symbol AAPL` → switch ticker
- `tv timeframe D` → switch resolution
- `tv type Candles` → switch chart style
- `tv scroll 2025-01-15` → jump to date
- `tv range --from 1700000000 --to 1710000000` → zoom to range

### "Work on Pine Script"
→ Use the tv-pine skill for the full development loop

### "Practice trading"
→ Use the tv-replay skill for replay mode

### "Draw on chart"
```bash
tv draw shape --type horizontal_line --price 24500
tv draw shape --type trend_line --x1 <ts> --y1 <price> --x2 <ts> --y2 <price>
tv draw shape --type text --text "Key level" --price 24500
tv draw list                      # see drawings
tv draw remove-one --id <id>      # remove one
tv draw clear                     # remove all
```

### "Manage indicators"
```bash
tv indicator add --name "Relative Strength Index"    # USE FULL NAMES, not "RSI"
tv indicator add --name "Moving Average Exponential"
tv indicator remove --id <entity_id>
tv indicator toggle --id <entity_id>
tv indicator set --id <entity_id> --input length=200
```

### "Multi-pane layouts"
```bash
tv pane list                      # list panes
tv pane layout 2x2               # set grid (s, 2h, 2v, 2x2, 4, 6, 8)
tv pane focus 0                   # focus pane by index
tv pane symbol 1 ES1!             # set symbol on pane
```

### "Alerts"
```bash
tv alert list
tv alert create --condition crossing --value 24500
tv alert delete --id <id>
```

### "Screenshots"
```bash
tv screenshot                     # full window
tv screenshot -r chart            # chart only
tv screenshot -r strategy_tester  # strategy tester panel
```

## Context Management

- Always use `--summary` on `tv ohlcv` unless individual bars are needed
- Prefer `tv screenshot` for visual context over large data pulls
- Call `tv state` once at start, reuse entity IDs from the result
- Avoid `tv pine get` on complex scripts (can return 200KB+)

## Indicator Names

MUST use full names:
- "Relative Strength Index" (not RSI)
- "Moving Average Exponential" (not EMA)
- "Bollinger Bands" (not BB)
- "Moving Average" (for SMA)
- "Average True Range" (not ATR)
- "Volume" (not VOL)

## Data Commands

```bash
tv data lines                     # price levels from custom indicators
tv data labels                    # text annotations with prices
tv data tables                    # session stats, analytics tables
tv data boxes                     # price zones
tv data strategy                  # strategy performance metrics
tv data trades                    # trade list
tv data equity                    # equity curve
tv data depth                     # order book depth
tv data indicator                 # indicator data
```

All `tv data` commands accept `--filter <name>` to target a specific indicator.
