# Quality Collaboration — clickable HTML prototype

A static, clickable prototype of the **Quality Inspection collaboration** flow, built from Figma
file *187 Quality Collaboration SCC/SCPL*, section **“QC- History”**
([node 3782-77289](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=3782-77289)).

Four pages are implemented:

| Page | Figma node | Chrome |
| --- | --- | --- |
| [`index.html`](index.html) | `3782:74663` — *Supplier - Item Inspection* | Coupa Supplier Portal (CSP) |
| [`buyer.html`](buyer.html) | `3782:77297` — *Item Inspection* | Coupa core / buyer |
| [`inspections.html`](inspections.html) | [`514:38555`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=514-38555) — *Inspections* (the list) — see the fidelity note below | Coupa Supplier Portal (CSP) |
| [`email.html`](email.html) | none — the section has no email frame; see the fidelity note below | Supplier's inbox |

Two components on those screens are built from their own dedicated Figma sections:

| Component | Figma node |
| --- | --- |
| Attachments Library (11 states) | [`758:125789`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=758-125789) — *Attachment Library* |
| Summary, expanded third row | [`518:28852`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=518-28852) — *Header Summary / Variant2* |
| Inline row edit | [`507:44397`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=507-44397) — see the fidelity note below |
| Attachments in an editing row | [`642:203899`](https://www.figma.com/design/sdmS17osDPwbd12jR0eyUR/187-Quality-Collaboration-SCC-SCPL?node-id=642-203899) — see the fidelity note below |

## The example inspection

The layout is the Figma design; the **content is an aftermarket performance muffler** — *Performance
Muffler XR-3*, a straight-through 409 stainless muffler with 3 in inlet/outlet, buyer part `EX-4471`,
supplied by *Apex Exhaust Systems* — rather than the Figma file’s generic “Synthetic Rubber” sample.

The 8 characteristics are the ones a muffler is actually inspected against: weld and visual, shell
wall thickness, body length / tube OD, back pressure (SAE J1492), tailpipe sound level (SAE J1169),
insertion loss (SAE J1400), leak test, and salt spray (ASTM B117).

The **attachments follow the characteristics**. Header level carries what governs the inspection — the
program SOW, the inspection and test plan, the mill certificate for the 409 coil. Line level carries
the evidence for each characteristic (`Sound-level-J1169-C5.pdf`, `CMM-dimensional-C3.pdf`, and so
on), tagged with that characteristic's ID — and the table's **Attachments column is that list**,
filtered to the row and shown by name, so the two can never disagree. Characteristic 1 carries two
(the weld report and a seam photo) and characteristic 5 carries two (the sound report and the
acoustic lab's certificate URL); the rest carry one. Two of them open as real report pages in the
preview pane.

The story the two screens tell: results are in for all 8, but **characteristic 5 fails** — 2 of 5
units read 97 dB(A) against a 88 - 95 dB(A) ceiling, with low packing density as the suspected cause.
Characteristic 3 is amber (357.4 mm, trending to the upper limit) after being re-measured, and the
ERP sync failed on characteristic 4. So the buyer screen has a real reason to use **Send Back to
Supplier**, and the *Out of Specification* and *Revised Results* saved views have something to point
at.

## Live preview

GitHub Pages serves the prototype from `main` / root:

**https://liemnguyen-afk.github.io/qc-collaboration-prototype/**

GitHub Pages serves CSS and JS with `Cache-Control: max-age=600`, so a browser that has the page open
will keep using the old files for ten minutes after a push. The four HTML files therefore link their
assets with a version query (`assets/css/styles.css?v=20260923b`) — **bump that date whenever you change
CSS or JS**, so a shared link shows the new build immediately instead of a cached one.

To run it locally, no build step is needed — open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## What is clickable

**Cross-screen flow**
- The **notification email** (`email.html`) is where the flow starts: **Submit Inspection Results** →
  the supplier screen (`index.html`), and **View All Quality Inspections** → the list.
- **View All Quality Inspections** (bottom-left of both the supplier and the buyer screen) → the
  Inspections list (`inspections.html`); inspection **008** in that list opens the supplier screen
  again.
- Supplier **Submit** → confirmation modal → lands on the buyer review screen (`buyer.html`).
- Buyer **Send Back to Supplier** → modal (pre-filled with the reason from the buyer’s last comment in History) → returns to `index.html`.
- Buyer **Accept** / **Reject** → confirmation modals with toast feedback.
- A small “View as” switcher (bottom-left) jumps between **Supplier**, **Buyer** and **Email**. It is a prototype aid and is *not* part of the Figma design.

**Notification email** (`email.html`)
- The email the supplier receives when the buyer raises the inspection, laid out to match the design's
  email screengrab: *Powered by Coupa* above a white body ruled top and bottom, the customer's logo,
  the blue subject line **New Quality Inspection is required for PO #5001**, a grey intro panel with a
  centred text column, and a **Summary** card of seven fields, four to a row.
- **View & Complete Inspection** is the one action, and it lands on the supplier screen
  (`index.html`).
- The **Document Reference** and **Item Name** values are links, as they are in the Inspections list;
  both toast, since a purchase order and an item page are outside this prototype.
- Everything factual is read from `window.QC`, so the email cannot drift from the screens: the Summary
  fields are the detail screens' own Summary values, the PO reference is the second half of the
  inspection's title, the characteristic count is `QC.characteristics.length`, and the requester is the
  *Requested* entry in History. **go here and adjust your settings** toasts.

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
- The data columns — Attachments included — **scroll horizontally**, while the **Actions column stays
  locked** to the right edge (with a divider and drop shadow), so the row action is always reachable.
- **Specification** and **Remarks** are clipped to their column width; hovering a clipped cell shows
  the full text in a tooltip. Cells that are not clipped show no tooltip.
- The **Attachments** column lists the row’s own line-level attachments **by file name**, with the
  same doc-type icon the library gives them (URLs in link blue). Clicking one expands the library,
  switches to **Line Level**, pages to the file, selects it and renders its preview. A characteristic
  with two attachments stacks them; one with none reads “—”. **Search in this view** matches file
  names too.
- That column is on **both screens**, since the evidence is what the buyer reviews the result against:
  the supplier attaches to a row while editing it, and the buyer gets the same cell read-only — clicking
  a name opens that file in the library’s preview, where the download and expand actions are. So the
  buyer’s table is wider than the supplier’s (it also carries Range and Expected Result) and scrolls
  further.
- Filter/more buttons, pagination, and page-size controls all respond (with toasts where the target
  screen is outside this prototype’s scope).

**Inline row editing** (supplier screen, Figma `507:44397`)
- The row’s **edit pencil** turns that row into fields in place — **Result**, **Inspected By**,
  **Inspection Date** (a real date picker) and **Remarks**. ID, Characteristic and Specification are
  the buyer’s request, so they stay read-only, and the row keeps its own columns and height.
- The row action swaps the pencil for **save (✓)** and **cancel (×)**. `Enter` saves, `Esc` cancels.
- **Save** writes into `QC.characteristics`, so the new values survive sorting, searching and
  submitting — and posts an *Updated Results on Characteristic: N* entry to **History** listing only
  the fields that actually changed. Saving an unchanged row posts nothing.
- **Cancel** discards. A blank Result is refused with a toast, since that is the cell the row exists
  for. One row edits at a time: clicking another pencil closes the open editor without saving.
- Typed values are held in a draft, so sorting or searching mid-edit keeps them.
- **Attachments while editing** (Figma `642:203899`) — the row’s **existing attachments stay listed
  and clickable**, and under them the library’s own **Add File | URL** affordance attaches more *to
  that characteristic*: **File** opens a real picker (the doc-type icon comes from the extension),
  **URL** opens a *Type URL here* field where `Enter` or **Add** attaches it and `Esc` closes just the
  field, not the row. Either way the file lands in the Attachments Library at line level tagged with
  this row’s ID, so the cell, the library list, the level badge, the file/URL counts and the pager all
  follow immediately — and deleting it in the library updates the open editor.

**Inspections list** (`inspections.html`, Figma `514:38555`)
- Titled **Inspections**, with **All Inspection Requests** as the saved view, and 12 columns in the
  design's order: Inspection ID, Document Reference, Requested By, Item, Supplier Part Number, Buyer
  Part Number, Request Date, Due Date, Status, Resolution Reason, Supplier, Created At. All 12 are in
  frame — the table is laid out to the card's width and cells wrap rather than scrolling sideways.
- **Status** and **Resolution Reason** are plain text, as the design draws them: the status carries
  Open / In Progress / In Buyer Review / Closed, and a closed row says why in Resolution Reason
  (*Accepted - All specifications satisfied*, *Rejected - Item doesn't meet specifications*).
- Three columns are links, matching the blue text in the design: **Inspection ID**, **Item** and
  **Supplier**. The ID opens the inspection — **008** is the muffler inspection this prototype builds
  out, so it goes to `index.html`, and the other seven toast. Item and Supplier toast, since neither an
  item page nor a supplier record is in scope.
- **Search** matches every column; any header sorts ascending/descending, and the blue caret marks the
  sorted one. The list opens on Inspection ID descending — newest first, with **008 — Performance
  Muffler XR-3**, the inspection this prototype builds out, at the top.
- **Views**, **filter** and the footer's **Per page 15 | 45 | 90** highlight and toast — there is no
  second page of data behind them.

**Attachments Library** (Figma `758:125789`)
- **Header Level / Line Level** tabs switch the list; the badges count the attachments at each level.
- Clicking a row selects it and renders it in the **preview pane** — the SOW and the inspection plan
  as documents, the sound level and CMM reports as page images, a URL row as the *Link Attachment*
  card. Files without a preview say so rather than showing an invented page.
- The preview **action set** works: zoom out / zoom in, expand to a full-screen sheet (`Esc` closes),
  rotate 90°, download (toast), and the close **×**, which removes the attachment from the library.
- Row **download** icons toast; row **trash** icons delete the row, and the counts, badges and
  pagination follow.
- **Add File** opens the dashed dropzone — **Browse** or dragging files onto it really attaches them
  to the level you are on, with the doc-type icon picked from the extension.
- **Add URL** enables its **Add** button only once you type something, then adds the URL as a row.
- Either add mode also shows **Enter Comment** / **Add Comment**, which posts to History.
- **Pagination** appears once a level holds more than 10 attachments (the Figma
  *Line level - w/pagination* state); add enough files with Browse to see it.
- The “12 Files | 1 URL” links expand the card and jump to the list; the URL link selects the URL.
- The **“Attachments: 12 Files | 1 URL” line stays visible when the card is collapsed** (the Figma
  collapsed state), so the counts read without expanding — and the links still expand and jump.

**Cards**
- Summary, Attachments Library, Comments, and History all collapse/expand from their chevrons.
- Summary’s **Show more / Show less** reveals the third field row (Supplier Part Number, Sample
  Size, Buyer Batch Number) from Figma `518:28852`.

## Structure

```
index.html            Supplier screen
buyer.html            Buyer review screen
inspections.html      Inspections list
email.html            Notification email the request sends the supplier
assets/css/tokens.css Clarity UI (CUI) design tokens, resolved from Figma variables
assets/css/styles.css Component styling for both product chromes
assets/js/data.js     Inspections list, characteristics, attachments + history content
assets/js/app.js      Filtering, sorting, accordions, attachments, comments, modals, navigation
assets/icons/         49 assets: 47 from the Figma file (SVG + one PNG flag) + Clarity's Close and Check
assets/img/           Report page images used as attachment previews
tools/reports/        HTML sources those page images are rendered from
```

Every icon is a real asset — none are hand-drawn — so glyphs match the design exactly. All but two are
Figma exports; `close-outline.svg` and `check-outline.svg` are Clarity's own `Close` and `Check`
outline paths, taken from `@coupa/clarity-ui-icons`. Colours, spacing, radii, and type come from `get_variable_defs` on the Figma nodes and are
declared once in `tokens.css`.

## Fidelity notes

Things that are deliberate deviations or additions, so nothing here reads as unintentional:

- **The notification email is matched from a screengrab, not from a Figma node.** The *QC- History*
  section has no email frame and the Figma connection was not authorised in the sessions that built
  `email.html`, so its structure, labels, copy and the *View & Complete Inspection* button come from a
  screengrab of the design's email that the design owner supplied; the measurements are **ours**, solved
  to the prototype's 1440 px width (email body inset 62 px, intro column 406 px wide and centred,
  Summary on a four-column grid). Every value in it comes from `window.QC`, and the requester line is
  the *Requested* History entry. Three content departures from the screengrab:
  - Its Logoipsum placeholder became a **Buyer Enterprises** lockup, using
    [`assets/img/customer-logo-mark.svg`](assets/img/customer-logo-mark.svg) — drawn, not a Figma
    export, and the only asset in the prototype that is.
  - Its **Manufacturer Part Number** label is kept, carrying this inspection's `buyerPartNumber`
    (`EX-4471`), which the Summary cards on the two screens label *Buyer Part Number*.
  - Its bottom-left “Click here to view full change request including 15 unchanged lines” link is
    omitted. It is change-request-email boilerplate with no quality-inspection counterpart, so there is
    nothing to point it at that would not be invented.
- **Four history timestamps are inferred, not from Figma.** The Figma frames show these entries
  without a visible timestamp, so plausible ones were added to keep the chronology sortable:
  the ERP “Synced inspection results” entry (`Jun 10 - 12:10 PM`), Steven Neilson’s comment
  (`Jun 10 - 1:20 PM`), the ERP comment-activity entry (`Jun 10 - 3:00 PM`), and Prasad T.’s comment
  (`Jun 11 - 10:15 AM`). They are flagged with `timestampInferred: true` in
  [`assets/js/data.js`](assets/js/data.js).
- **Horizontal scroll and the locked Actions column are additions.** The Figma frames draw the table
  at full width with no scroller. To keep long Specification and Remarks text readable at 1440 px, the
  data columns are given explicit minimum widths — which makes the table wider than the card — and the
  Actions column is pinned with `position: sticky; right: 0`. Attachments is a normal data column and
  scrolls with the rest, so it sits off the right edge until you scroll. One detail that looks
  arbitrary but is not: the scroll container has **no horizontal padding**, because a padded scrollport
  leaves a strip at the right edge the pinned column cannot cover and scrolled cells show through it —
  the 16 px inset is on the first and last cells instead. The hover tooltip on truncated
  Specification / Remarks cells is likewise not in the design; the frames simply show the text cut
  with an ellipsis.
- **Pagination is chrome only.** The Figma pager shows “Prev 1 2 3 … 17 Next” over a table that
  contains 8 rows of real data. The controls highlight and toast but do not page, because there is no
  further data in the design.
- **Summary third row** comes from a different frame (`518:28852`) than the two screens
  (`3782:74670` / `3782:77332`), because the QC-History frames only show the collapsed state. That
  frame also carries a different Status value from the screens — `Open`, against `In Progress` /
  `In Buyer Review`. The screens’ own values are kept; only the three new fields were taken from
  `518:28852`.
- **Buyer Part Number is filled on both screens.** The Figma buyer frame leaves that field blank while
  the supplier frame fills it; both now read `EX-4471`, since a blank buyer part number on the buyer’s
  own screen reads as a bug in a demo rather than as design intent.
- **Attachment counts are computed, not drawn.** The Figma frames say “8 Files | 1 URL” and the
  Attachment Library component itemises 7 attachments; neither number is hard-coded. The counts,
  badges and the Submit modal all read from [`assets/js/data.js`](assets/js/data.js), so they follow
  the 12 files and 1 URL this inspection carries — and keep following as you add or delete rows.
- **Four attachments have a preview; the rest say they do not.** The Figma design draws two preview
  states — a document and a page image — so two of each are filled in: the SOW and the inspection plan
  render as text, and the sound level and CMM reports render as page images. Selecting any other file
  shows a short note instead of an invented page.
- **The two page images are generated, not exported from Figma.** The Figma export was an elastomer
  test report, which belongs to the old “Synthetic Rubber” example; it was replaced with two muffler
  reports rendered from the HTML in [`tools/reports/`](tools/reports/) (see that folder's README for
  the one-line Chrome command). Their numbers match `data.js` — the sound report's 97.1 dB(A) lot
  maximum is characteristic 5's result, and the CMM report's revision note is the *Revised Result*
  history entry.
- **Pagination in the library is real but idle.** The Figma *Line level - w/pagination* state shows
  35 line-level attachments over 7 pages at 10 a page; this inspection has exactly 10 at line level,
  so the pager stays hidden until you attach one more file — from the library's **Add File**, or from
  a row's own **Add File | URL** in inline edit.
- **Add File / Add URL in the library still lands on a new line number.** Files attached from the
  library's own controls at line level get `line` = the next number up (9, 10, …), which is not one of
  the 8 characteristics, so they appear in the library but in no table row. Attaching from a row in
  inline edit is what ties a file to a characteristic. The design does not show how the library picks
  a line, so this was left as it was rather than guessed at.
- **The preview's remove action uses Clarity's Close icon, not the design's red minus.** The Figma
  preview bar ends with a red circled minus (`remove-circle-outline`, still in `assets/icons/` for
  reference). That glyph reads as a destructive status marker rather than a control, so the button now
  uses Clarity's `Close` outline in the same `text.t1` dark grey as the other five actions. The
  behaviour is unchanged: it removes the attachment from the library.
- **The Attachments column shows file names; the Figma frames show a single icon.** The design's Att
  column is one page glyph per row with no name, which cannot show that characteristic 1 and
  characteristic 5 each carry two attachments. The column now lists the row's line-level attachments by
  name — which is also why it is wider than the design's, and why the two rows with two files are
  taller than the rest.
- **The inline edit row was not verified against Figma `507:44397` or `642:203899`.** The Figma
  connection was not authorised in the session that built it, so the *interaction* is the one the
  design is named for —
  pencil turns the row into fields, the row action becomes save / cancel — but the **field set is
  inferred** from the supplier’s own columns: the four result columns are editable, and ID /
  Characteristic / Specification / Attachments are not. Check it against that node; the field list is
  the `EDIT_FIELDS` array at the top of the table section in [`assets/js/app.js`](assets/js/app.js).
  Two details there are decisions, not the design: **Remarks edits in a single-line field** (so the
  row keeps its height, with long text scrolling inside the field), and **saving a Result does not
  re-evaluate its pass/fail pill** — editing characteristic 5 to a passing number leaves the red pill,
  because deciding pass/fail from the specification text would be invented logic. The
  Inspection Date column was widened from 150 px to 166 px so the date field and its picker fit
  without the table resizing when a row opens.
- **The Inspections list was matched from a screengrab of Figma `514:38555`, not from the node.** The
  Figma connection was not authorised in the sessions that built it, so the page title, the section
  title, the 12 column labels and their order, the plain-text Status and Resolution Reason, the blue
  Inspection ID / Item / Supplier links, the trailing-magnifier Search and the *Per page 15 | 45 | 90*
  footer are transcribed from a screengrab the design owner supplied. What the screengrab cannot give
  is measurement: **the column widths are ours.** They are solved to the card's width (they sum to the
  1398 px scrollport) so that every column is in frame and no header and no cell needs more than two
  lines — except **Resolution Reason**, whose longest sentence takes three, which makes the closed rows
  taller than the open ones. If the node allows a wider table, re-measure there.
- **The seven rows other than 008 are invented content.** They are other exhaust parts from the same
  supplier, present to give the statuses, the resolution reasons and the search something to work on;
  only 008 opens a screen. Their dates and PO numbers sit *behind* 008's, so the IDs run with time —
  the newest request carries the highest number — and Inspection ID descending is newest first. The
  rows are the `QC.inspections` array in [`assets/js/data.js`](assets/js/data.js).
- **Every date in the prototype sits in 2026, where the design's dates are 2025.** The year was moved
  on request, and moved everywhere rather than column by column, so nothing reads as a year out of step:
  the list's Request / Due / Created At dates, the Summary cards on both detail screens (`05/01/26`
  requested, `06/15/26` due), the inspection plan and statement-of-work prose, the per-characteristic
  inspection dates, the History entries and their sort keys, and the two lab report page images —
  including the `061026` date stamps in their report numbers and in the attachment file name. Only the
  year moved; the month and day are the design's.
