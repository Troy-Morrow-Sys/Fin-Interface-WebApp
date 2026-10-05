(function () {
  'use strict';

  const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.apiBaseUrl) || 'http://localhost:8080';
  const RECORDS_PER_PAGE = 10;
  const SEQUENCES = [
    { id: 1, name: 'Flow_StgToRDS_AR' },
    { id: 2, name: 'Flow_ARData_Cora_API' },
    { id: 3, name: 'Flow_ARData_HR_API' },
    { id: 4, name: 'Flow_ECAS_Kinesis_Stream' },
    { id: 5, name: 'Flow_ECAS_Kafka' }
  ];
  const DASHBOARDS = [
    {
      businessUnit: 'USBL',
      name: 'USBL HighRadius Dashboard',
      url: 'https://app.datadoghq.com/dashboard/8n5-dgj-r68/usbl-highradius-dashboard?fromUser=true&refresh_mode=sliding&live=true'
    },
    {
      businessUnit: 'HAWAII',
      name: 'HAWAII HighRadius Dashboard',
      url: 'https://app.datadoghq.com/dashboard/fbx-si5-7t2/hawaii-highradius-dashboard?fromUser=true&refresh_mode=sliding&live=true'
    },
    {
      businessUnit: 'CABL',
      name: 'CABL HighRadius Dashboard',
      url: 'https://app.datadoghq.com/dashboard/36u-piu-4b4/cabl-highradius-dashboard?fromUser=false&refresh_mode=sliding&live=true'
    },
    {
      businessUnit: 'Paragon',
      name: 'Paragon Prod - HighRadius Dashboard',
      url: 'https://app.datadoghq.com/dashboard/2hb-mc3-gic/paragon-prod---highradius-dashboard?fromUser=false&refresh_mode=sliding&live=true'
    }
  ];

  const state = {
    view: 'home',
    selectedDashboardIndex: 0,
    businessUnits: [],
    opcos: [],
    businessUnit: '',
    opco: '',
    businessUnitsLoading: false,
    searchLoading: false,
    opcoRequest: 0,
    searchError: '',
    invoices: [],
    invoiceSearch: '',
    currentPage: 1,
    selectedInvoice: null,
    records: [],
    missingRecords: '',
    detailLoading: false,
    detailError: '',
    selectedSequence: null,
    healthResults: {}
  };

  const app = document.getElementById('app');

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function statusClass(status) {
    switch (status) {
      case 'COMPLETED': return 'status-completed';
      case 'PENDING': return 'status-pending';
      case 'FAILED': return 'status-failed';
      default: return 'status-unknown';
    }
  }

  function statusBadge(status) {
    return '<span class="status-badge ' + statusClass(status) + '">' + escapeHTML(status) + '</span>';
  }

  function render() {
    switch (state.view) {
      case 'invoiceSearch': app.innerHTML = renderInvoiceSearch(); break;
      case 'results': app.innerHTML = renderResults(); break;
      case 'detail': app.innerHTML = renderDetail(); break;
      case 'datadog': app.innerHTML = renderDatadog(); break;
      case 'healthCheck': app.innerHTML = renderHealthCheck(); break;
      default: app.innerHTML = renderHome();
    }
  }

  function renderHome() {
    return '<div class="home-page">' +
      '<header class="home-header">' +
        '<a class="brand" href="#home" data-action="home" aria-label="Finance Integration Ops Portal home">' +
          '<img class="brand-mark" src="images/sysco-logo.png" alt="Sysco">' +
        '</a>' +
        '<h1>Finance Integration Ops Portal</h1>' +
        '<div class="user-summary"><span class="user-icon" aria-hidden="true">♙</span><span>Welcome</span></div>' +
      '</header>' +
      '<section class="home-content">' +
        '<div class="home-intro"><span class="eyebrow">FINANCE OPERATIONS</span><h2>What would you like to work on?</h2><p>Select an application to continue.</p></div>' +
        '<div class="application-grid">' +
          '<button class="application-card invoice-card" data-action="open-search">' +
            '<span class="application-icon invoice-icon" aria-hidden="true">▣</span>' +
            '<span class="application-name">Invoice Search</span>' +
            '<span class="application-description">Search invoices by business unit and operating company, then review transaction details.</span>' +
            '<span class="application-action">Open Invoice Search <span aria-hidden="true">→</span></span>' +
          '</button>' +
          '<button class="application-card datadog-card" data-action="open-datadog">' +
            '<span class="application-icon datadog-icon" aria-hidden="true">◌</span>' +
            '<span class="application-name">Datadog</span>' +
            '<span class="application-description">Monitor service performance and operational dashboards.</span>' +
            '<span class="application-action">Open Datadog <span aria-hidden="true">→</span></span>' +
          '</button>' +
          '<button class="application-card health-card" data-action="open-health">' +
            '<span class="application-icon health-icon" aria-hidden="true">♥</span>' +
            '<span class="application-name">Health Check</span>' +
            '<span class="application-description">View application availability, health status, and the last service check time.</span>' +
            '<span class="application-action">Coming soon</span>' +
          '</button>' +
        '</div>' +
      '</section>' +
    '</div>';
  }

  function renderInvoiceSearch() {
    const unitOptions = state.businessUnits.map(function (unit) {
      return '<option value="' + escapeHTML(unit) + '"' + (unit === state.businessUnit ? ' selected' : '') + '>' + escapeHTML(unit) + '</option>';
    }).join('');
    const opcoOptions = state.opcos.map(function (opco) {
      return '<option value="' + escapeHTML(opco) + '"' + (opco === state.opco ? ' selected' : '') + '>' + escapeHTML(opco) + '</option>';
    }).join('');
    const unitPlaceholder = state.businessUnitsLoading ? 'Loading Business Units...' : '-- Select Business Unit --';

    return '<section class="page-shell search-page"><div class="page-container narrow-container">' +
      '<button type="button" class="back-button" data-action="home">← Back to Home</button>' +
      '<header class="page-heading centered-heading"><span class="eyebrow">INVOICE MANAGEMENT SYSTEM</span><h1>Invoice Search</h1><p>Find an invoice by business unit and operating company.</p></header>' +
      '<form id="invoice-search-form" class="search-panel">' +
        '<h2>Search Invoices</h2>' +
        (state.searchError ? '<div class="error-message" role="alert">' + escapeHTML(state.searchError) + '</div>' : '') +
        '<div class="form-group"><label for="businessUnit">Business Unit</label><select id="businessUnit" class="field"' + (state.businessUnitsLoading ? ' disabled' : '') + '><option value="">' + unitPlaceholder + '</option>' + unitOptions + '</select></div>' +
        '<div class="form-group"><label for="opco">Operating Company</label><select id="opco" class="field"' + (!state.businessUnit || state.opcos.length === 0 ? ' disabled' : '') + '><option value="">-- Select Opco --</option>' + opcoOptions + '</select></div>' +
        '<button type="submit" class="primary-button"' + (state.searchLoading || !state.businessUnit || !state.opco ? ' disabled' : '') + '>' + (state.searchLoading ? 'Searching...' : 'Search') + '</button>' +
      '</form>' +
    '</div></section>';
  }

  function renderResults() {
    const query = state.invoiceSearch.trim().toLowerCase();
    const filtered = state.invoices.filter(function (invoice) {
      return String(invoice.invoiceNumber || '').toLowerCase().includes(query);
    });
    const totalPages = Math.ceil(filtered.length / RECORDS_PER_PAGE);
    state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages || 1));
    const start = (state.currentPage - 1) * RECORDS_PER_PAGE;
    const visibleInvoices = filtered.slice(start, start + RECORDS_PER_PAGE);
    const rows = visibleInvoices.map(function (invoice) {
      return '<tr><td class="invoice-cell"><button class="invoice-link" data-action="open-invoice" data-key="' + escapeHTML(invoice.invoiceKey) + '" title="View invoice details">' + escapeHTML(invoice.invoiceNumber) + '</button></td>' +
        '<td>' + escapeHTML(invoice.businessUnit) + '</td><td>' + escapeHTML(invoice.opco) + '</td><td>' + statusBadge(invoice.targetStatus) + '</td></tr>';
    }).join('');
    const suggestions = state.invoices.filter(function (invoice) {
      return String(invoice.invoiceNumber || '').toLowerCase().includes(query);
    }).map(function (invoice) {
      return '<option value="' + escapeHTML(invoice.invoiceNumber) + '"></option>';
    }).join('');

    return '<section class="page-shell results-view"><div class="page-container wide-container">' +
      '<header class="results-header"><button class="back-button" data-action="back-to-search">← Back to Search</button><div class="page-heading"><span class="eyebrow">INVOICE MANAGEMENT SYSTEM</span><h1>Invoice Results</h1><p class="results-count">Found ' + filtered.length + ' invoice(s)</p></div></header>' +
      '<div class="invoice-search"><label for="invoiceSearch">Search by invoice number</label><input id="invoiceSearch" class="field" type="search" value="' + escapeHTML(state.invoiceSearch) + '" placeholder="Enter invoice number" list="invoice-number-options"><datalist id="invoice-number-options">' + suggestions + '</datalist></div>' +
      (filtered.length === 0 ? '<div class="empty-state">Invoice does not exist</div>' :
        '<div class="table-wrapper"><table class="results-table"><thead><tr><th>Invoice Number</th><th>Business Unit</th><th>Operating Company</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        (totalPages > 1 ? '<nav class="pagination" aria-label="Invoice results pages"><button data-action="previous-page"' + (state.currentPage === 1 ? ' disabled' : '') + '>Previous</button><span>Page ' + state.currentPage + ' of ' + totalPages + '</span><button data-action="next-page"' + (state.currentPage === totalPages ? ' disabled' : '') + '>Next</button></nav>' : '')) +
      '</div></section>';
  }

  function renderStatusBar() {
    return '<section class="status-bar-container" aria-label="Sequence status"><div class="status-label">Sequence Status</div><div class="circles-container">' +
      SEQUENCES.map(function (sequence) {
        const status = state.missingRecords.charAt(sequence.id - 1);
        const kind = status === 'Y' ? 'healthy' : status === 'N' ? 'failed' : 'unknown';
        const selected = state.selectedSequence === sequence.id;
        const result = state.healthResults[sequence.id];
        return '<div class="circle-wrapper"><button type="button" class="status-circle ' + kind + (selected ? ' selected' : '') + '"' +
          (kind === 'failed' ? ' data-action="sequence-health" data-sequence="' + sequence.id + '" aria-expanded="' + selected + '"' : ' disabled') +
          ' title="Seq ' + sequence.id + ': ' + sequence.name + '" aria-label="Sequence ' + sequence.id + ': ' + (kind === 'healthy' ? 'healthy' : kind === 'failed' ? 'missing data' : 'unknown') + '">' +
          (kind === 'healthy' ? '✓' : kind === 'failed' ? '✕' : '?') + '</button><span class="seq-label">Seq ' + sequence.id + '</span>' +
          (kind === 'failed' && selected ? '<div class="tooltip"><strong>' + sequence.name + '</strong><span><b>Status:</b> Missing data detected</span><span><b>Health Check:</b> ' + escapeHTML(result || 'Checking...') + '</span><span><b>Action:</b> Check flow configuration and retry processing</span></div>' : '') +
        '</div>';
      }).join('') + '</div></section>';
  }

  function renderRecordsTable() {
    const records = state.records.slice().sort(function (a, b) {
      return new Date(a.transactionTimestamp).getTime() - new Date(b.transactionTimestamp).getTime();
    });
    if (records.length === 0) return '<div class="empty-state">No transaction records found for this invoice.</div>';
    const rows = records.map(function (record) {
      let timestamp = record.transactionTimestamp || '';
      const parsedDate = new Date(timestamp);
      if (timestamp && !Number.isNaN(parsedDate.getTime())) timestamp = parsedDate.toLocaleString();
      return '<tr><td class="sequence-number">' + escapeHTML(record.seqId) + '</td><td class="flow-name">' + escapeHTML(record.flowName) + '</td><td class="transaction-id">' + escapeHTML(record.transactionId) + '</td><td class="timestamp">' + escapeHTML(timestamp) + '</td><td>' + statusBadge(record.targetStatus) + '</td></tr>';
    }).join('');
    return '<div class="table-wrapper"><table class="records-table"><thead><tr><th>Sequence</th><th>Flow Name</th><th>Transaction ID</th><th>Timestamp</th><th>Status</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function renderDetail() {
    const invoice = state.selectedInvoice || {};
    let body = '<div class="loading-state" role="status">Loading invoice details...</div>';
    if (!state.detailLoading && state.detailError) {
      body = '<div class="error-message" role="alert">' + escapeHTML(state.detailError) + '</div>';
    } else if (!state.detailLoading) {
      body = (state.missingRecords ? renderStatusBar() : '') +
        '<section class="records-section"><h2>Transaction Records</h2>' + renderRecordsTable() + '</section>';
    }
    return '<section class="page-shell detail-view"><div class="page-container wide-container">' +
      '<button class="back-button" data-action="back-to-results">← Back to Results</button>' +
      '<header class="page-heading detail-heading"><span class="eyebrow">INVOICE MANAGEMENT SYSTEM</span><h1>Invoice Details</h1><p class="invoice-info"><strong>' + escapeHTML(invoice.invoiceNumber) + '</strong><span>BU: ' + escapeHTML(invoice.businessUnit) + '</span><span>Opco: ' + escapeHTML(invoice.opco) + '</span></p></header>' +
      body + '</div></section>';
  }

  function renderDatadog() {
    const now = Date.now();
    const dashboard = DASHBOARDS[state.selectedDashboardIndex] || DASHBOARDS[0];
    const dashboardUrl = new URL(dashboard.url);
    dashboardUrl.searchParams.set('from_ts', String(now - 24 * 60 * 60 * 1000));
    dashboardUrl.searchParams.set('to_ts', String(now));
    const choices = DASHBOARDS.map(function (item, index) {
      return '<button type="button" class="dashboard-choice' + (index === state.selectedDashboardIndex ? ' selected' : '') + '" data-action="select-dashboard" data-dashboard-index="' + index + '" aria-pressed="' + (index === state.selectedDashboardIndex) + '"><span class="dashboard-business-unit">' + escapeHTML(item.businessUnit) + '</span><span class="dashboard-link-name">' + escapeHTML(item.name) + '</span></button>';
    }).join('');
    return '<section class="page-shell datadog-page"><div class="page-container wide-container"><button class="back-button" data-action="home">← Back to Home</button><header class="feature-heading"><span class="feature-icon" aria-hidden="true">◌</span><div><span class="eyebrow">OBSERVABILITY</span><h1>Datadog Dashboards</h1><p>Choose a dashboard by business unit.</p></div></header><nav class="dashboard-choices" aria-label="Datadog dashboards by business unit">' + choices + '</nav><section class="dashboard-preview"><div><span class="dashboard-business-unit">' + escapeHTML(dashboard.businessUnit) + '</span><h2>' + escapeHTML(dashboard.name) + '</h2></div><a class="open-dashboard" href="' + escapeHTML(dashboardUrl.toString()) + '" target="_blank" rel="noopener noreferrer">Open in new tab <span aria-hidden="true">↗</span></a></section></div></section>';
  }

  function renderHealthCheck() {
    return '<section class="page-shell health-page"><div class="page-container medium-container"><button class="back-button" data-action="home">← Back to Home</button><main class="health-content"><span class="eyebrow">SERVICE STATUS</span><h1>Health Check</h1><p class="health-message">Health monitoring is not available yet.</p><div class="health-summary-grid"><div><strong>—</strong><span>Applications</span></div><div><strong>—</strong><span>Up and running</span></div><div><strong>—</strong><span>Healthy</span></div></div><p class="last-checked">Last checked: —</p></main></div></section>';
  }

  async function loadBusinessUnits() {
    state.businessUnitsLoading = true;
    state.searchError = '';
    render();
    try {
      const response = await fetch(API_BASE_URL + '/invoice/businessUnit');
      if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('API did not return a list/array');
      state.businessUnits = data;
    } catch (error) {
      state.searchError = error instanceof TypeError ? 'Unable to connect to the invoice service at ' + API_BASE_URL + '.' : error.message || 'Unable to load business units';
    } finally {
      state.businessUnitsLoading = false;
      if (state.view === 'invoiceSearch') render();
    }
  }

  async function loadOpcos(businessUnit) {
    const requestId = ++state.opcoRequest;
    state.businessUnit = businessUnit;
    state.opco = '';
    state.opcos = [];
    state.searchError = '';
    render();
    if (!businessUnit) return;
    try {
      const response = await fetch(API_BASE_URL + '/invoice/opco?businessUnit=' + encodeURIComponent(businessUnit));
      if (!response.ok) throw new Error('HTTP error! Status: ' + response.status);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('API did not return a list/array');
      if (requestId !== state.opcoRequest) return;
      state.opcos = data;
    } catch (error) {
      if (requestId !== state.opcoRequest) return;
      state.searchError = error.message || 'Unable to load OPCOs';
    }
    if (state.view === 'invoiceSearch') render();
  }

  async function searchInvoices() {
    if (!state.businessUnit || !state.opco || state.searchLoading) return;
    state.searchLoading = true;
    state.searchError = '';
    render();
    try {
      const url = API_BASE_URL + '/invoice?businessUnit=' + encodeURIComponent(state.businessUnit) + '&opco=' + encodeURIComponent(state.opco);
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'SUCCESS') {
        state.invoices = Array.isArray(data.records) ? data.records : [];
        state.invoiceSearch = '';
        state.currentPage = 1;
        state.view = 'results';
      } else {
        window.alert('No records found. Please try different filters.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      window.alert('Error connecting to the API. Make sure the server is running.');
    } finally {
      state.searchLoading = false;
      render();
    }
  }

  async function openInvoice(invoice) {
    state.selectedInvoice = invoice;
    state.view = 'detail';
    state.records = [];
    state.missingRecords = '';
    state.selectedSequence = null;
    state.healthResults = {};
    state.detailLoading = true;
    state.detailError = '';
    render();
    try {
      const invoiceKey = encodeURIComponent(invoice.invoiceKey);
      const responses = await Promise.all([
        fetch(API_BASE_URL + '/invoice/record?invoiceKey=' + invoiceKey),
        fetch(API_BASE_URL + '/invoice/missing?invoiceKey=' + invoiceKey)
      ]);
      const recordsData = await responses[0].json();
      const missingData = await responses[1].json();
      if (recordsData.status === 'SUCCESS' && Array.isArray(recordsData.records)) state.records = recordsData.records;
      if (missingData.missingRecords) state.missingRecords = missingData.missingRecords;
    } catch (error) {
      console.error('Error fetching detail data:', error);
      state.detailError = 'Failed to load invoice details. Please try again.';
    } finally {
      state.detailLoading = false;
      if (state.view === 'detail') render();
    }
  }

  async function checkSequenceHealth(sequenceId) {
    state.selectedSequence = state.selectedSequence === sequenceId ? null : sequenceId;
    render();
    if (state.selectedSequence !== sequenceId || state.healthResults[sequenceId]) return;
    try {
      const response = await fetch(API_BASE_URL + '/invoice/health?step=' + sequenceId);
      const result = await response.text();
      state.healthResults[sequenceId] = response.ok ? result : result || 'Service is unhealthy';
    } catch (error) {
      state.healthResults[sequenceId] = 'Health check failed';
    }
    if (state.view === 'detail' && state.selectedSequence === sequenceId) render();
  }

  app.addEventListener('click', function (event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'home') {
      state.view = 'home';
      render();
    } else if (action === 'open-search') {
      state.view = 'invoiceSearch';
      state.businessUnit = '';
      state.opco = '';
      state.opcos = [];
      state.searchError = '';
      state.businessUnitsLoading = true;
      render();
      loadBusinessUnits();
    } else if (action === 'open-datadog') {
      state.view = 'datadog';
      render();
    } else if (action === 'select-dashboard') {
      state.selectedDashboardIndex = Number(target.dataset.dashboardIndex);
      render();
    } else if (action === 'open-health') {
      state.view = 'healthCheck';
      render();
    } else if (action === 'back-to-search') {
      state.view = 'invoiceSearch';
      render();
    } else if (action === 'back-to-results') {
      state.view = 'results';
      render();
    } else if (action === 'open-invoice') {
      const invoice = state.invoices.find(function (item) { return String(item.invoiceKey) === target.dataset.key; });
      if (invoice) openInvoice(invoice);
    } else if (action === 'previous-page') {
      state.currentPage -= 1;
      render();
    } else if (action === 'next-page') {
      state.currentPage += 1;
      render();
    } else if (action === 'sequence-health') {
      checkSequenceHealth(Number(target.dataset.sequence));
    }
  });

  app.addEventListener('change', function (event) {
    if (event.target.id === 'businessUnit') {
      loadOpcos(event.target.value);
      return;
    }
    if (event.target.id === 'opco') {
      state.opco = event.target.value;
      render();
    }
  });

  app.addEventListener('input', function (event) {
    if (event.target.id !== 'invoiceSearch') return;
    const selectionStart = event.target.selectionStart;
    state.invoiceSearch = event.target.value;
    state.currentPage = 1;
    render();
    const searchInput = document.getElementById('invoiceSearch');
    searchInput.focus();
    searchInput.setSelectionRange(selectionStart, selectionStart);
  });

  app.addEventListener('submit', function (event) {
    if (event.target.id !== 'invoice-search-form') return;
    event.preventDefault();
    searchInvoices();
  });

  render();
}());