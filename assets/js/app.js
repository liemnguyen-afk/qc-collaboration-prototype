/* Prototype behaviour for the Quality Inspection collaboration screens. */

(function () {
  'use strict';

  var role = document.body.dataset.role; // 'supplier' | 'buyer'
  var ICONS = 'assets/icons/';

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

  function resultCell(row) {
    if (!row.resultTone) return esc(row.result);
    return (
      '<span class="result-pill result-pill--' + row.resultTone + '">' + esc(row.result) + '</span>'
    );
  }

  function actionsCell(row) {
    if (role === 'supplier') {
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
    var cells = ['<td>' + row.id + '</td>', '<td>' + esc(row.characteristic) + '</td>',
      '<td class="col-spec" title="' + esc(row.specification) + '">' + esc(row.specification) + '</td>'];

    if (role === 'buyer') {
      cells.push('<td>' + esc(row.range) + '</td>');
      cells.push('<td>' + resultCell(row) + '</td>');
      cells.push('<td>' + esc(row.expectedResult) + '</td>');
      cells.push('<td>' + esc(row.inspectedBy) + '</td>');
      cells.push('<td>' + esc(row.inspectionDate) + '</td>');
      cells.push('<td class="col-remarks" title="' + esc(row.remarks) + '">' + esc(row.remarks) + '</td>');
    } else {
      cells.push('<td>' + resultCell(row) + '</td>');
      cells.push('<td>' + esc(row.inspectedBy) + '</td>');
      cells.push('<td>' + esc(row.inspectionDate) + '</td>');
      cells.push('<td class="col-remarks" title="' + esc(row.remarks) + '">' + esc(row.remarks) + '</td>');
      cells.push(
        '<td><button class="att-icon" type="button" data-attachment="' +
        esc(row.attachment) +
        '" title="' + esc(row.attachment) + '">' +
        '<img src="' + ICONS + 'page-blank.svg" alt="Attachment"></button></td>'
      );
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
        row.expectedResult, row.inspectedBy, row.inspectionDate, row.remarks
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

  function bindRowActions() {
    tableBody.querySelectorAll('[data-row-edit]').forEach(function (button) {
      button.addEventListener('click', function () {
        var row = QC.characteristics[button.dataset.rowEdit - 1];
        toast('Editing results for characteristic ' + row.id + ' — ' + row.characteristic);
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
    tableBody.querySelectorAll('[data-attachment]').forEach(function (button) {
      button.addEventListener('click', function () {
        toast('Opening ' + button.dataset.attachment);
      });
    });
  }

  if (tableSearch) {
    tableSearch.addEventListener('input', renderTable);
  }

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

  /* ── Attachments library ─────────────────────────────────────────────── */

  var libraryToggle = document.querySelector('[data-library-toggle]');
  if (libraryToggle) {
    libraryToggle.addEventListener('click', function () {
      var library = libraryToggle.closest('.library');
      library.classList.toggle('is-listing');
    });
  }

  document.querySelectorAll('[data-library-file]').forEach(function (file) {
    file.addEventListener('click', function () {
      toast('Opening ' + file.dataset.libraryFile);
    });
  });

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

  if (commentSubmit && commentInput) {
    commentSubmit.addEventListener('click', function () {
      var text = commentInput.value.trim();
      if (!text) {
        commentInput.focus();
        toast('Enter a comment first.');
        return;
      }
      var stamp = nowStamp();
      entries.forEach(function (entry) { entry.isNew = false; });
      entries.push({
        actor: me.actor,
        name: me.name,
        initials: me.initials,
        action: 'Added a comment: ',
        link: '',
        lines: [' ' + text],
        timestamp: stamp.label,
        sortKey: stamp.key,
        isNew: true
      });
      commentInput.value = '';
      var history = document.querySelector('.history');
      if (history) history.classList.remove('is-collapsed');
      renderHistory();
      toast('Comment added to History.');
      if (historyList) historyList.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  document.querySelectorAll('[data-comment-attach]').forEach(function (button) {
    button.addEventListener('click', function () {
      toast(button.dataset.commentAttach === 'file'
        ? 'File picker is out of scope for this prototype.'
        : 'URL attachment is out of scope for this prototype.');
    });
  });

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
