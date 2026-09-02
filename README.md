# Quality Collaboration — clickable HTML prototype

A static, clickable prototype of the **Quality Inspection collaboration** flow, built from Figma
file *187 Quality Collaboration SCC/SCPL*, section **“QC- History”**
([node 3782-77289](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=3782-77289)).

Two screens from that section are implemented:

| Page | Figma node | Chrome |
| --- | --- | --- |
| [`index.html`](index.html) | `3782:74663` — *Supplier - Item Inspection* | Coupa Supplier Portal (CSP) |
| [`buyer.html`](buyer.html) | `3782:77297` — *Item Inspection* | Coupa core / buyer |

Two components on those screens are built from their own dedicated Figma sections:

| Component | Figma node |
| --- | --- |
| Attachments Library (11 states) | [`758:125789`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=758-125789) — *Attachment Library* |
| Summary, expanded third row | [`518:28852`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=518-28852) — *Header Summary / Variant2* |

## Live preview

GitHub Pages serves the prototype from `main` / root:

**https://liemnguyen-afk.github.io/qc-collaboration-prototype/**

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
- The data columns **scroll horizontally** while the **Actions column stays locked** to the right
  edge (with a divider and drop shadow), so the row action is always reachable.
- **Specification** and **Remarks** are clipped to their column width; hovering a clipped cell shows
  the full text in a tooltip. Cells that are not clipped show no tooltip.
- **Views** opens a saved-views panel that renames the table heading.
- Row action icons, attachment icons, filter/more buttons, pagination, and page-size controls all
  respond (with toasts where the target screen is outside this prototype’s scope).

**Attachments Library** (Figma `758:125789`)
- **Header Level / Line Level** tabs switch the list; the badges count the attachments at each level.
- Clicking a row selects it and renders it in the **preview pane** — the Statement of Work as a
  document, `Item-inspection-01.pdf` as its page image, a URL row as the *Link Attachment* card.
- The preview **action set** works: zoom out / zoom in, expand to a full-screen sheet (`Esc` closes),
  rotate 90°, download (toast), and the red remove, which deletes the attachment from the library.
- Row **download** icons toast; row **trash** icons delete the row, and the counts, badges and
  pagination follow.
- **Add File** opens the dashed dropzone — **Browse** or dragging files onto it really attaches them
  to the level you are on, with the doc-type icon picked from the extension.
- **Add URL** enables its **Add** button only once you type something, then adds the URL as a row.
- Either add mode also shows **Enter Comment** / **Add Comment**, which posts to History.
- **Pagination** appears once a level holds more than 10 attachments (the Figma
  *Line level - w/pagination* state); add enough files with Browse to see it.
- The “6 Files | 1 URL” links expand the card and jump to the list; the URL link selects the URL.

**Cards**
- Summary, Attachments Library, Comments, and History all collapse/expand from their chevrons.
- Summary’s **Show more / Show less** reveals the third field row (Supplier Part Number, Sample
  Size, Buyer Batch Number) from Figma `518:28852`.

## Structure

```
index.html            Supplier screen
buyer.html            Buyer review screen
assets/css/tokens.css Clarity UI (CUI) design tokens, resolved from Figma variables
assets/css/styles.css Component styling for both product chromes
assets/js/data.js     Characteristics, attachments + history content transcribed from Figma
assets/js/app.js      Filtering, sorting, accordions, attachments, comments, modals, navigation
assets/icons/         47 assets exported from the Figma file (SVG + one PNG flag)
assets/img/           Document preview image exported from the Figma file
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
- **Horizontal scroll and the locked Actions column are additions.** The Figma frames draw the table
  at full width with no scroller. To keep long Specification and Remarks text readable at 1440 px, the
  data columns are given explicit minimum widths — which makes the table wider than the card — and
  the Actions column is pinned with `position: sticky; right: 0`. The hover tooltip on truncated
  Specification / Remarks cells is likewise not in the design; the frames simply show the text cut
  with an ellipsis.
- **Pagination is chrome only.** The Figma pager shows “Prev 1 2 3 … 17 Next” over a table that
  contains 8 rows of real data. The controls highlight and toast but do not page, because there is no
  further data in the design.
- **Summary third row** comes from a different frame (`518:28852`) than the two screens
  (`3782:74670` / `3782:77332`), because the QC-History frames only show the collapsed state. That
  frame also carries different values for two fields it shares with the screens — Status `Open` and
  Buyer Part Number `0762`, against `In Progress` / `In Buyer Review` and `0782` on the screens. The
  screens’ own values are kept; only the three new fields were taken from `518:28852`.
- **Attachment counts.** The QC-History frames say “8 Files | 1 URL”, but the Attachment Library
  component itemises 2 header-level plus 5 line-level attachments — 6 files and 1 URL. The itemised
  list wins, so the counts read “6 Files | 1 URL” and are computed from
  [`assets/js/data.js`](assets/js/data.js) (including in the Submit modal).
- **Only two attachments have a designed preview**: `Statement of Work.doc` (its text) and
  `Item-inspection-01.pdf` (a page image, exported to `assets/img/`). Selecting any other file shows
  a note saying the design has no preview for it, rather than inventing one.
- **Pagination in the library is real but idle.** The Figma *Line level - w/pagination* state shows
  35 line-level attachments over 7 pages; this inspection only has 5, so the pager stays hidden until
  you attach more files.
- **Row action icons use the CUI outline set** (`download-outline`, `trash-outline`), as every
  component instance in the design does. The two *Add file* / *Add URL* frames (`829:93201`,
  `829:93994`) still use the older green/red `Icons/action/*` glyphs; that looked like drift in the
  design file, so the CUI icons were used consistently.
- **“Select a document from list to view here”** — the line-level empty state in the design reads
  “Select an document…”; the typo is not reproduced.
- **Saved views, filter panel, global search, notifications, help, cart, file pickers** are not
  designed in this section; those controls respond with a toast instead of silently doing nothing.
- **Fonts** are loaded from Google Fonts (Nunito Sans for CUI, Open Sans for the buyer nav). Helvetica
  is used for the legacy Coupa chrome text, as in the design.
- **Fixed 1440 px width**, matching the Figma frame width. The prototype is not responsive.
- The **role switcher** and **toasts** are prototype scaffolding and do not exist in the design.

## Data

All content — the 8 characteristics with their specifications, ranges, results, expected results,
remarks and attachments, the 7 library attachments, and the 11 history entries — is transcribed from
the Figma frames and lives in [`assets/js/data.js`](assets/js/data.js). Editing that file updates
both screens.
