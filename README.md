# Quality Collaboration — clickable HTML prototype

A static, clickable prototype of the **Quality Inspection collaboration** flow, built from Figma
file *187 Quality Collaboration SCC/SCPL*, section **“QC- History”**
([node 3782-77289](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=3782-77289)).

Two screens from that section are implemented:

| Page | Figma node | Chrome |
| --- | --- | --- |
| [`index.html`](index.html) | `3782:74663` — *Supplier - Item Inspection* | Coupa Supplier Portal (CSP) |
| [`buyer.html`](buyer.html) | `3782:77297` — *Item Inspection* | Coupa core / buyer |

## Live preview

Once GitHub Pages is enabled for this repo (Settings → Pages → Branch `main`, folder `/`), the
prototype is served at:

```
https://<owner>.github.io/qc-collaboration-prototype/
```

To run it locally, no build step is needed — open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## What is clickable

**Cross-screen flow**
- Supplier **Submit** → confirmation modal → lands on the buyer review screen (`buyer.html`).
- Buyer **Send Back to Supplier** → modal (pre-filled with the reason from the Figma history) → returns to `index.html`.
- Buyer **Accept** / **Reject** → confirmation modals with toast feedback.
- A small “View as” switcher (bottom-left) jumps between the two roles. It is a prototype aid and is *not* part of the Figma design.

**History card**
- Filter chips **All / Buyer / Supplier / System (ERP)** filter the entries client-side.
  The supplier screen opens on *All*; the buyer screen opens on *Buyer*, matching the Figma frames.
- **Search** filters entries by name, action, linked object, and detail lines.
- **Sort By** toggles newest-first / oldest-first.
- The bubble list scrolls with the CUI scrollbar styling from the design.

**Comments**
- Typing a comment and pressing **Add Comment** appends a real history bubble (with your role’s
  avatar and the current timestamp) and scrolls to it.
- Clicking a row’s comment icon (buyer) pre-fills the comment box with that characteristic.

**Characteristics table**
- **Search in this view** filters the 8 rows; the count next to “Items per page” updates.
- Any column header sorts ascending/descending.
- **Views** opens a saved-views panel that renames the table heading.
- Row action icons, attachment icons, filter/more buttons, pagination, and page-size controls all
  respond (with toasts where the target screen is outside this prototype’s scope).

**Cards**
- Summary, Attachments Library, Comments, and History all collapse/expand from their chevrons.
- Attachments Library’s “8 Files | 1 URL” expands an itemised list.

## Structure

```
index.html            Supplier screen
buyer.html            Buyer review screen
assets/css/tokens.css Clarity UI (CUI) design tokens, resolved from Figma variables
assets/css/styles.css Component styling for both product chromes
assets/js/data.js     Characteristics + history content transcribed from Figma
assets/js/app.js      Filtering, sorting, accordions, comments, modals, navigation
assets/icons/         33 assets exported from the Figma file (SVG + one PNG flag)
```

Every icon is the asset exported from Figma — none are hand-drawn — so glyphs match the design
exactly. Colours, spacing, radii, and type come from `get_variable_defs` on the Figma nodes and are
declared once in `tokens.css`.

## Fidelity notes

Things that are deliberate deviations or additions, so nothing here reads as unintentional:

- **Four history timestamps are inferred, not from Figma.** The Figma frames show these entries
  without a visible timestamp, so plausible ones were added to keep the chronology sortable:
  the ERP “Synced inspection results” entry (`Jun 10 - 12:10 PM`), Steven Neilson’s comment
  (`Jun 10 - 1:20 PM`), the ERP comment-activity entry (`Jun 10 - 3:00 PM`), and Prasad T.’s comment
  (`Jun 11 - 10:15 AM`). They are flagged with `timestampInferred: true` in
  [`assets/js/data.js`](assets/js/data.js).
- **Pagination is chrome only.** The Figma pager shows “Prev 1 2 3 … 17 Next” over a table that
  contains 8 rows of real data. The controls highlight and toast but do not page, because there is no
  further data in the design.
- **“Show more” in Summary** — the Figma frame shows both summary rows plus a “Show more” affordance,
  but does not define what the expanded state reveals. The toggle works and says so explicitly.
- **Saved views, filter panel, global search, notifications, help, cart, file pickers** are not
  designed in this section; those controls respond with a toast instead of silently doing nothing.
- **Fonts** are loaded from Google Fonts (Nunito Sans for CUI, Open Sans for the buyer nav). Helvetica
  is used for the legacy Coupa chrome text, as in the design.
- **Fixed 1440 px width**, matching the Figma frame width. The prototype is not responsive.
- The **role switcher** and **toasts** are prototype scaffolding and do not exist in the design.

## Data

All content — the 8 characteristics with their specifications, ranges, results, expected results,
remarks and attachments, and the 11 history entries — is transcribed from the Figma frames and lives
in [`assets/js/data.js`](assets/js/data.js). Editing that file updates both screens.
