/* Content transcribed from Figma:
   187 Quality Collaboration SCC/SCPL — "QC- History" (node 3782-77289).
   Supplier screen: 3782:74663 · Buyer screen: 3782:77297 */

window.QC = window.QC || {};

QC.inspection = {
  title: 'Quality Inspection #1 for Synthetic Rubber - PO #5001 / 0001',
  summary: {
    inspectionId: '001',
    requestDate: '05/01/25',
    documentReference: 'PO:EXTPO123/001',
    dueDate: '06/15/25',
    resolutionReason: '',
    itemName: 'Synthetic Rubber',
    itemDescription: 'A polymer that can stretch and return to its original shape',
    supplier: 'Material Supply Industries',
    buyerPartNumber: '0782',
    /* Third row, revealed by "Show more" — Figma 518:29199. */
    supplierPartNumber: 'S-231',
    sampleSize: '5 each',
    buyerBatchNumber: 'A-31'
  }
};

/* Attachments Library — Figma "Attachment Library" section (node 758:125789).
   `kind` picks the doc-type icon, `actions` mirrors which row actions the design
   shows for that kind (images have no delete, URLs have no download).
   The "Attachments: 6 Files | 1 URL" line is counted from these two lists. */
QC.attachments = {
  header: [
    {
      id: 'h1',
      kind: 'word',
      name: 'Statement of Work.doc',
      actions: ['download', 'trash'],
      preview: {
        type: 'doc',
        blocks: [
          { type: 'title', text: 'Statement of Work (SOW)' },
          { type: 'meta', text: 'Project: ProjectX' },
          { type: 'meta', text: 'Parties: Acme Supply and Buyer Enterprise' },
          { type: 'h', text: '1. Introduction' },
          {
            type: 'p',
            text:
              'This Statement of Work (SOW) outlines the scope, objectives, deliverables, and ' +
              'timeline for ProjectX, a strategic initiative jointly executed by Microsoft and ' +
              'Coupa. The purpose of this engagement is to enhance procurement efficiency, improve ' +
              'financial visibility, and drive digital transformation across Microsoft’s enterprise ' +
              'spend operations.'
          },
          { type: 'h', text: '2. Project Scope' },
          {
            type: 'p',
            text:
              'ProjectX will include the design, configuration, and implementation of Coupa’s ' +
              'Business Spend Management (BSM) platform within Microsoft’s global procurement ' +
              'infrastructure. The scope encompasses:'
          },
          {
            type: 'ul',
            items: [
              'Spend analysis and categorization',
              'Supplier onboarding and risk management',
              'Contract lifecycle management integration',
              'Workflow automation for procurement approvals',
              'Seamless integration with Microsoft ERP systems'
            ]
          },
          {
            type: 'p',
            text: 'The project will be delivered in phased rollouts by business unit and region.'
          },
          { type: 'h', text: '3. Objectives' },
          { type: 'p', text: 'The primary goals of ProjectX include:' },
          {
            type: 'ul',
            items: [
              'Streamlining Microsoft’s end-to-end procurement lifecycle',
              'Increasing compliance and reducing maverick spend',
              'Enabling real-time budget and spend visibility',
              'Reducing manual processes and administrative overhead',
              'Improving supplier collaboration and performance'
            ]
          },
          { type: 'h', text: '4. Deliverables' },
          { type: 'p', text: 'Coupa will deliver the following as part of the engagement:' },
          {
            type: 'ul',
            items: [
              'A configured Coupa BSM platform tailored to Microsoft’s operational needs',
              'User training modules and documentation',
              'Integration connectors for Microsoft Dynamics and Azure-based analytics',
              'Change management support and go-live assistance',
              'Post-launch hypercare and ongoing technical support'
            ]
          },
          {
            type: 'p',
            text:
              'All deliverables will be reviewed and approved according to the defined ' +
              'governance model.'
          },
          { type: 'h', text: '5. Timeline' },
          {
            type: 'p',
            text:
              'The total project duration is expected to be 9 months, beginning on June 1, 2025, ' +
              'with major milestones as follows:'
          },
          {
            type: 'ul',
            items: [
              'Phase 1: Requirements Gathering & Design – June to July 2025',
              'Phase 2: Configuration & Integration – August to October 2025',
              'Phase 3: UAT, Training & Deployment – November to December 2025',
              'Go-Live & Hypercare – January 2026'
            ]
          },
          {
            type: 'p',
            text:
              'Project adjustments will follow the formal change control process jointly agreed ' +
              'upon by both parties.'
          },
          { type: 'h', text: '6. Assumptions & Dependencies' },
          {
            type: 'p',
            text:
              'Key assumptions include executive sponsorship from both sides, dedicated internal ' +
              'project resources, and timely access to Microsoft’s infrastructure. Dependencies ' +
              'include third-party system readiness and legal approvals for vendor agreements.'
          },
          { type: 'h', text: '7. Acceptance' },
          {
            type: 'p',
            text:
              'This SOW will be considered approved upon formal sign-off by both Microsoft and ' +
              'Coupa project leads and will serve as the guiding document for delivery and ' +
              'performance measurement.'
          }
        ]
      }
    },
    { id: 'h2', kind: 'pdf', name: 'Checklist-items.pdf', actions: ['download', 'trash'] }
  ],
  line: [
    {
      id: 'l1',
      line: 1,
      kind: 'pdf',
      name: 'Item-inspection-01.pdf',
      actions: ['download', 'trash'],
      preview: {
        type: 'image',
        src: 'assets/img/item-inspection-01.png',
        alt: 'Conclusions: results table for the rubber compound test report'
      }
    },
    { id: 'l2', line: 2, kind: 'word', name: 'Checklist-items.doc', actions: ['download', 'trash'] },
    { id: 'l3', line: 3, kind: 'image', name: 'ImageUploaded(3).jpeg', actions: ['download'] },
    { id: 'l4', line: 4, kind: 'image', name: 'ImageUploaded(4).jpeg', actions: ['download'] },
    {
      id: 'l5',
      line: 7,
      kind: 'url',
      name: 'www.acmesupply.com',
      url: 'https://www.acmesupply.com',
      actions: ['trash']
    }
  ]
};

