---
name: tradingview-pine
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

## Runtime Debugging

**`tv pine console` does NOT show runtime errors.** To diagnose a silent crash:

```bash
# 1. Check if indicator is on chart but produces nothing
tv state                    # indicator listed but 0 output = runtime crash
tv data tables              # empty = crash
tv data labels              # empty = crash
tv data boxes               # empty = crash
tv values                   # empty = crash

# 2. Add debug via table in Pine code:
#    table.cell(tbl, 0, row, "DBG", text_color = color.yellow)
#    If table shows → script runs but logic is wrong
#    If table doesn't show → crash before render

# 3. Deploy a minimal version (no UDTs) to isolate:
#    - If minimal version works → issue is in UDTs/logic
#    - If minimal version crashes → fundamental issue (mintick, bar 0, etc.)
```

**Common runtime errors:**
- **RE10045**: `array.get()` index out of bounds → often caused by `syminfo.mintick = na` on bar 0
- **Silent timeout**: free plan = 20s max → O(n²) sort on every historical bar = timeout

## Adding Indicator to Chart

The "Add to chart" button in Pine Editor can be unreliable. Reliable workflow:

```bash
# After successful compilation, click via JS eval:
tv ui eval --js "const addBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add to chart') && !b.textContent.includes('Saved') && b.offsetParent !== null); if (addBtn) { addBtn.click(); 'Clicked'; } else { 'Not found'; }"

# If "Cannot add unsaved script" dialog appears:
tv pine save && sleep 2 && tv ui eval --js "const saveAddBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save and add to chart'); if (saveAddBtn) { saveAddBtn.click(); 'Clicked'; } else { 'Not found'; }"
```

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
- `tv pine console` does NOT show runtime errors (RE codes) — see Runtime Debugging section

## Pine Editor Tab Management

The Pine Editor has multiple tabs. `tv pine set` writes to the currently visible tab but does NOT update the editor's internal model state. This causes issues:

1. **Save may revert to old content** — The "Save" action saves the editor's internal model, not the DOM text
2. **"Add to chart" triggers "unsaved changes" dialog** — because the editor detects a diff between its model and the visible text
3. **Multiple tabs confusion** — `tv pine open` opens a script but the active tab might differ

**Reliable workflow for deploying a new script:**
```bash
# 1. Remove existing indicator from chart (free up slot)
tv indicator remove --id <entity_id>     # from tv state

# 2. Open an EXISTING saved script (not "new") — this ensures a proper save target
tv pine open --name "Test SMA"           # or any sacrificial script

# 3. Inject your code
tv pine set -f /path/to/script.pine

# 4. Compile (this triggers save in the Pine Editor)
tv pine compile

# 5. Add to chart via JS eval (more reliable than CLI button click)
tv ui eval --js "const addChartBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add to chart') && !b.textContent.includes('Saved') && b.offsetParent !== null); if (addChartBtn) { addChartBtn.click(); 'Clicked'; } else { 'Not found'; }"

# 6. If dialog "Cannot add unsaved changes" appears:
tv ui eval --js "const saveAndAddBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save and add to chart'); if (saveAndAddBtn) { saveAndAddBtn.click(); 'Clicked'; } else { 'Not found'; }"

# 7. Wait and verify
sleep 3 && tv state
```

**Why `tv pine new indicator` is unreliable:** It creates a new unsaved tab. The editor doesn't have a save target, so "Save and add" may fail or save to the wrong tab. Always `open` an existing script first, then overwrite its content.

## Performance Constraints (Free Plan)

- **20 second timeout** per bar calculation
- **5000 historical bars** max
- **2 indicators per chart**
- **500 max** for boxes, labels, lines each
- O(n²) operations (sorting) on every historical bar will timeout — only compute expensive operations on `barstate.islast`
