---
name: tv-pine
description: Pine Script development loop in TradingView — write, inject, compile, fix errors, iterate. Use when developing, debugging, or modifying Pine Script indicators or strategies.
---

# Pine Script Development

## Quick Loop

```bash
# 1. Write your script to a .pine file
# 2. Inject into TradingView
tv pine set -f script.pine

# 3. Compile
tv pine compile

# 4. Check errors
tv pine errors

# 5. Fix if needed → go back to step 2
# 6. Verify visually
tv screenshot -r chart

# 7. Save to TradingView cloud
tv pine save
```

## Full Commands

```bash
tv pine get                       # read current source from editor
tv pine set -f <file>             # inject source from file
tv pine set                       # inject from stdin (pipe)
tv pine compile                   # smart compile + error check
tv pine errors                    # read compilation errors
tv pine console                   # read log.info() output
tv pine save                      # save to cloud (Ctrl+S)
tv pine new <indicator|strategy|library>  # create blank script
tv pine open "My Script"          # open a saved script
tv pine list                      # list saved scripts
tv pine analyze -f <file>         # offline static analysis (no TV needed)
tv pine check -f <file>           # server-side compile check (no chart needed)
```

## Development Workflow

### New Script
1. Determine: indicator, strategy, or library?
2. Write to local `.pine` file — MUST start with `//@version=6`
3. `tv pine set -f <file>` → inject
4. `tv pine compile` → compile
5. Loop until clean, then `tv pine save`

### Modifying Existing Script
1. `tv pine get` → pull current source (WARNING: can be large)
2. Edit the local file
3. `tv pine set -f <file>` → inject
4. `tv pine compile` → compile
5. Loop until clean

### Strategy Development
1. Write strategy with `strategy.entry()` / `strategy.exit()`
2. Compile and fix errors
3. `tv screenshot -r strategy_tester` → check results
4. `tv data strategy` → get performance metrics
5. `tv data trades` → get trade list
6. Iterate on the logic

## Common Pine Errors

- **"Mismatched input"** → indentation issue (Pine uses 4-space indentation, not braces)
- **"Could not find function or function reference"** → typo or wrong version function
- **"Undeclared identifier"** → variable used before declaration
- **"Cannot call X with argument type Y"** → wrong parameter type
- **"The script is too long"** → simplify or split logic

## Script Template

```pine
//@version=6
indicator("My Indicator", overlay = true)

// Inputs
length = input.int(14, "Length", minval = 1)
src = input.source(close, "Source")

// Calculation
value = ta.sma(src, length)

// Plot
plot(value, "SMA", color.blue, 2)
```

## Important Notes

- Always compile after every change — never claim "done" without a clean compile
- Use `tv pine console` to read `log.info()` debug output
- `tv pine get` can return 200KB+ for complex scripts — avoid unless editing
- `tv pine analyze` and `tv pine check` work without a chart (offline tools)
