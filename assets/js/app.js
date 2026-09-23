/* Prototype behaviour for the Quality Inspection collaboration screens. */

(function () {
  'use strict';

  var role = document.body.dataset.role; // 'supplier' | 'buyer'
  var ICONS = 'assets/icons/';

  /* Doc-type icons, shared by the Attachments Library rows and the table's
     Attachments column so the same file looks the same in both. */
  var DOC_ICONS = {
    word: 'file-word-outline.svg',
    pdf: 'file-pdf-outline.svg',
    image: 'image-outline.svg',
    url: 'link-outline.svg'
  };

  /* ── helpers ─────────────────────────────────────────────────────────── */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 2600);
  }

  /* ── accordions (Summary / Attachments / Comments / History) ─────────── */

  document.querySelectorAll('[data-accordion] .card__header').forEach(function (header) {
    header.addEventListener('click', function () {
      var card = header.closest('[data-accordion]');
      card.classList.toggle('is-collapsed');
      header.setAttribute('aria-expanded', String(!card.classList.contains('is-collapsed')));
    });
  });

  /* ── Summary "Show more" ─────────────────────────────────────────────── */

  var showMore = document.querySelector('[data-show-more]');
  if (showMore) {
    showMore.addEventListener('click', function () {
      var summary = showMore.closest('.summary');
      summary.classList.toggle('is-expanded');
      var expanded = summary.classList.contains('is-expanded');
      showMore.querySelector('span').textContent = expanded ? 'Show less' : 'Show more';
    });
  }

  /* ── Views panel ─────────────────────────────────────────────────────── */

  var viewsTrigger = document.querySelector('[data-views-trigger]');
  var viewsPanel = document.querySelector('[data-views-panel]');
  if (viewsTrigger && viewsPanel) {
    viewsTrigger.addEventListener('click', function () {
      viewsPanel.classList.toggle('is-open');
    });
    viewsPanel.querySelectorAll('.views-panel__item').forEach(function (item) {
      item.addEventListener('click', function () {
        viewsPanel.querySelectorAll('.views-panel__item').forEach(function (other) {
          other.classList.remove('is-active');
        });
        item.classList.add('is-active');
        document.querySelector('[data-view-name]').textContent = item.textContent;
        viewsPanel.classList.remove('is-open');
      });
    });
  }

  /* ── Characteristics table ───────────────────────────────────────────── */

  var tableBody = document.querySelector('[data-table-body]');
  var tableSearch = document.querySelector('[data-table-search]');
  var tableCount = document.querySelector('[data-table-count]');
  var sortState = { key: null, dir: 1 };

  /* Inline row editing — Figma 507:44397. The pencil turns the row's own cells
     into fields; the row action swaps to save / cancel. One row at a time, and
     the typed values live in `editDraft` so a sort or a search mid-edit does not
     lose them. */
  var editingId = null;
  var editDraft = null;
  var urlAddOpen = false; // the editing row's "Add URL" field
  var urlDraft = '';

  var EDIT_FIELDS = [
    { key: 'result', label: 'Result', type: 'text' },
    { key: 'inspectedBy', label: 'Inspected By', type: 'text' },
    { key: 'inspectionDate', label: 'Inspection Date', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'text' }
  ];

  function rowById(id) {
    return QC.characteristics.filter(function (row) {
      return String(row.id) === String(id);
    })[0];
  }

  /* The Attachments column is the line level of the library, filtered to this
     row — not a copy of the file name. Add or delete a line-level attachment and
     the cell follows. Assigned by the library so the table can open a file in it. */
  var openInLibrary = null;

  function lineAttachments(row) {
    return QC.attachments.line.filter(function (item) {
      return String(item.line) === String(row.id);
    });
  }

  function attFileHtml(item) {
    return (
      '<button class="att-cell__file' + (item.kind === 'url' ? ' att-cell__file--link' : '') +
      '" type="button" data-attachment-id="' + esc(item.id) +
      '" title="' + esc(item.name) + ' — open in the Attachments Library">' +
      '<img src="' + ICONS + DOC_ICONS[item.kind] + '" alt="' + item.kind + '">' +
      '<span>' + esc(item.name) + '</span></button>'
    );
  }

  function attCell(row) {
    var items = lineAttachments(row);
    if (!items.length) {
      return '<td class="col-att"><span class="att-cell__none" title="No attachment on this ' +
        'characteristic">—</span></td>';
    }
    return '<td class="col-att"><span class="att-cell">' +
      items.map(attFileHtml).join('') + '</span></td>';
  }

  /* Editing a row: the attachments it already has stay clickable, and the
     library's own "Add File | URL" affordance attaches more to this row.
     Figma 642:203899. */
  function attEditCell(row) {
    var items = lineAttachments(row);
    return (
      '<td class="col-att"><span class="att-cell att-cell--editing">' +
      items.map(attFileHtml).join('') +
      '<span class="att-cell__add">Add ' +
      '<button type="button" data-att-add-file="' + row.id + '">File</button>' +
      '<span class="att__pipe">|</span>' +
      '<button type="button" data-att-add-url="' + row.id + '"' +
      (urlAddOpen ? ' class="is-active"' : '') + '>URL</button></span>' +
      (urlAddOpen
        ? '<span class="att-cell__url">' +
          '<input class="cell-input" type="text" placeholder="Type URL here"' +
          ' aria-label="URL to attach to this characteristic" value="' + esc(urlDraft) + '"' +
          ' size="1" data-att-url-field="' + row.id + '">' +
          '<button class="att-cell__url-add" type="button" data-att-url-commit="' + row.id + '"' +
          (urlDraft.trim() ? '' : ' disabled') + '>Add</button></span>'
        : '') +
      '</span></td>'
    );
  }

  /* The data carries MM/DD/YYYY; <input type="date"> needs YYYY-MM-DD. */
  function toInputDate(value) {
    var parts = String(value || '').split('/');
    if (parts.length !== 3) return '';
    return parts[2] + '-' + parts[0] + '-' + parts[1];
  }

  function fromInputDate(value) {
    var parts = String(value || '').split('-');
    if (parts.length !== 3) return '';
    return parts[1] + '/' + parts[2] + '/' + parts[0];
  }

  function editCell(key) {
    var field = EDIT_FIELDS.filter(function (item) { return item.key === key; })[0];
    var value = field.type === 'date' ? toInputDate(editDraft[key]) : editDraft[key];
    /* size="1" keeps the input from contributing its default 20-character
       intrinsic width to the column, which would widen the table on edit. */
    return (
      '<input class="cell-input" type="' + field.type + '" data-edit-field="' + key + '"' +
      (field.type === 'text' ? ' size="1"' : '') +
      ' value="' + esc(value) + '" aria-label="' + field.label + '">'
    );
  }

  function resultCell(row) {
    if (!row.resultTone) return esc(row.result);
    return (
      '<span class="result-pill result-pill--' + row.resultTone + '">' + esc(row.result) + '</span>'
    );
  }

  function actionsCell(row) {
    if (role === 'supplier') {
      if (editingId === row.id) {
        return (
          '<span class="row-edit-actions">' +
          '<button class="row-action row-action--bare" type="button" data-row-save="' + row.id +
          '" title="Save">' +
          '<img src="' + ICONS + 'check-outline.svg" alt="Save"></button>' +
          '<button class="row-action row-action--bare" type="button" data-row-cancel="' + row.id +
          '" title="Cancel">' +
          '<img src="' + ICONS + 'close-outline.svg" alt="Cancel"></button>' +
          '</span>'
        );
      }
      return (
        '<button class="row-action" type="button" data-row-edit="' +
        row.id +
        '" title="Edit result">' +
        '<img src="' + ICONS + 'edit-outline.svg" alt="Edit result"></button>'
      );
    }
    var icon = row.hasNewComment ? 'comment-alert.svg' : 'comment.svg';
    var label = row.hasNewComment ? 'Unread comment' : 'Comment';
    return (
      '<button class="row-action" type="button" data-row-comment="' +
      row.id +
      '" title="' + label + '">' +
      '<img src="' + ICONS + icon + '" alt="' + label + '"></button>'
    );
  }

  function rowHtml(row) {
    var editing = editingId === row.id;
    var cells = ['<td>' + row.id + '</td>', '<td>' + esc(row.characteristic) + '</td>',
      '<td class="col-spec" data-tooltip="' + esc(row.specification) + '">' +
      esc(row.specification) + '</td>'];

    /* ID, Characteristic and Specification are the buyer's request, so they stay
       read-only; the supplier edits its own four result columns. */
    if (editing) {
      cells.push('<td>' + editCell('result') + '</td>');
      cells.push('<td>' + editCell('inspectedBy') + '</td>');
      cells.push('<td>' + editCell('inspectionDate') + '</td>');
      cells.push('<td class="col-remarks">' + editCell('remarks') + '</td>');
      cells.push(attEditCell(row));
      cells.push('<td class="col-actions">' + actionsCell(row) + '</td>');
      return '<tr class="is-editing">' + cells.join('') + '</tr>';
    }

    if (role === 'buyer') {
      cells.push('<td>' + esc(row.range) + '</td>');
      cells.push('<td>' + resultCell(row) + '</td>');
      cells.push('<td>' + esc(row.expectedResult) + '</td>');
      cells.push('<td>' + esc(row.inspectedBy) + '</td>');
      cells.push('<td>' + esc(row.inspectionDate) + '</td>');
      cells.push('<td class="col-remarks" data-tooltip="' + esc(row.remarks) + '">' +
        esc(row.remarks) + '</td>');
      /* The buyer reviews against the evidence, so the same cell is here — the
         supplier attaches from a row, the buyer opens what a row carries. */
      cells.push(attCell(row));
    } else {
      cells.push('<td>' + resultCell(row) + '</td>');
      cells.push('<td>' + esc(row.inspectedBy) + '</td>');
      cells.push('<td>' + esc(row.inspectionDate) + '</td>');
      cells.push('<td class="col-remarks" data-tooltip="' + esc(row.remarks) + '">' +
        esc(row.remarks) + '</td>');
      cells.push(attCell(row));
    }
    cells.push('<td class="col-actions">' + actionsCell(row) + '</td>');
    return '<tr>' + cells.join('') + '</tr>';
  }

  function visibleRows() {
    var term = (tableSearch && tableSearch.value || '').trim().toLowerCase();
    var rows = QC.characteristics.filter(function (row) {
      if (!term) return true;
      return [
        row.id, row.characteristic, row.specification, row.range, row.result,
        row.expectedResult, row.inspectedBy, row.inspectionDate, row.remarks,
        /* the file names the Attachments column shows */
        lineAttachments(row).map(function (item) { return item.name; }).join(' ')
      ].join(' ').toLowerCase().indexOf(term) !== -1;
    });

    if (sortState.key) {
      rows = rows.slice().sort(function (a, b) {
        var x = a[sortState.key];
        var y = b[sortState.key];
        if (typeof x === 'number' && typeof y === 'number') return (x - y) * sortState.dir;
        return String(x).localeCompare(String(y)) * sortState.dir;
      });
    }
    return rows;
  }

  function renderTable() {
    if (!tableBody) return;
    var rows = visibleRows();
    tableBody.innerHTML = rows.length
      ? rows.map(rowHtml).join('')
      : '<tr><td colspan="12" class="history__empty">No characteristics match your search.</td></tr>';
    if (tableCount) {
      tableCount.textContent =
        rows.length + ' of ' + QC.characteristics.length + ' characteristics';
    }
    bindRowActions();
  }

  /* Attaching from the row being edited. The file lands in the Attachments
     Library at line level, tagged with this characteristic's ID, so it shows up
     in the row's cell, in the library list and in the counts at once. */
  var rowPicker = document.createElement('input');
  rowPicker.type = 'file';
  rowPicker.multiple = true;
  rowPicker.hidden = true;
  document.body.appendChild(rowPicker);

  function kindOfName(name) {
    if (/\.(docx?|rtf)$/i.test(name)) return 'word';
    if (/\.pdf$/i.test(name)) return 'pdf';
    if (/\.(png|jpe?g|gif|webp|bmp|tiff?)$/i.test(name)) return 'image';
    return 'pdf';
  }

  var refreshLibrary = null; // assigned by the Attachments Library below

  function attachToLine(lineId, item) {
    item.line = Number(lineId);
    QC.attachments.line.push(item);
    renderTable();
    if (refreshLibrary) refreshLibrary(item);
  }

  rowPicker.addEventListener('change', function () {
    var lineId = rowPicker.dataset.line;
    var added = [];
    Array.prototype.forEach.call(rowPicker.files, function (file) {
      var kind = kindOfName(file.name);
      attachToLine(lineId, {
        id: 'a' + Date.now() + '-' + added.length,
        kind: kind,
        name: file.name,
        actions: kind === 'image' ? ['download'] : ['download', 'trash']
      });
      added.push(file.name);
    });
    rowPicker.value = '';
    if (!added.length) return;
    toast(added.length === 1
      ? added[0] + ' attached to characteristic ' + lineId + '.'
      : added.length + ' files attached to characteristic ' + lineId + '.');
  });

  function addUrlToRow(lineId) {
    var value = urlDraft.trim();
    if (!value) return;
    var name = value.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    urlDraft = '';
    urlAddOpen = false;
    attachToLine(lineId, {
      id: 'u' + Date.now(),
      kind: 'url',
      name: name,
      url: /^https?:\/\//i.test(value) ? value : 'https://' + value,
      actions: ['trash']
    });
    toast(name + ' attached to characteristic ' + lineId + '.');
  }

  function startEdit(id) {
    var row = rowById(id);
    if (!row) return;
    editingId = row.id;
    urlAddOpen = false;
    urlDraft = '';
    editDraft = {};
    EDIT_FIELDS.forEach(function (field) {
      editDraft[field.key] = row[field.key] || '';
    });
    renderTable();
    var first = tableBody.querySelector('.is-editing .cell-input');
    if (first) {
      first.focus();
      first.select();
    }
  }

  function cancelEdit() {
    editingId = null;
    editDraft = null;
    urlAddOpen = false;
    urlDraft = '';
    renderTable();
  }

  function saveEdit() {
    var row = rowById(editingId);
    if (!row) return cancelEdit();

    if (!String(editDraft.result).trim()) {
      var resultInput = tableBody.querySelector('[data-edit-field="result"]');
      if (resultInput) resultInput.focus();
      toast('Enter a result before saving.');
      return;
    }

    var changes = EDIT_FIELDS.filter(function (field) {
      return String(editDraft[field.key]).trim() !== String(row[field.key] || '');
    });

    changes.forEach(function (field) {
      row[field.key] = String(editDraft[field.key]).trim();
    });

    var characteristic = row.characteristic;
    var id = row.id;
    cancelEdit();

    if (!changes.length) return;

    /* Same shape as the design's "Revised Result" history entries. */
    addHistoryEntry({
      action: 'Updated Results on ',
      link: 'Characteristic: ' + id + ' (' + characteristic + ')',
      lines: ['Item: ' + QC.inspection.summary.itemName].concat(
        changes.map(function (field) {
          return field.label + ': ' + (row[field.key] || '—');
        })
      ),
      scroll: false
    });
    toast('Characteristic ' + id + ' updated.');
  }

  function bindRowActions() {
    tableBody.querySelectorAll('[data-row-edit]').forEach(function (button) {
      button.addEventListener('click', function () {
        startEdit(button.dataset.rowEdit);
      });
    });
    tableBody.querySelectorAll('[data-row-save]').forEach(function (button) {
      button.addEventListener('click', saveEdit);
    });
    tableBody.querySelectorAll('[data-row-cancel]').forEach(function (button) {
      button.addEventListener('click', cancelEdit);
    });
    tableBody.querySelectorAll('[data-edit-field]').forEach(function (input) {
      input.addEventListener('input', function () {
        editDraft[input.dataset.editField] = input.type === 'date'
          ? fromInputDate(input.value)
          : input.value;
      });
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveEdit();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation(); // the global Escape closes modals
          cancelEdit();
        }
      });
    });
    tableBody.querySelectorAll('[data-row-comment]').forEach(function (button) {
      button.addEventListener('click', function () {
        var row = QC.characteristics[button.dataset.rowComment - 1];
        var box = document.querySelector('[data-comment-input]');
        if (box) {
          box.value = 'Characteristic ' + row.id + ' (' + row.characteristic + '): ';
          box.focus();
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
    tableBody.querySelectorAll('[data-attachment-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (openInLibrary) openInLibrary(button.dataset.attachmentId);
      });
    });

    /* The editing row's "Add File | URL" */
    tableBody.querySelectorAll('[data-att-add-file]').forEach(function (button) {
      button.addEventListener('click', function () {
        rowPicker.dataset.line = button.dataset.attAddFile;
        rowPicker.click();
      });
    });
    tableBody.querySelectorAll('[data-att-add-url]').forEach(function (button) {
      button.addEventListener('click', function () {
        urlAddOpen = !urlAddOpen;
        if (!urlAddOpen) urlDraft = '';
        renderTable();
        var field = tableBody.querySelector('[data-att-url-field]');
        if (field) field.focus();
      });
    });
    tableBody.querySelectorAll('[data-att-url-field]').forEach(function (field) {
      field.addEventListener('input', function () {
        urlDraft = field.value;
        var add = tableBody.querySelector('[data-att-url-commit]');
        if (add) add.disabled = !urlDraft.trim();
      });
      field.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation(); // Enter here adds the URL, it does not save the row
          addUrlToRow(field.dataset.attUrlField);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation(); // Esc here closes the URL field, it does not cancel the row
          urlAddOpen = false;
          urlDraft = '';
          renderTable();
        }
      });
    });
    tableBody.querySelectorAll('[data-att-url-commit]').forEach(function (button) {
      button.addEventListener('click', function () {
        addUrlToRow(button.dataset.attUrlCommit);
      });
    });
  }

  if (tableSearch) {
    tableSearch.addEventListener('input', renderTable);
  }

  /* ── Hover tooltip for cells the column clips ────────────────────────── */

  if (tableBody) (function () {
    var tip = document.createElement('div');
    tip.className = 'cell-tooltip';
    document.body.appendChild(tip);

    function hide() {
      tip.classList.remove('is-visible');
    }

    function show(cell) {
      if (cell.scrollWidth <= cell.clientWidth) return; // nothing is clipped
      tip.textContent = cell.dataset.tooltip;
      tip.style.left = '0px';
      tip.classList.add('is-visible');

      var box = cell.getBoundingClientRect();
      var limit = document.documentElement.clientWidth - 8;
      var left = box.left + window.pageXOffset;
      if (left + tip.offsetWidth > limit) left = Math.max(8, limit - tip.offsetWidth);
      tip.style.left = left + 'px';
      tip.style.top = box.bottom + window.pageYOffset + 6 + 'px';
    }

    tableBody.addEventListener('mouseover', function (event) {
      var cell = event.target.closest('[data-tooltip]');
      if (cell) show(cell);
    });

    tableBody.addEventListener('mouseout', function (event) {
      if (event.target.closest('[data-tooltip]')) hide();
    });

    var scroller = tableBody.closest('.table-scroll');
    if (scroller) scroller.addEventListener('scroll', hide);
    window.addEventListener('scroll', hide);
  })();

  document.querySelectorAll('[data-sort-key]').forEach(function (th) {
    th.style.cursor = 'pointer';
    th.addEventListener('click', function () {
      var key = th.dataset.sortKey;
      sortState.dir = sortState.key === key ? -sortState.dir : 1;
      sortState.key = key;
      renderTable();
    });
  });

  /* ── Pagination + page size (visual only, single page of data) ────────── */

  document.querySelectorAll('[data-page-size] button').forEach(function (button) {
    button.addEventListener('click', function () {
      button.parentNode.querySelectorAll('button').forEach(function (other) {
        other.classList.remove('is-current');
      });
      button.classList.add('is-current');
      toast('Items per page: ' + button.textContent);
    });
  });

  document.querySelectorAll('[data-pager] button').forEach(function (button) {
    button.addEventListener('click', function () {
      if (/^\d+$/.test(button.textContent)) {
        button.parentNode.querySelectorAll('button').forEach(function (other) {
          other.classList.remove('is-current');
        });
        button.classList.add('is-current');
      }
      toast('Page ' + button.textContent);
    });
  });

  /* ── Inspections list — Figma 514:38555 ──────────────────────────────── */

  /* The page "View All Quality Inspections" leads to. Its own search and sort,
     kept apart from the characteristics table above so the two tables never share
     a sort state. Inspection ID, Item and Supplier are links, as the design draws
     them; only the ID opens a screen, and only for 001. */
  var insBody = document.querySelector('[data-inspections-body]');

  if (insBody) (function () {
    /* Every column, in the order the design lists them. `link` marks the cells the
       design draws in blue; `numeric` is the right-aligned ID. */
    var INS_COLUMNS = [
      { key: 'id', link: 'open', numeric: true },
      { key: 'documentReference' },
      { key: 'requestedBy' },
      { key: 'itemName', link: 'item' },
      { key: 'supplierPartNumber' },
      { key: 'buyerPartNumber' },
      { key: 'requestDate', nowrap: true },
      { key: 'dueDate', nowrap: true },
      { key: 'status' },
      { key: 'resolutionReason' },
      { key: 'supplier', link: 'supplier' },
      { key: 'createdAt', nowrap: true }
    ];

    var insSearch = document.querySelector('[data-ins-search]');
    /* The design shows the list newest first, marked on Inspection ID. The IDs
       run with time, so descending is newest first — and 008, the inspection this
       prototype builds out, is the most recent one and opens at the top. */
    var insSort = { key: 'id', dir: -1 };

    function insById(id) {
      return QC.inspections.filter(function (row) {
        return String(row.id) === String(id);
      })[0];
    }

    function insCellHtml(row, column) {
      var value = row[column.key];
      var text = esc(value === '' || value == null ? '' : value);
      /* A date reads as one token, so those columns are held on a single line. */
      var classes = (column.numeric ? 'col-num ' : '') + (column.nowrap ? 'col-nowrap' : '');
      var css = classes.trim() ? ' class="' + classes.trim() + '"' : '';
      if (!column.link || !text) return '<td' + css + '>' + text + '</td>';
      return (
        '<td' + css + '><button class="link-button" type="button" data-ins-link="' +
        column.link + '" data-ins-id="' + esc(row.id) + '">' + text + '</button></td>'
      );
    }

    function insRowHtml(row) {
      return '<tr>' + INS_COLUMNS.map(function (column) {
        return insCellHtml(row, column);
      }).join('') + '</tr>';
    }

    function followLink(kind, id) {
      var row = insById(id);
      if (!row) return;
      if (kind === 'item') {
        toast('Item page for ' + row.itemName + ' is out of scope for this prototype.');
        return;
      }
      if (kind === 'supplier') {
        toast('Supplier record for ' + row.supplier + ' is out of scope for this prototype.');
        return;
      }
      if (row.href) {
        window.location.href = row.href;
        return;
      }
      toast('Inspection ' + row.id + ' (' + row.itemName +
        ') is not built out in this prototype.');
    }

    function insRows() {
      var term = (insSearch && insSearch.value || '').trim().toLowerCase();
      var rows = QC.inspections.filter(function (row) {
        if (!term) return true;
        return INS_COLUMNS.map(function (column) {
          return row[column.key];
        }).join(' ').toLowerCase().indexOf(term) !== -1;
      });

      if (insSort.key) {
        rows = rows.slice().sort(function (a, b) {
          var x = a[insSort.key];
          var y = b[insSort.key];
          if (typeof x === 'number' && typeof y === 'number') return (x - y) * insSort.dir;
          return String(x).localeCompare(String(y)) * insSort.dir;
        });
      }
      return rows;
    }

    function renderInsHeaders() {
      document.querySelectorAll('[data-ins-sort-key]').forEach(function (th) {
        var caret = th.querySelector('.sort-caret');
        if (caret) th.removeChild(caret);
        if (th.dataset.insSortKey !== insSort.key) return;
        var img = document.createElement('img');
        img.className = 'sort-caret' + (insSort.dir === 1 ? ' sort-caret--asc' : '');
        img.src = ICONS + 'caret-sort.svg';
        img.alt = insSort.dir === 1 ? 'sorted ascending' : 'sorted descending';
        th.appendChild(img);
      });
    }

    function renderInspections() {
      var rows = insRows();
      insBody.innerHTML = rows.length
        ? rows.map(insRowHtml).join('')
        : '<tr><td colspan="' + INS_COLUMNS.length +
          '" class="history__empty">No inspection requests match your search.</td></tr>';
      renderInsHeaders();
      insBody.querySelectorAll('[data-ins-link]').forEach(function (button) {
        button.addEventListener('click', function () {
          followLink(button.dataset.insLink, button.dataset.insId);
        });
      });
    }

    document.querySelectorAll('[data-ins-sort-key]').forEach(function (th) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var key = th.dataset.insSortKey;
        insSort.dir = insSort.key === key ? -insSort.dir : 1;
        insSort.key = key;
        renderInspections();
      });
    });

    if (insSearch) insSearch.addEventListener('input', renderInspections);

    renderInspections();
  })();

  /* ── Attachments Library — Figma 758:125789 ──────────────────────────── */

  var att = document.querySelector('[data-attachments]');

  if (att) (function () {
    var PAGE_SIZE = 10; // Figma "Line level - w/pagination" shows 10 rows a page.
    var PREVIEW_ACTIONS = [
      { key: 'zoom-out', icon: 'zoom-out-outline.svg', label: 'Zoom out' },
      { key: 'zoom-in', icon: 'zoom-in-outline.svg', label: 'Zoom in' },
      { key: 'expand', icon: 'expand-outline.svg', label: 'Expand' },
      { key: 'rotate', icon: 'rotate-outline.svg', label: 'Rotate' },
      { key: 'download', icon: 'cloud-download-outline.svg', label: 'Download' },
      { key: 'remove', icon: 'close-outline.svg', label: 'Remove' }
    ];

    var rowsEl = att.querySelector('[data-att-rows]');
    var titleEl = att.querySelector('[data-att-title]');
    var pagerEl = att.querySelector('[data-att-pager]');
    var previewEl = att.querySelector('[data-att-preview]');
    var filesEl = att.querySelector('[data-att-files]');
    var urlsEl = att.querySelector('[data-att-urls]');
    var urlInput = att.querySelector('[data-att-url-input]');
    var urlAdd = att.querySelector('[data-att-url-add]');
    var dropzone = att.querySelector('[data-att-dropzone]');
    var commentBox = att.querySelector('[data-att-comment]');

    var tab = 'header';
    var page = 1;
    var selected = null;
    var addMode = null;
    var zoom = 1;
    var rotation = 0;

    /* A real picker so "Browse" and drag-and-drop actually attach something. */
    var filePicker = document.createElement('input');
    filePicker.type = 'file';
    filePicker.multiple = true;
    filePicker.hidden = true;
    att.appendChild(filePicker);

    function list() {
      return QC.attachments[tab];
    }

    function all() {
      return QC.attachments.header.concat(QC.attachments.line);
    }

    function kindOf(name) {
      if (/\.(docx?|rtf)$/i.test(name)) return 'word';
      if (/\.pdf$/i.test(name)) return 'pdf';
      if (/\.(png|jpe?g|gif|webp|bmp|tiff?)$/i.test(name)) return 'image';
      return 'pdf';
    }

    function plural(count, noun) {
      return count + ' ' + noun + (count === 1 ? '' : 's');
    }

    function renderCounts() {
      var items = all();
      var files = items.filter(function (item) { return item.kind !== 'url'; }).length;
      var urls = items.length - files;
      filesEl.textContent = plural(files, 'File');
      urlsEl.textContent = plural(urls, 'URL');
      document.querySelectorAll('[data-att-counts]').forEach(function (el) {
        el.textContent = plural(files, 'File') + ' | ' + plural(urls, 'URL');
      });
      att.querySelector('[data-att-badge="header"]').textContent = QC.attachments.header.length;
      att.querySelector('[data-att-badge="line"]').textContent = QC.attachments.line.length;
    }

    function rowActionHtml(item, action) {
      var icon = action === 'download' ? 'download-outline.svg' : 'trash-outline.svg';
      var label = (action === 'download' ? 'Download ' : 'Delete ') + item.name;
      return (
        '<button class="att__row-action" type="button" data-att-row-action="' + action + '" ' +
        'data-att-id="' + item.id + '" title="' + esc(label) + '">' +
        '<img src="' + ICONS + icon + '" alt="' + esc(label) + '"></button>'
      );
    }

    function rowHtml(item) {
      var nameClass = 'att__row-name' + (item.kind === 'url' ? ' att__row-name--link' : '');
      return (
        '<li class="att__row' + (selected === item.id ? ' is-selected' : '') + '" ' +
        'data-att-row="' + item.id + '" tabindex="0" role="button">' +
        (tab === 'line' ? '<span class="att__row-line">' + esc(item.line) + '</span>' : '') +
        '<img class="att__row-icon" src="' + ICONS + DOC_ICONS[item.kind] + '" alt="' + item.kind + '">' +
        '<span class="' + nameClass + '" title="' + esc(item.name) + '">' + esc(item.name) + '</span>' +
        '<span class="att__row-actions">' +
        item.actions.map(function (action) { return rowActionHtml(item, action); }).join('') +
        '</span></li>'
      );
    }

    function pageCount() {
      return Math.max(1, Math.ceil(list().length / PAGE_SIZE));
    }

    function renderPager() {
      var pages = pageCount();
      if (pages < 2) {
        pagerEl.innerHTML = '';
        return;
      }
      var html = '<button class="att__pager-prev" type="button" data-att-page="' + (page - 1) +
        '"' + (page === 1 ? ' disabled' : '') + ' aria-label="Previous page">' +
        '<img src="' + ICONS + 'pager-chevron.svg" alt=""></button>';
      for (var i = 1; i <= pages; i += 1) {
        html += '<button type="button" data-att-page="' + i + '"' +
          (i === page ? ' class="is-current" aria-current="page"' : '') + '>' + i + '</button>';
      }
      html += '<button type="button" data-att-page="' + (page + 1) + '"' +
        (page === pages ? ' disabled' : '') + ' aria-label="Next page">' +
        '<img src="' + ICONS + 'pager-chevron.svg" alt=""></button>';
      pagerEl.innerHTML = html;
    }

    function docHtml(preview) {
      return '<div class="att__doc">' + preview.blocks.map(function (block) {
        if (block.type === 'title') return '<h4>' + esc(block.text) + '</h4>';
        if (block.type === 'meta') return '<p class="att__doc-meta">' + esc(block.text) + '</p>';
        if (block.type === 'h') return '<h5>' + esc(block.text) + '</h5>';
        if (block.type === 'ul') {
          return '<ul>' + block.items.map(function (line) {
            return '<li>' + esc(line) + '</li>';
          }).join('') + '</ul>';
        }
        return '<p>' + esc(block.text) + '</p>';
      }).join('') + '</div>';
    }

    function find(id) {
      var match = all().filter(function (item) { return item.id === id; });
      return match[0] || null;
    }

    function renderPreview() {
      var item = selected ? find(selected) : null;

      if (!item) {
        att.querySelector('[data-att-preview]').classList.remove('is-full');
        previewEl.innerHTML =
          '<div class="att__preview-empty"><h3>Document preview</h3>' +
          '<p>Select a document from list to view here</p></div>';
        return;
      }

      if (item.kind === 'url') {
        previewEl.innerHTML =
          '<div class="att__link"><h3>Link Attachment</h3><p>' +
          '<a href="' + esc(item.url) + '" target="_blank" rel="noreferrer">' + esc(item.name) + '</a>' +
          '<img src="' + ICONS + 'open-external-outline.svg" alt="Opens in a new tab"></p></div>';
        return;
      }

      var body;
      if (item.preview && item.preview.type === 'image') {
        body = '<img src="' + esc(item.preview.src) + '" alt="' + esc(item.preview.alt || item.name) +
          '" data-att-zoomable>';
      } else if (item.preview && item.preview.type === 'doc') {
        body = docHtml(item.preview);
      } else {
        body = '<p class="att__note">This prototype does not include a preview for ' +
          esc(item.name) + '.</p>';
      }

      previewEl.innerHTML =
        '<div class="att__preview-bar"><p class="att__preview-name">' + esc(item.name) + '</p>' +
        '<div class="att__actions">' + PREVIEW_ACTIONS.map(function (action) {
          return '<button class="att__action" type="button" data-att-preview-action="' + action.key +
            '" title="' + action.label + '"><img src="' + ICONS + action.icon + '" alt="' +
            action.label + '"></button>';
        }).join('') + '</div></div>' +
        '<div class="att__sheet">' + body + '</div>';

      applyTransform();
    }

    function applyTransform() {
      var target = previewEl.querySelector('.att__sheet img, .att__doc');
      if (!target) return;
      target.style.transform = 'scale(' + zoom + ') rotate(' + rotation + 'deg)';
    }

    function render() {
      renderCounts();
      titleEl.textContent = tab === 'header' ? 'Header' : 'Line';
      if (page > pageCount()) page = pageCount();
      var items = list().slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
      rowsEl.innerHTML = items.length
        ? items.map(rowHtml).join('')
        : '<li class="att__empty">No attachments at this level.</li>';
      renderPager();
    }

    function select(id) {
      selected = id;
      zoom = 1;
      rotation = 0;
      render();
      renderPreview();
    }

    function remove(id) {
      ['header', 'line'].forEach(function (level) {
        QC.attachments[level] = QC.attachments[level].filter(function (item) {
          return item.id !== id;
        });
      });
      if (selected === id) selected = null;
      render();
      renderPreview();
      renderTable(); // the table's Attachments column reads this list
    }

    /* Attaching from a row in inline edit re-renders the list, counts and pager,
       and pages the line level to the file that was just added. */
    refreshLibrary = function (item) {
      if (item && tab === 'line') {
        page = Math.floor(QC.attachments.line.indexOf(item) / PAGE_SIZE) + 1;
      }
      render();
      renderPreview();
    };

    /* Opening a file from the table's Attachments column: expand the card, go to
       the level and page the file is on, select it and scroll it into view. */
    openInLibrary = function (id) {
      var item = find(id);
      if (!item) return;
      att.classList.remove('is-collapsed');
      att.querySelector('.card__header').setAttribute('aria-expanded', 'true');
      var level = QC.attachments.header.indexOf(item) !== -1 ? 'header' : 'line';
      if (tab !== level) att.querySelector('[data-att-tab="' + level + '"]').click();
      page = Math.floor(QC.attachments[level].indexOf(item) / PAGE_SIZE) + 1;
      select(id);
      att.querySelector('.att__panes').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    function nextLineNumber() {
      return QC.attachments.line.reduce(function (max, item) {
        return Math.max(max, item.line || 0);
      }, 0) + 1;
    }

    function addFiles(fileList) {
      var added = [];
      Array.prototype.forEach.call(fileList, function (file) {
        var item = {
          id: 'a' + Date.now() + '-' + added.length,
          kind: kindOf(file.name),
          name: file.name,
          actions: kindOf(file.name) === 'image' ? ['download'] : ['download', 'trash']
        };
        if (tab === 'line') item.line = nextLineNumber() + added.length;
        list().push(item);
        added.push(item);
      });
      if (!added.length) return;
      page = pageCount();
      render();
      renderTable();
      toast(added.length === 1
        ? added[0].name + ' attached.'
        : added.length + ' files attached.');
    }

    function setAddMode(mode) {
      addMode = addMode === mode ? null : mode;
      att.classList.toggle('is-adding', Boolean(addMode));
      att.classList.toggle('is-adding-file', addMode === 'file');
      att.classList.toggle('is-adding-url', addMode === 'url');
      att.querySelectorAll('[data-att-add]').forEach(function (button) {
        button.classList.toggle('is-active', button.dataset.attAdd === addMode);
      });
      if (addMode === 'url' && urlInput) urlInput.focus();
    }

    /* Tabs */
    att.querySelectorAll('[data-att-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        att.querySelectorAll('[data-att-tab]').forEach(function (other) {
          other.classList.remove('is-active');
          other.setAttribute('aria-selected', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');
        tab = button.dataset.attTab;
        page = 1;
        render();
      });
    });

    /* Rows: select, download, delete */
    rowsEl.addEventListener('click', function (event) {
      var action = event.target.closest('[data-att-row-action]');
      if (action) {
        var item = find(action.dataset.attId);
        if (!item) return;
        if (action.dataset.attRowAction === 'download') {
          toast('Downloading ' + item.name);
        } else {
          remove(item.id);
          toast(item.name + ' deleted.');
        }
        return;
      }
      var row = event.target.closest('[data-att-row]');
      if (row) select(row.dataset.attRow);
    });

    rowsEl.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var row = event.target.closest('[data-att-row]');
      if (!row) return;
      event.preventDefault();
      select(row.dataset.attRow);
    });

    /* Pagination */
    pagerEl.addEventListener('click', function (event) {
      var button = event.target.closest('[data-att-page]');
      if (!button || button.disabled) return;
      page = Number(button.dataset.attPage);
      render();
    });

    /* Preview action set */
    previewEl.addEventListener('click', function (event) {
      var button = event.target.closest('[data-att-preview-action]');
      if (!button) return;
      var item = find(selected);
      switch (button.dataset.attPreviewAction) {
        case 'zoom-in':
          zoom = Math.min(2, Math.round((zoom + 0.1) * 10) / 10);
          applyTransform();
          break;
        case 'zoom-out':
          zoom = Math.max(0.5, Math.round((zoom - 0.1) * 10) / 10);
          applyTransform();
          break;
        case 'rotate':
          rotation = (rotation + 90) % 360;
          applyTransform();
          break;
        case 'expand':
          previewEl.classList.toggle('is-full');
          break;
        case 'download':
          if (item) toast('Downloading ' + item.name);
          break;
        case 'remove':
          if (item) {
            remove(item.id);
            toast(item.name + ' removed from the library.');
          }
          break;
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') previewEl.classList.remove('is-full');
    });

    /* "6 Files | 1 URL" links */
    att.querySelectorAll('[data-att-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        att.classList.remove('is-collapsed');
        att.querySelector('.card__header').setAttribute('aria-expanded', 'true');
        if (button.dataset.attJump === 'url') {
          var url = all().filter(function (item) { return item.kind === 'url'; })[0];
          if (url) {
            var level = QC.attachments.header.indexOf(url) !== -1 ? 'header' : 'line';
            att.querySelector('[data-att-tab="' + level + '"]').click();
            select(url.id);
          }
        }
        att.querySelector('.att__panes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });

    /* Add File / Add URL */
    att.querySelectorAll('[data-att-add]').forEach(function (button) {
      button.addEventListener('click', function () {
        setAddMode(button.dataset.attAdd);
      });
    });

    att.querySelector('[data-att-browse]').addEventListener('click', function () {
      filePicker.click();
    });

    filePicker.addEventListener('change', function () {
      addFiles(filePicker.files);
      filePicker.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (type) {
      dropzone.addEventListener(type, function (event) {
        event.preventDefault();
        dropzone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(function (type) {
      dropzone.addEventListener(type, function (event) {
        event.preventDefault();
        dropzone.classList.remove('is-dragover');
        if (type === 'drop' && event.dataTransfer) addFiles(event.dataTransfer.files);
      });
    });

    urlInput.addEventListener('input', function () {
      urlAdd.disabled = !urlInput.value.trim();
    });

    urlAdd.addEventListener('click', function () {
      var value = urlInput.value.trim();
      if (!value) return;
      var name = value.replace(/^https?:\/\//i, '').replace(/\/$/, '');
      var item = {
        id: 'u' + Date.now(),
        kind: 'url',
        name: name,
        url: /^https?:\/\//i.test(value) ? value : 'https://' + value,
        actions: ['trash']
      };
      if (tab === 'line') item.line = nextLineNumber();
      list().push(item);
      urlInput.value = '';
      urlAdd.disabled = true;
      page = pageCount();
      render();
      renderTable();
      toast(name + ' attached.');
    });

    att.querySelector('[data-att-adder-submit]').addEventListener('click', function () {
      var text = commentBox.value.trim();
      if (!text) {
        commentBox.focus();
        toast('Enter a comment first.');
        return;
      }
      addHistoryComment(text);
      commentBox.value = '';
      toast('Comment added to History.');
    });

    render();
    renderPreview();
  })();

  /* ── History ─────────────────────────────────────────────────────────── */

  var historyList = document.querySelector('[data-history-list]');
  var historySearch = document.querySelector('[data-history-search]');
  var historySort = document.querySelector('[data-history-sort]');
  var historyChips = document.querySelectorAll('[data-history-filter]');
  var historyFilter = document.body.dataset.historyFilter || 'all';
  var historyDir = -1; // newest first
  var entries = QC.history.slice();

  function bubbleHtml(entry) {
    var action = esc(entry.action);
    if (entry.link) {
      action += '<a href="#" onclick="return false;">' + esc(entry.link) + '</a>';
    }
    return (
      '<article class="bubble' + (entry.isNew ? ' bubble--new' : '') + '">' +
      '<div class="bubble__user">' +
      '<div class="avatar">' + esc(entry.initials) + '</div>' +
      '<div class="bubble__body">' +
      '<span class="bubble__name">' + esc(entry.name) + '</span>' +
      '<p class="bubble__action">' + action + '</p>' +
      '<ul class="bubble__lines">' +
      entry.lines.map(function (line) { return '<li>' + esc(line) + '</li>'; }).join('') +
      '</ul></div></div>' +
      '<div class="bubble__bottom"><p class="bubble__timestamp">' + esc(entry.timestamp) + '</p></div>' +
      '</article>'
    );
  }

  function renderHistory() {
    if (!historyList) return;
    var term = (historySearch && historySearch.value || '').trim().toLowerCase();
    var visible = entries.filter(function (entry) {
      if (historyFilter !== 'all' && entry.actor !== historyFilter) return false;
      if (!term) return true;
      return (entry.name + ' ' + entry.action + ' ' + entry.link + ' ' + entry.lines.join(' '))
        .toLowerCase()
        .indexOf(term) !== -1;
    });

    visible.sort(function (a, b) {
      return a.sortKey < b.sortKey ? historyDir : a.sortKey > b.sortKey ? -historyDir : 0;
    });

    historyList.innerHTML = visible.length
      ? visible.map(bubbleHtml).join('')
      : '<p class="history__empty">No history entries match this filter.</p>';
  }

  historyChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      historyChips.forEach(function (other) {
        other.classList.remove('is-active');
        other.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      historyFilter = chip.dataset.historyFilter;
      renderHistory();
    });
  });

  if (historySearch) {
    historySearch.addEventListener('input', renderHistory);
  }

  if (historySort) {
    historySort.addEventListener('click', function () {
      historyDir = -historyDir;
      historySort.querySelector('span').textContent =
        historyDir === -1 ? 'Newest first' : 'Oldest first';
      renderHistory();
    });
  }

  /* ── Comment box → appends a history entry ───────────────────────────── */

  var commentInput = document.querySelector('[data-comment-input]');
  var commentSubmit = document.querySelector('[data-comment-submit]');

  var me = role === 'supplier'
    ? { actor: 'supplier', name: 'Niles Parker', initials: 'NP' }
    : { actor: 'buyer', name: 'Prasad T.', initials: 'PT' };

  function nowStamp() {
    var now = new Date();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var hours = now.getHours();
    var suffix = hours >= 12 ? 'PM' : 'AM';
    var display = hours % 12 === 0 ? 12 : hours % 12;
    var minutes = String(now.getMinutes()).padStart(2, '0');
    return {
      label: months[now.getMonth()] + ' ' + String(now.getDate()).padStart(2, '0') +
        ' - ' + display + ':' + minutes + ' ' + suffix,
      key: now.toISOString().slice(0, 16)
    };
  }

  /* Posts an entry as the current role, expands History and scrolls to it.
     Shared by the comment boxes and by saving an inline row edit. */
  function addHistoryEntry(entry) {
    var stamp = nowStamp();
    entries.forEach(function (other) { other.isNew = false; });
    entries.push({
      actor: me.actor,
      name: me.name,
      initials: me.initials,
      action: entry.action,
      link: entry.link || '',
      lines: entry.lines,
      timestamp: stamp.label,
      sortKey: stamp.key,
      isNew: true
    });
    var history = document.querySelector('.history');
    if (history) history.classList.remove('is-collapsed');
    renderHistory();
    /* A saved row edit does not scroll away from the table it was made in. */
    if (historyList && entry.scroll !== false) {
      historyList.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* Shared by the Comments card and the Attachments Library comment box. */
  function addHistoryComment(text) {
    addHistoryEntry({ action: 'Added a comment: ', link: '', lines: [' ' + text] });
  }

  if (commentSubmit && commentInput) {
    commentSubmit.addEventListener('click', function () {
      var text = commentInput.value.trim();
      if (!text) {
        commentInput.focus();
        toast('Enter a comment first.');
        return;
      }
      addHistoryComment(text);
      commentInput.value = '';
      toast('Comment added to History.');
    });
  }

  document.querySelectorAll('[data-comment-attach]').forEach(function (button) {
    button.addEventListener('click', function () {
      toast(button.dataset.commentAttach === 'file'
        ? 'File picker is out of scope for this prototype.'
        : 'URL attachment is out of scope for this prototype.');
    });
  });

  /* ── Notification email — email.html ─────────────────────────────────── */

  var emailRoot = document.querySelector('[data-email]');
  if (emailRoot) {
    var mail = QC.inspection.summary;

    /* The email is the "Requested" History entry read from the supplier's
       inbox, so the entry's own lines are what the email quotes — change the
       request in History and the email changes with it. */
    var requestEntry = QC.history.filter(function (entry) {
      return entry.action.indexOf('Requested') === 0;
    })[0] || { name: '', lines: [] };

    /* "PO #5001 / 0008" — the second half of the inspection's own title, so the
       subject line, the paragraph and the screens cannot disagree. */
    var poReference = (QC.inspection.title.split(' - ')[1] || '').trim();

    var MAIL_FIELDS = {
      itemName: mail.itemName,
      supplier: mail.supplier,
      dueDate: mail.dueDate,
      characteristicCount: String(QC.characteristics.length),
      poReference: poReference,
      /* The subject line names the order only: "PO #5001". */
      poNumber: poReference.split(' / ')[0].replace('PO ', ''),
      requestedByLine: requestEntry.name + ', Buyer Enterprises'
    };

    Object.keys(MAIL_FIELDS).forEach(function (key) {
      emailRoot.querySelectorAll('[data-email-field="' + key + '"]').forEach(function (el) {
        el.textContent = MAIL_FIELDS[key];
      });
    });

    /* The Summary card is the design's seven fields, four to a row. Document
       Reference and Item Name are links there, as they are in the list. */
    var MAIL_SUMMARY = [
      ['Inspection ID', mail.inspectionId],
      ['Document Reference', mail.documentReference, 'Purchase orders are out of scope for this prototype.'],
      ['Due Date', mail.dueDate],
      ['Item Name', mail.itemName, 'Item pages are out of scope for this prototype.'],
      ['Item Description', mail.itemDescription],
      ['Supplier Part Number', mail.supplierPartNumber],
      ['Manufacturer Part Number', mail.buyerPartNumber]
    ];

    emailRoot.querySelector('[data-email-summary]').innerHTML =
      MAIL_SUMMARY.map(function (field) {
        var value = field[2]
          ? '<button class="link-button" type="button" data-toast="' + esc(field[2]) + '">' +
            esc(field[1]) + '</button>'
          : esc(field[1]);
        return '<div><p class="email-summary__label">' + esc(field[0]) + '</p>' +
          '<p class="email-summary__value">' + value + '</p></div>';
      }).join('');
  }

  /* ── Modals ──────────────────────────────────────────────────────────── */

  function openModal(id) {
    var overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('is-open');
  }

  function closeModal(overlay) {
    overlay.classList.remove('is-open');
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger.dataset.openModal);
    });
  });

  document.querySelectorAll('.overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeModal(overlay);
    });
    overlay.querySelectorAll('[data-close-modal]').forEach(function (button) {
      button.addEventListener('click', function () {
        closeModal(overlay);
      });
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.overlay.is-open').forEach(closeModal);
  });

  document.querySelectorAll('[data-goto]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.location.href = button.dataset.goto;
    });
  });

  document.querySelectorAll('[data-toast]').forEach(function (button) {
    button.addEventListener('click', function () {
      toast(button.dataset.toast);
    });
  });

  /* ── Initial render ──────────────────────────────────────────────────── */

  renderTable();
  renderHistory();
})();
