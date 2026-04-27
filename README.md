# tradingview-cli

CLI and agent skills for TradingView Desktop via Chrome DevTools Protocol.

## What It Does

- **Control charts** — switch symbols, timeframes, chart types, zoom to dates
- **Develop Pine Script** — write, compile, analyze, and iterate with AI assistance
- **Capture screenshots** — full page, chart only, or strategy tester regions
- **Practice replay trading** — step through historical bars, execute simulated trades

## Prerequisites

- **TradingView Desktop** (paid subscription)
- **Node.js 18+**
- TradingView launched with `--remote-debugging-port=9222`

## Install

```bash
# Install the CLI globally
bun install --global "github:kml93/tradingview-cli"

# Install skills for your AI agent (works with Claude Code, Cursor, Cline, and 41+ others)
bunx skills add kml93/tradingview-cli -g
# OR
npx skills add kml93/tradingview-cli -g
```

## First Run

Launch TradingView with CDP enabled:

```bash
/path/to/TradingView --remote-debugging-port=9222
```

Then verify the connection:

```bash
tv status
```

The CLI auto-detects which port TradingView is on (scans 9222-9225). Override with:

```bash
CDP_PORT=XXXX tv status
```

## CLI Reference

### Connection

| Command     | Description                 |
| ----------- | --------------------------- |
| `tv status` | Check CDP connection        |
| `tv launch` | Launch TradingView with CDP |

### Chart

| Command                      | Description                            |
| ---------------------------- | -------------------------------------- |
| `tv state`                   | Get chart state (symbol, TF, studies)  |
| `tv symbol [SYMBOL]`         | Get or set chart symbol                |
| `tv timeframe [TF]`          | Get or set timeframe                   |
| `tv type [TYPE]`             | Get or set chart type                  |
| `tv info`                    | Symbol metadata                        |
| `tv search QUERY`            | Search symbols                         |
| `tv range [--from N --to N]` | Get or set visible range               |
| `tv scroll DATE`             | Scroll to date                         |
| `tv ui-state`                | Get UI state (panels, buttons)         |
| `tv discover`                | Report available TradingView API paths |

### Data

| Command                       | Description                    |
| ----------------------------- | ------------------------------ |
| `tv quote`                    | Real-time price quote          |
| `tv ohlcv [-n N] [-s]`        | OHLCV bars (summary with `-s`) |
| `tv values`                   | Current indicator values       |
| `tv data lines [-f FILTER]`   | Pine line.new() price levels   |
| `tv data labels [-f FILTER]`  | Pine label.new() annotations   |
| `tv data tables [-f FILTER]`  | Pine table.new() data          |
| `tv data boxes [-f FILTER]`   | Pine box.new() price zones     |
| `tv data strategy`            | Strategy performance metrics   |
| `tv data trades [-n N]`       | Strategy trade list            |
| `tv data equity`              | Strategy equity curve          |
| `tv data depth`               | Order book / DOM data          |
| `tv data indicator ENTITY_ID` | Indicator info and inputs      |

### Pine

| Command                     | Description                                   |
| --------------------------- | --------------------------------------------- |
| `tv pine get`               | Read current Pine Script source               |
| `tv pine set [-f FILE]`     | Set source (stdin or file)                    |
| `tv pine compile`           | Smart compile (auto-detect + error check)     |
| `tv pine analyze [-f FILE]` | Offline static analysis                       |
| `tv pine check [-f FILE]`   | Server-side compile check                     |
| `tv pine save`              | Save script (Ctrl+S)                          |
| `tv pine new [TYPE]`        | New blank script (indicator/strategy/library) |
| `tv pine open NAME`         | Open saved script                             |
| `tv pine list`              | List saved scripts                            |
| `tv pine errors`            | Read compilation errors                       |
| `tv pine console`           | Read console/log output                       |

### Replay

| Command                      | Description                    |
| ---------------------------- | ------------------------------ |
| `tv replay start [-d DATE]`  | Start replay mode              |
| `tv replay step`             | Advance one bar                |
| `tv replay autoplay [-s MS]` | Toggle autoplay                |
| `tv replay trade ACTION`     | Execute trade (buy/sell/close) |
| `tv replay status`           | Current replay state           |
| `tv replay stop`             | Stop replay                    |

