# Flow spec: 2. Install per platform

The page `/{lang}/install/`: every way to install worldref, each with its own copy action, then the first call, then "use only what you need". Platform-neutral. Approved at Stop 1 together with the wireframe; nothing here is built before approval.

**Status:** draft, 02/11/2026
**Approval mode:** Delegated
**Model:** Opus 5.5 (claude-opus-5-5), by the owner's ruling in `DELEGATED-DECISIONS.md` entry 10
**Wording:** `docs/design/flows/install/WORDING.md` (plus the shared keys in `docs/design/flows/onboarding/WORDING.md`)
**Wireframe:** `docs/design/flows/install/wireframe.html`

## 1. Goal

The visitor copies the install line for their stack and, without another search, sees the first call to make with it.

## 2. User and context

- **Who:** a developer who has decided to try worldref (from the home, a README link or a search for "<stack> country list arabic") and an agent operator who wants the MCP line.
- **Situation:** a terminal or an editor is open in the other window. They want one line, exactly right, and to be back in their code in seconds.
- **What they know:** their own package manager. They may not know that nothing here needs a registry account, or that JitPack, a VCS repository or a project reference is the route for their stack.
- **State of mind:** impatient and literal. A wrong or half-copied line costs more than a slow page, so every line is verbatim from the READMEs and copies exactly.

## 3. Entry points

| Entry | From | Condition |
| --- | --- | --- |
| `/{lang}/install/` | Home Install action, home "Install it in your project" row, menu, footer | Opens at the top |
| `/{lang}/install/#{stack}` | Deep links (README, docs, agents page, the "Any language" link) | The row opens with its first call expanded and scrolls clear of the top edge. Stack ids: `js`, `cdn`, `swift`, `kotlin`, `python`, `dart`, `php`, `go`, `csharp`, `files`, `mcp`, `api` |
| `/{lang}/install/#modules` | The builder's "use one module" hint, external links | Scrolls to "Use only what you need" |
| `/{lang}/install/#{unknown}` | A guessed or old deep link (`#rust`) | Empty state at the top |

## 4. Steps

| # | Screen | Job (one line) | Primary action | Secondary | Taps so far |
| --- | --- | --- | --- | --- | --- |
| 1 | Install page, top | Say that no account is needed and offer a way to the visitor's stack | none (reading); the stack rows are directly below | Jump row: 12 links to the stacks | 0 |
| 2 | Stack row (one of 12) | Hand over the exact line | Copy command (Copy URL for URL rows) | Show the first call | 1 |
| 3 | Same row after copy | Show what to write next | none: the first call opens by itself under the copied line | Full guide on GitHub | 1 |
| 4 | "Use only what you need" | Swap the full package for one module | Copy the module line | Pick a module (single choice, `core` preselected); Build a file | 3 (install line, module, module line) |

