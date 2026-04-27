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

# 2. Add debug via label on barstate.islast ONLY:
#    label.new(bar_index, low, "DBG: " + str.tostring(someVar), ...)
#    If label shows → script runs but logic is wrong
#    If label doesn't show → crash before render

# 3. Deploy a minimal version (no UDTs) to isolate:
#    - If minimal version works → issue is in UDTs/logic
#    - If minimal version crashes → fundamental issue (mintick, bar 0, etc.)
```

**Common runtime errors:**
- **RE10045**: `array.get()` index out of bounds → often caused by `syminfo.mintick = na` on bar 0, or `for i = 0 to -1` executing one iteration
- **Silent timeout**: free plan = 20s max → O(n²) sort on every historical bar = timeout

## Adding/Updating Indicator on Chart

### Reliable Workflow: Add New Indicator

```bash
# 1. Remove existing indicators from chart (free up slots)
tv indicator remove --id <entity_id>     # get ID from tv state

# 2. Ensure chart is clean
tv state  # verify study_count = 0

# 3. Open an EXISTING saved script in Pine Editor
tv pine open --name "Test SMA"  # or any sacrificial script

# 4. Inject your code
tv pine set -f /path/to/script.pine

# 5. Compile — this will add the script to chart if `study_added: true` or update the script on chart if `study_added: false`
tv pine compile

# 6. Verify
tv state
```

### Reliable Workflow: Update Existing Indicator

When the indicator is already on the chart and you modified the code:

```bash
# 1. Inject updated code
tv pine set -f /path/to/script.pine

# 2. Compile (this auto-updates the indicator on chart)
tv pine compile

# 3. Verify no runtime errors
tv pine console
tv data tables
tv data labels
```

### Why `tv pine new indicator` is Unreliable

It creates a new unsaved tab. The editor doesn't have a save target, so "Save and add" may fail. Always `open` an existing script first, then overwrite its content.

## Checking Runtime After Compilation

**ALWAYS check runtime after a successful compilation.** This is critical:

```bash
# Step 1: Compile
tv pine compile

# Step 2: If compilation succeeded (has_errors: false), CHECK RUNTIME:
tv pine console   # Check for runtime error entries
tv data tables    # Verify tables are rendered
tv data labels    # Verify labels exist
tv data boxes     # Verify boxes exist
tv data lines     # Verify lines exist

# Step 3: If all data commands return 0 items despite compilation success:
# → The indicator crashed at runtime. Check Pine Script console for error messages.
```

## Common Pine Errors

- **"Mismatched input"** → indentation issue (Pine uses 4-space indentation, not braces)
- **"Could not find function or function reference"** → typo or wrong version function
- **"Undeclared identifier"** → variable used before declaration
- **"Cannot call X with argument type Y"** → wrong parameter type
- **"The script is too long"** → simplify or split logic

## Pine Editor Tab Management

The Pine Editor has multiple tabs. `tv pine set` writes to the currently visible tab but does NOT update the editor's internal model state. This causes issues:

1. **Save may revert to old content** — The "Save" action saves the editor's internal model, not the DOM text
2. **"Add to chart" triggers "unsaved changes" dialog** — because the editor detects a diff between its model and the visible text
3. **Multiple tabs confusion** — `tv pine open` opens a script but the active tab might differ

## Performance Constraints (Free Plan)

- **20 second timeout** per bar calculation
- **5000 historical bars** max
- **2 indicators per chart**
- **500 max** for boxes, labels, lines each
- O(n²) operations (sorting) on every historical bar will timeout — only compute expensive operations on `barstate.islast`

## Important Notes

- Always compile after every change — never claim "done" without a clean compile
- Always check runtime after compilation — compilation success ≠ runtime success
- Use `tv pine console` to read `log.info()` debug output
- `tv pine get` can return 200KB+ for complex scripts — avoid unless editing
- `tv pine analyze` and `tv pine check` work without a chart (offline tools)
- `tv pine console` does NOT show runtime errors (RE codes) — see Runtime Debugging section
- **NEVER create labels/boxes on every historical bar** — they exhaust the 500 limit. Only create drawing objects on `barstate.islast`