/* One row per characteristic. `resultTone` drives the pill styling seen in the
   Figma (row 3 amber, row 5 red outline). */
QC.characteristics = [
  {
    id: 1,
    characteristic: 'Visual check, thickness, length',
    specification:
      'Standard Flat Face Flanges: 3.2 mm gasket thickness ±0.2 mm; free from surface defects, cracks or blisters',
    range: '',
    result: 'No defects',
    resultTone: '',
    expectedResult: 'Free from surface defect',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: '5 samples measured, no flash',
    attachment: 'File_name.doc',
    hasNewComment: true
  },
  {
    id: 2,
    characteristic: 'Hardness',
    specification: '70 ± 10 IRHD, acceptable range 60 - 80, per ASTM D1415',
    range: '60-80',
    result: '78 IRHD',
    resultTone: '',
    expectedResult: '70 ± 10 IRHD',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Avg of 5 readings, 5 s dwell',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 3,
    characteristic: 'Compression set',
    specification:
      '60% expected, must stay below 85% after 22 h at 70 °C, per ASTM D395 Method B',
    range: '<85%',
    result: '55%',
    resultTone: 'warning',
    expectedResult: '60%',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Re-tested; read after 30 min',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 4,
    characteristic: 'Side Flow under compression',
    specification: 'No lateral flow or extrusion at 1.5× rated bolt load (34.5 MPa)',
    range: '',
    result: 'None',
    resultTone: '',
    expectedResult: 'N/A',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'No extrusion at 1.5× bolt load',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 5,
    characteristic: 'Tensile strength',
    specification: 'Min 1,550 kPa across grain, per ASTM F152',
    range: '',
    result: '2,080 kPa',
    resultTone: 'error',
    expectedResult: '1,550 kPa (min)',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Across grain, lowest of 3',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 6,
    characteristic: 'Flexibility',
    specification: 'No cracking when bent 180° over a 3.2 mm mandrel, per ASTM F147',
    range: '',
    result: 'No cracking',
    resultTone: '',
    expectedResult: 'No cracking on 180° bend',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: '180° bend, no cracking seen',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 7,
    characteristic: 'Compressibility',
    specification: '25 - 35% at 6.9 MPa preload, per ASTM F36 Method J',
    range: '',
    result: '28%',
    resultTone: '',
    expectedResult: '25-35%',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Measured at 6.9 MPa preload',
    attachment: 'File_name.doc',
    hasNewComment: false
  },
  {
    id: 8,
    characteristic: 'Recovery',
    specification: 'Min 80% of original thickness, per ASTM F36 Method J',
    range: '>80%',
    result: '92%',
    resultTone: '',
    expectedResult: '80% min',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Measured 1 min after unload',
    attachment: 'File_name.doc',
    hasNewComment: false
  }
];

/* History entries. `actor` maps to the filter chips (all / buyer / supplier / system).
   `sortKey` is a comparable stamp used by the Sort By control.
   Entries flagged `timestampInferred` show a time that is not present in the
   Figma frame — see README. */