### Draw

| Command                            | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| `tv draw shape [-t TYPE] -p PRICE` | Draw shape (horizontal_line, trend_line, rectangle, text) |
| `tv draw list`                     | List all drawings                                         |
| `tv draw get ENTITY_ID`            | Get drawing properties                                    |
| `tv draw remove ENTITY_ID`         | Remove drawing                                            |
| `tv draw clear`                    | Remove all drawings                                       |

### Alert

| Command                              | Description        |
| ------------------------------------ | ------------------ |
| `tv alert list`                      | List active alerts |
| `tv alert create -p PRICE [-c COND]` | Create price alert |
| `tv alert delete [--all]`            | Delete alerts      |

### Indicator

| Command                                              | Description         |
| ---------------------------------------------------- | ------------------- |
| `tv indicator add NAME [-i JSON]`                    | Add indicator       |
| `tv indicator remove ENTITY_ID`                      | Remove indicator    |
| `tv indicator toggle ENTITY_ID [--visible/--hidden]` | Show or hide        |
| `tv indicator set ENTITY_ID -i JSON`                 | Change inputs       |
| `tv indicator get ENTITY_ID`                         | Get info and inputs |

### Pane

| Command                       | Description                               |
| ----------------------------- | ----------------------------------------- |
| `tv pane list`                | List all panes                            |
| `tv pane layout LAYOUT`       | Set grid layout (s, 2h, 2v, 2x2, 4, 6, 8) |
| `tv pane focus INDEX`         | Focus pane by index                       |
| `tv pane symbol INDEX SYMBOL` | Set symbol on pane                        |

### Tab

| Command               | Description       |
| --------------------- | ----------------- |
| `tv tab list`         | List open tabs    |
| `tv tab new`          | Open new tab      |
| `tv tab close`        | Close current tab |
| `tv tab switch INDEX` | Switch tab        |

### Stream

| Command                        | Description                   |
| ------------------------------ | ----------------------------- |
| `tv stream quote [-i MS]`      | Stream price ticks            |
| `tv stream bars [-i MS]`       | Stream bar updates            |
| `tv stream values [-i MS]`     | Stream indicator values       |
| `tv stream lines [-f FILTER]`  | Stream Pine line levels       |
| `tv stream labels [-f FILTER]` | Stream Pine label annotations |
| `tv stream tables [-f FILTER]` | Stream Pine table data        |
| `tv stream all [-i MS]`        | Stream all panes              |

### UI

| Command                                     | Description                |
| ------------------------------------------- | -------------------------- |
| `tv ui click [-b BY] -v VALUE`              | Click UI element           |
| `tv ui keyboard KEY [--ctrl/--shift/--alt]` | Press key                  |
| `tv ui hover [-b BY] -v VALUE`              | Hover over element         |
| `tv ui scroll [DIR] [-a PX]`                | Scroll chart               |
| `tv ui find QUERY [-s STRATEGY]`            | Find UI elements           |
| `tv ui eval EXPR`                           | Execute JS in page context |
| `tv ui type TEXT`                           | Type into focused input    |
| `tv ui panel PANEL [ACTION]`                | Open/close/toggle panel    |
| `tv ui fullscreen`                          | Toggle fullscreen          |
| `tv ui mouse X Y [--right] [--double]`      | Click at coordinates       |

### Screenshot

| Command                               | Description              |
| ------------------------------------- | ------------------------ |
| `tv screenshot [-r REGION] [-o NAME]` | Capture chart screenshot |

## Attribution

Fork of [tradingview-mcp](https://github.com/tradesdontlie/tradingview-mcp) by [tradesdontlie](https://github.com/tradesdontlie).

## Disclaimer

This project is provided for personal, educational, and research purposes only. It is not affiliated with, endorsed by, or associated with TradingView Inc. You are solely responsible for ensuring your use complies with TradingView's Terms of Use and all applicable laws. Use at your own risk.

## License

MIT