- **The inspection this prototype builds out is numbered `008`, where the design's detail screen shows
  `001`.** Numbering it 008 is what puts it at the top of a list sorted newest-first on Inspection ID.
  The ID is not only in the list: the page title and `<h1>` (*Quality Inspection #8 … PO #5001 / 0008*),
  the Summary card, the submit / accept / reject modals, the buyer's toasts, the History entries' own
  strings (the record URL, the certificate ID `QI-008-C5`, the attachment file name) and the two lab
  reports' headers all carry it, so all of them were moved to 008 together. Nothing else about that
  inspection changed — it is still `PO:EXTPO123/001` on the same month and day the design's Summary
  card has.
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

All content — the 8 inspections in the list, the 8 characteristics with their specifications, ranges,
results, expected results, remarks and attachments, the 13 library attachments, and the 11 history
entries — lives in [`assets/js/data.js`](assets/js/data.js). Editing that file updates all four pages.

The **structure** of that data is transcribed from the Figma frames and is what the layout was built
against: 8 characteristic rows with Range left blank on 5 of them, one amber and one red result pill,
both attachment levels with the design's mix of `kind` values (word, pdf, image, url) and its
per-kind action sets, and 11 history entries across the four actor filters. The **values** are the
muffler example, so swapping in another item means keeping that shape and replacing the text.

Line-level attachments carry `line` set to the ID of the characteristic they evidence, and that is the
**only** link between the two: the table's Attachments column filters `QC.attachments.line` by row and
renders whatever it finds, so the column and the library cannot drift. (Characteristic rows used to
repeat the file name in an `attachment` field; that field is gone.) Header level holds what governs the
whole inspection: the program SOW, the inspection and test plan, and the mill certificate for the shell
coil.