Row shape, identical for every stack (Stripe reference, entry 11): name and platforms in brackets; a label saying where the line goes (Terminal, URL, or the file name such as `pubspec.yaml`); the line in the code face; Copy; then the first call behind a toggle that opens itself after a copy; then the full guide. Two-file stacks (Kotlin, PHP, C#) show two blocks labelled "Step 1 of 2", "Step 2 of 2". "Any language" has no command: its actions are Build a file (primary, flow 3) and the releases page. "AI agents" links to the agents page.

Commands are verbatim from `README.md` (install table) and the language folder READMEs: Swift uses the `Package.swift` line from `Sources/WorldRef/README.md` plus "Then pick the product `WorldRef`"; Kotlin the two JitPack lines; Dart the `pubspec.yaml` line; PHP the VCS repository entry then `composer require arj-89/worldref:^1.0`; C# option 1 from `csharp/README.md` (submodule, then `dotnet add reference`). First calls are the first lines of each folder README's Usage block; the CDN and No-install first calls are one `fetch` line written for the site (no README has one).

## 5. Tap budget

| Path | Happy path | Budget |
| --- | --- | --- |
| On the page: copy any one-line stack | 1 tap (scroll to the row, Copy) | 2 (pick stack, copy) |
| On the page with the jump row | 2 taps (jump, Copy) | 2 |
| From the home | 2 taps (Install, then Copy after scrolling); 3 when using the jump row | 2 (flow 1) |
| First call after copying | 0 extra taps (opens by itself) | not set |
| With "use only what you need" | 3 taps (Copy install line, pick module, Copy module line); 2 when `core` is the module | 3 |
| Two-file stacks (Kotlin, PHP, C#) | 2 taps on the page, 3 from the home | 2 |

Over budget, justified: the three two-file stacks need two copies because the lines go into two different files (Kotlin: `settings.gradle.kts` and `build.gradle.kts`; PHP: `composer.json` and the terminal) or are two README steps (C#). Joining them into one line would change the README's commands, which brief item 15 forbids.

## 6. States

| Screen | First-run | Empty | Loading | Partial | Error | Offline | Success |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Install page | All 12 rows closed, JavaScript first; a deep link opens its row | Deep link to an unlisted stack: one sentence naming it, one action "Go to the files" (scrolls to "Any language") | n/a: static HTML, every line is in the page; the clipboard resolves in milliseconds | Two-file stack with step 1 copied: step 1 shows "Command copied", step 2 is tagged "Next: step 2 of 2", the first call is open | Clipboard blocked or missing: the line is selected and the error says how to copy by hand | Offline line at the top: commands still copy, installing needs a connection | "Command copied" on the button for 2 s, then back to "Copy command"; the first call opens under the line and stays open |
| Use only what you need | `core` preselected; the line is the JavaScript import until another stack is copied, then the CDN URL of the module | n/a: a module is always selected | n/a | n/a | Same clipboard error | Same offline line | "Command copied" or "URL copied" |

Every row captured in both languages, both themes, default and largest text.

## 7. Copy

| Screen | Keys |
| --- | --- |
| Page | `install.title`, `install.body`, `install.jump`, `install.where.*`, `install.step`, `install.step.next`, `install.first.*`, `install.guide`, `install.swift.product`, `install.dart.where`, `install.php.where`, `install.files.*`, `install.mcp.more`, `install.empty.*`, `install.offline.body` |
| Stack names | `install.stack.{id}`, `install.stack.{id}.on` |
| Use only what you need | `install.modules.*`, `install.null`, `module.*`, `chrome.nav.build` |
| Shared | `action.copy-command`, `action.copied-command`, `action.copy-url`, `action.copied-url`, `action.copy.error`, `state.offline.line` |

## 8. Motion

| Trigger | Element | Property | From | To | Duration | Easing | Reduce Motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Copy succeeds (the page's one authored moment) | First-call block under the copied line | opacity, and height through `interpolate-size` | 0, 0 | 1, auto | 200 ms | ease-out | opacity only, no height animation |
| Copy succeeds | Copy button label | cross-fade to "copied" | | | 150 ms, holds 2 s | ease-out | instant swap |
| Jump link or deep link | Page scroll | smooth scroll to the row | | | browser default | | instant jump |

## 9. Data entry

None. The module choice is a single-choice chip group (radio semantics), not a form.

## 10. Edge cases

| Case | Behaviour |
| --- | --- |
| Long commands (Python, C# step 1: over 90 characters) | Wrap inside the block at any character (`overflow-wrap: anywhere`); never a sideways scroll; Copy copies the exact unwrapped line |
| Commands inside an Arabic page | The block is `dir="ltr"`; labels around it stay RTL; nothing in the line is reordered |
| Deep link to `#files` | The row has no command; Build a file is its primary action |
| Deep link while JavaScript is off | The anchor scrolls; the first call stays behind the native `<details>` toggle |
| Clipboard API missing (old browser, insecure context) | Error line, text selected; the copy button stays usable for a retry |
| The visitor copies a second stack | The first stack's "copied" label times out normally; both first calls stay open |
| A new release (v1.0.1) | Lines come from the README at build time, so version strings update with the README; the page never hard-codes a version |
| The Arabic README's Kotlin line differs from the English one (`1.0.0` against `v1.0.0`) | The site uses the English README line in both languages (Noticed list) |

## 11. Acceptance list

- [ ] 12 stack rows in README order, each with its line verbatim from the README named in section 4 (diff of rendered `pre` text against the READMEs passes).
- [ ] Copy on any one-line stack is 1 tap on the page and 2 from the home (recorded for JavaScript, Python and AI agents in both languages).
- [ ] After a copy, the first call for that stack is visible under the line with no further tap.
- [ ] Two-file stacks show "Step 1 of 2" and "Step 2 of 2"; the partial state tags the uncopied step.
- [ ] `#python` opens the Python row expanded and its heading is not under the top edge; `#rust` shows the empty state with "Go to the files".
- [ ] "Use only what you need": choosing `phone` shows `import phone from "worldref/data/modules/phone.json" with { type: "json" };` after a JavaScript copy and the module's CDN URL after any other stack; 3 taps in total.
- [ ] No line causes a sideways scroll at 390 px or at the largest text size; every code block is LTR inside the Arabic page.
- [ ] Every state in section 6 rendered in both languages, both themes, default and largest text.
- [ ] Copy feedback appears within 100 ms; blocked clipboard shows the error with the line selected.
- [ ] Stack names and platform lists in Arabic keep every Latin product name isolated (`C# و.NET` renders in the right order).
- [ ] No request leaves `arj-89.github.io` (the CDN URL is text to copy, never fetched by the page).

## 12. Wireframe

`docs/design/flows/install/wireframe.html`: one screen with every state in the corner panel; language, theme and the tap count carried over from flow 1. Copy uses the real clipboard where the browser allows it, so the error state is also reachable by opening the file in a browser that blocks clipboard access.

## 13. Decisions needed at Stop 1

- **D7. 11 stacks or 12.** The brief (entry 4) says "one of 11 stacks"; the README install table has 12 rows (JavaScript, CDN, Swift, Kotlin, Python, Dart, PHP, Go, C#, Any language, AI agents, No install). Proposed: 12, verbatim from the README, since brief item 15 makes the README the source.