QC.history = [
  {
    actor: 'buyer',
    name: 'Prasad T.',
    initials: 'PT',
    action: 'Requested ',
    link: 'Quality Inspection: 001 (PO #5001 / 0001)',
    lines: [
      'Item: Synthetic Rubber',
      'Characteristics requested: 8',
      'Due Date: 06/15/2025',
      'Reason: New material qualification'
    ],
    timestamp: 'May 01 - 9:12 AM',
    sortKey: '2025-05-01T09:12'
  },
  {
    actor: 'buyer',
    name: 'Prasad T.',
    initials: 'PT',
    action: 'Updated Specification on ',
    link: 'Characteristic: 2 (Hardness)',
    lines: [
      'Item: Synthetic Rubber',
      'Specification: 70 ± 10 IRHD (range 60 - 80)',
      'Reason: Aligned to drawing rev. B'
    ],
    timestamp: 'May 20 - 2:40 PM',
    sortKey: '2025-05-20T14:40'
  },
  {
    actor: 'supplier',
    name: 'Steven Neilson',
    initials: 'SN',
    action: 'Recorded Results on ',
    link: 'Characteristics: 1 - 4',
    lines: [
      'Item: Synthetic Rubber',
      'Inspected By: Steven Neilson',
      'Inspection Date: 06/10/2025'
    ],
    timestamp: 'Jun 10 - 8:05 AM',
    sortKey: '2025-06-10T08:05'
  },
  {
    actor: 'supplier',
    name: 'Steven Neilson',
    initials: 'SN',
    action: 'Recorded Results on ',
    link: 'Characteristics: 5 - 8',
    lines: [
      'Item: Synthetic Rubber',
      'Inspected By: Steven Neilson',
      'Inspection Date: 06/10/2025'
    ],
    timestamp: 'Jun 10 - 10:32 AM',
    sortKey: '2025-06-10T10:32'
  },
  {
    actor: 'supplier',
    name: 'Steven Neilson',
    initials: 'SN',
    action: 'Revised Result on ',
    link: 'Characteristic: 3 (Compression set)',
    lines: [
      'Previous Result: 62%',
      'Revised Result: 55%',
      'Reason: Re-tested per ASTM D395 Method B'
    ],
    timestamp: 'Jun 10 - 11:05 AM',
    sortKey: '2025-06-10T11:05'
  },
  {
    actor: 'system',
    name: 'ERP Sync',
    initials: 'ES',
    action: 'Synced inspection results after test completion',
    link: '',
    lines: [
      'Characteristic 1 (Visual check, thickness, length)',
      'Characteristic 2 (Hardness)',
      'Characteristic 3 (Compression set)'
    ],
    timestamp: 'Jun 10 - 12:10 PM',
    sortKey: '2025-06-10T12:10',
    timestampInferred: true
  },
  {
    actor: 'supplier',
    name: 'Niles Parker',
    initials: 'NP',
    action: 'Added Attachments to ',
    link: 'Quality Inspection: 001',
    lines: ['Item: Synthetic Rubber', 'Files: 8', 'URL: 1'],
    timestamp: 'Jun 10 - 1:15 PM',
    sortKey: '2025-06-10T13:15'
  },
  {
    actor: 'supplier',
    name: 'Steven Neilson',
    initials: 'SN',
    action: 'Added a comment: ',
    link: '',
    lines: [
      ' @Prasad T. All 8 characteristics have been inspected against the specifications on PO #5001 / 0001. Compression set was re-tested per ASTM D395 Method B and now reads 55%, within the 85% limit. Test reports and the durometer calibration certificate are attached. Please let me know if any additional data is needed before approval.'
    ],
    timestamp: 'Jun 10 - 1:20 PM',
    sortKey: '2025-06-10T13:20',
    timestampInferred: true
  },
  {
    actor: 'system',
    name: 'ERP Sync',
    initials: 'ES',
    action: 'Added a comment; Added comment attachment URL',
    link: '',
    lines: [
      'Added a comment',
      'Added comment attachment URL https://master-proc.coupadev.com/quality_inspections/001/edit',
      'Added comment attachment file QI-001-Test_Report-061025-080512.pdf',
      'Deleted a comment',
      'Removed comment attachment URL https://master-proc.coupadev.com/quality_inspections/001/edit'
    ],
    timestamp: 'Jun 10 - 3:00 PM',
    sortKey: '2025-06-10T15:00',
    timestampInferred: true
  },
  {
    actor: 'system',
    name: 'ERP Sync',
    initials: 'ES',
    action: 'Failed to sync result for ',
    link: 'Characteristic: 4 (Side flow under compression)',
    lines: ['Item: Synthetic Rubber', 'Error: External system validation failed'],
    timestamp: 'Jun 11 - 9:02 AM',
    sortKey: '2025-06-11T09:02'
  },
  {
    actor: 'buyer',
    name: 'Prasad T.',
    initials: 'PT',
    action: 'Added a comment: ',
    link: '',
    lines: [
      ' @Steven Neilson Thanks for submitting the results for PO #5001 / 0001. Compression set at 55% and tensile strength at 2,080 kPa are both within the agreed limits, so those look fine. Before I accept, please confirm the visual check on characteristic 1 was performed on all five samples and attach the surface finish photos.'
    ],
    timestamp: 'Jun 11 - 10:15 AM',
    sortKey: '2025-06-11T10:15',
    timestampInferred: true
  }
];
