/* Layout and component behaviour transcribed from Figma:
   187 Quality Collaboration SCC/SCPL — "QC- History" (node 3782-77289).
   Supplier screen: 3782:74663 · Buyer screen: 3782:77297

   The example content is an aftermarket performance muffler (Performance Muffler
   XR-3, buyer part EX-4471) rather than the Figma file's "Synthetic Rubber"
   sample. Row-by-row shape is preserved — same 8 characteristics, same blank
   Range cells, same amber row 3 / red row 5, same two attachment levels and
   `kind` mix — so the screens still match the design. The library holds more
   files than the design itemises, because each characteristic now carries its
   own evidence. */

window.QC = window.QC || {};

QC.inspection = {
  title: 'Quality Inspection #1 for Performance Muffler XR-3 - PO #5001 / 0001',
  summary: {
    inspectionId: '001',
    requestDate: '05/01/25',
    documentReference: 'PO:EXTPO123/001',
    dueDate: '06/15/25',
    resolutionReason: '',
    itemName: 'Performance Muffler XR-3',
    itemDescription: 'Straight-through aftermarket muffler, 409 stainless, 3 in inlet/outlet',
    supplier: 'Apex Exhaust Systems',
    buyerPartNumber: 'EX-4471',
    /* Third row, revealed by "Show more" — Figma 518:29199. */
    supplierPartNumber: 'XR3-300SS',
    sampleSize: '5 each',
    buyerBatchNumber: 'B-2214'
  }
};

/* Attachments Library — Figma "Attachment Library" section (node 758:125789).
   `kind` picks the doc-type icon, `actions` mirrors which row actions the design
   shows for that kind (images have no delete, URLs have no download).
   The "Attachments: 12 Files | 1 URL" line is counted from these two lists.

   Header level holds the documents that govern the whole inspection; line level
   holds the evidence for one characteristic each, with `line` set to that
   characteristic's ID. That `line` value is the only link: the table's
   Attachments column filters this list by row, so the two cannot drift. */
QC.attachments = {
  header: [
    {
      id: 'h1',
      kind: 'word',
      name: 'XR-3 Muffler Program SOW.doc',
      actions: ['download', 'trash'],
      preview: {
        type: 'doc',
        blocks: [
          { type: 'title', text: 'Statement of Work (SOW)' },
          { type: 'meta', text: 'Program: XR-3 Performance Muffler (part EX-4471)' },
          { type: 'meta', text: 'Parties: Apex Exhaust Systems and Buyer Enterprises' },
          { type: 'h', text: '1. Introduction' },
          {
            type: 'p',
            text:
              'This Statement of Work (SOW) outlines the scope, deliverables, and inspection ' +
              'requirements for the XR-3 Performance Muffler program, jointly executed by Apex ' +
              'Exhaust Systems and Buyer Enterprises. The purpose of this engagement is to qualify ' +
              'and supply the XR-3 straight-through performance muffler into the aftermarket ' +
              'channel at a consistent sound signature and flow rating.'
          },
          { type: 'h', text: '2. Project Scope' },
          {
            type: 'p',
            text:
              'The program covers the forming, welding, packing, finishing and testing of XR-3 ' +
              'muffler assemblies at the Apex Monterrey plant. The scope encompasses:'
          },
          {
            type: 'ul',
            items: [
              'Shell forming and TIG welding of 409 stainless assemblies',
              'Perforated core fabrication and fiberglass packing to 96 kg/m³',
              'Flow bench and back pressure verification per SAE J1492',
              'Sound level and insertion loss testing per SAE J1169 / J1400',
              'Salt spray validation of shell and weld corrosion resistance'
            ]
          },
          {
            type: 'p',
            text: 'Production will ramp in phased lots by shell diameter and inlet configuration.'
          },
          { type: 'h', text: '3. Objectives' },
          { type: 'p', text: 'The primary goals of the XR-3 program include:' },
          {
            type: 'ul',
            items: [
              'Holding tailpipe sound level within 88 - 95 dB(A) across the model range',
              'Keeping back pressure below 2.0 psi at 500 CFM',
              'Achieving 240 h salt spray with no red rust on shell or welds',
              'Reducing weld rework and scrap on the inlet and outlet seams',
              'Establishing first article and lot inspection records in Coupa'
            ]
          },
          { type: 'h', text: '4. Deliverables' },
          { type: 'p', text: 'Apex will deliver the following as part of the engagement:' },
          {
            type: 'ul',
            items: [
              'First article inspection report for EX-4471 covering all 8 characteristics',
              'Flow bench and back pressure data sheets for each production lot',
              'Sound level and insertion loss reports per SAE J1169 / J1400',
              'Material certificates for the 409 stainless coil and packing material',
              'Weld operator certifications and dye-penetrant records'
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
              'The total program duration is expected to be 9 months, beginning on June 1, 2025, ' +
              'with major milestones as follows:'
          },
          {
            type: 'ul',
            items: [
              'Phase 1: Tooling & First Article – June to July 2025',
              'Phase 2: Pilot Lot & Sound Validation – August to October 2025',
              'Phase 3: PPAP, Packaging & Launch Readiness – November to December 2025',
              'Production Ramp & Warranty Monitoring – January 2026'
            ]
          },
          {
            type: 'p',
            text:
              'Program adjustments will follow the formal change control process jointly agreed ' +
              'upon by both parties.'
          },
          { type: 'h', text: '6. Assumptions & Dependencies' },
          {
            type: 'p',
            text:
              'Key assumptions include coil supply from the approved 409 stainless mill, access to ' +
              'a certified acoustic test cell, and dyno availability for drive-by verification. ' +
              'Dependencies include packing material lead times and emissions documentation for ' +
              'the applicable model years.'
          },
          { type: 'h', text: '7. Acceptance' },
          {
            type: 'p',
            text:
              'This SOW will be considered approved upon formal sign-off by both Apex Exhaust ' +
              'Systems and Buyer Enterprises quality leads and will serve as the guiding document ' +
              'for lot inspection and performance measurement.'
          }
        ]
      }
    },
    {
      id: 'h2',
      kind: 'pdf',
      name: 'Inspection-plan-EX-4471.pdf',
      actions: ['download', 'trash'],
      preview: {
        type: 'doc',
        blocks: [
          { type: 'title', text: 'Inspection and Test Plan' },
          { type: 'meta', text: 'Part: EX-4471 (Performance Muffler XR-3), drawing rev. C' },
          { type: 'meta', text: 'Lot / Batch: B-2214 · Sample size: 5 each · Issued 05/01/2025' },
          { type: 'h', text: 'Scope' },
          {
            type: 'p',
            text:
              'Every production lot of EX-4471 is inspected against the eight characteristics below ' +
              'before shipment. Five units are drawn at random from each lot. A single ' +
              'non-conforming characteristic holds the whole lot.'
          },
          { type: 'h', text: 'Characteristics and Acceptance Criteria' },
          {
            type: 'ul',
            items: [
              '1. Visual and weld inspection — continuous TIG seams, no burn-through, porosity or spatter; dye penetrant on inlet and outlet seams',
              '2. Shell wall thickness — 1.20 mm ± 0.10 mm, 409 stainless per ASTM A240; ultrasonic gauge, 4 points per unit',
              '3. Body length and inlet/outlet OD — 356 mm ± 2 mm; 76.2 mm OD +0 / -0.4 mm; CMM in a 20 ± 1 °C room',
              '4. Back pressure — max 2.0 psi at 500 CFM on the flow bench, per SAE J1492',
              '5. Tailpipe sound level — 88 - 95 dB(A) at 0.5 m, 45°, 3,000 rpm, per SAE J1169',
              '6. Insertion loss — min 18 dB(A) over a 500 - 4,000 Hz sweep, per SAE J1400',
              '7. Leak test — no leakage at 34.5 kPa (5 psi) air, 60 s submersion',
              '8. Salt spray corrosion resistance — no red rust on shell or welds after 240 h, per ASTM B117'
            ]
          },
          { type: 'h', text: 'Records' },
          {
            type: 'p',
            text:
              'One report per characteristic is attached at line level in Coupa, named for the ' +
              'characteristic it covers. Photographs are required for characteristic 1, one per unit ' +
              'inspected. Reports must carry the operator, the equipment serial number and its ' +
              'calibration due date.'
          },
          { type: 'h', text: 'Non-conformance Handling' },
          {
            type: 'p',
            text:
              'A failing characteristic is recorded with the measured value, not marked as a pass ' +
              'with a note. The buyer decides between rework, re-test and rejection; results may ' +
              'only be revised when a measurement error is identified, and the revision must state ' +
              'the cause.'
          }
        ]
      }
    },
    {
      id: 'h3',
      kind: 'pdf',
      name: 'Mill-cert-409-coil.pdf',
      actions: ['download', 'trash']
    }
  ],
  /* One evidence file per characteristic — `line` is the characteristic ID. */
  line: [
    {
      id: 'l1',
      line: 1,
      kind: 'pdf',
      name: 'Weld-visual-C1.pdf',
      actions: ['download', 'trash']
    },
    { id: 'l2', line: 1, kind: 'image', name: 'Weld-seam-unit1.jpeg', actions: ['download'] },
    {
      id: 'l3',
      line: 2,
      kind: 'pdf',
      name: 'Wall-thickness-C2.pdf',
      actions: ['download', 'trash']
    },
    {
      id: 'l4',
      line: 3,
      kind: 'pdf',
      name: 'CMM-dimensional-C3.pdf',
      actions: ['download', 'trash'],
      preview: {
        type: 'image',
        src: 'assets/img/cmm-dimensional-report-c3.png',
        alt:
          'CMM dimensional inspection report, rev. 1: body length and tube OD for 5 units, ' +
          'lot maximum 357.4 mm, with the fixture datum revision note'
      }
    },
    {
      id: 'l5',
      line: 4,
      kind: 'pdf',
      name: 'Back-pressure-C4.pdf',
      actions: ['download', 'trash']
    },
    {
      id: 'l6',
      line: 5,
      kind: 'pdf',
      name: 'Sound-level-J1169-C5.pdf',
      actions: ['download', 'trash'],
      preview: {
        type: 'image',
        src: 'assets/img/sound-level-report-c5.png',
        alt:
          'Tailpipe sound level test report per SAE J1169: 5 units over 3 runs, 2 units failing ' +
          'the 95 dB(A) limit at 97.1 and 96.8 dB(A)'
      }
    },
    {
      id: 'l7',
      line: 5,
      kind: 'url',
      name: 'acoustic-lab-mx.com/C5-cert',
      url: 'https://www.acoustic-lab-mx.com/cert/QI-001-C5',
      actions: ['trash']
    },
    {
      id: 'l8',
      line: 6,
      kind: 'pdf',
      name: 'Insertion-loss-J1400-C6.pdf',
      actions: ['download', 'trash']
    },
    { id: 'l9', line: 7, kind: 'pdf', name: 'Leak-test-C7.pdf', actions: ['download', 'trash'] },
    {
      id: 'l10',
      line: 8,
      kind: 'pdf',
      name: 'Salt-spray-B117-C8.pdf',
      actions: ['download', 'trash']
    }
  ]
};

/* One row per characteristic. `resultTone` drives the pill styling seen in the
   Figma (row 3 amber — length trending to the upper limit, row 5 red outline —
   tailpipe sound level above the 95 dB(A) ceiling). */
QC.characteristics = [
  {
    id: 1,
    characteristic: 'Visual and weld inspection',
    specification:
      'Continuous TIG seams on shell, inlet and outlet; no burn-through, porosity or spatter; no dents or scratches deeper than 0.2 mm',
    range: '',
    result: 'No defects',
    resultTone: '',
    expectedResult: 'Free from weld and surface defects',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: '5 units checked, seams dye-penetrant tested',
    hasNewComment: true
  },
  {
    id: 2,
    characteristic: 'Shell wall thickness',
    specification: '1.20 mm ± 0.10 mm, 409 stainless per ASTM A240',
    range: '1.10-1.30',
    result: '1.24 mm',
    resultTone: '',
    expectedResult: '1.20 mm ± 0.10 mm',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Ultrasonic gauge, 4 points per unit',
    hasNewComment: false
  },
  {
    id: 3,
    characteristic: 'Body length and inlet/outlet OD',
    specification:
      'Body 356 mm ± 2 mm; inlet and outlet 76.2 mm OD +0 / -0.4 mm, per drawing EX-4471 rev. C',
    range: '354-358',
    result: '357.4 mm',
    resultTone: 'warning',
    expectedResult: '356 mm ± 2 mm',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Re-measured on CMM; trending to upper limit',
    hasNewComment: false
  },
  {
    id: 4,
    characteristic: 'Back pressure',
    specification: 'Max 2.0 psi at 500 CFM on flow bench, per SAE J1492',
    range: '',
    result: '1.6 psi',
    resultTone: '',
    expectedResult: '2.0 psi (max)',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Flow bench at 500 CFM, ambient 22 °C',
    hasNewComment: false
  },
  {
    id: 5,
    characteristic: 'Tailpipe sound level',
    specification: '88 - 95 dB(A) at 0.5 m, 45°, 3,000 rpm, per SAE J1169',
    range: '',
    result: '97 dB(A)',
    resultTone: 'error',
    expectedResult: '88 - 95 dB(A)',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: '2 of 5 units above limit; packing density suspect',
    hasNewComment: false
  },
  {
    id: 6,
    characteristic: 'Insertion loss',
    specification: 'Min 18 dB(A) insertion loss over a 500 - 4,000 Hz sweep, per SAE J1400',
    range: '',
    result: '21 dB(A)',
    resultTone: '',
    expectedResult: '18 dB(A) min',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Averaged over 1/3-octave bands',
    hasNewComment: false
  },
  {
    id: 7,
    characteristic: 'Leak test',
    specification: 'No leakage at 34.5 kPa (5 psi) air, 60 s submersion',
    range: '',
    result: 'No leaks',
    resultTone: '',
    expectedResult: 'No leakage at 5 psi',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'All 5 units submerged for 60 s',
    hasNewComment: false
  },
  {
    id: 8,
    characteristic: 'Salt spray corrosion resistance',
    specification: 'No red rust on shell or welds after 240 h neutral salt spray, per ASTM B117',
    range: '>240 h',
    result: '336 h',
    resultTone: '',
    expectedResult: '240 h min',
    inspectedBy: 'Steven Neilson',
    inspectionDate: '06/10/2025',
    remarks: 'Witness coupons from the same coil',
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
      'Item: Performance Muffler XR-3',
      'Characteristics requested: 8',
      'Due Date: 06/15/2025',
      'Reason: First article inspection, new SKU'
    ],
    timestamp: 'May 01 - 9:12 AM',
    sortKey: '2025-05-01T09:12'
  },
  {
    actor: 'buyer',
    name: 'Prasad T.',
    initials: 'PT',
    action: 'Updated Specification on ',
    link: 'Characteristic: 2 (Shell wall thickness)',
    lines: [
      'Item: Performance Muffler XR-3',
      'Specification: 1.20 mm ± 0.10 mm (range 1.10 - 1.30)',
      'Reason: Aligned to drawing EX-4471 rev. C'
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
      'Item: Performance Muffler XR-3',
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
      'Item: Performance Muffler XR-3',
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
    link: 'Characteristic: 3 (Body length and inlet/outlet OD)',
    lines: [
      'Previous Result: 359.1 mm',
      'Revised Result: 357.4 mm',
      'Reason: Re-fixtured and re-measured on the CMM'
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
      'Characteristic 1 (Visual and weld inspection)',
      'Characteristic 2 (Shell wall thickness)',
      'Characteristic 3 (Body length and inlet/outlet OD)'
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
    lines: ['Item: Performance Muffler XR-3', 'Files: 12', 'URL: 1'],
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
      ' @Prasad T. All 8 characteristics have been inspected against the specifications on PO #5001 / 0001. Back pressure came in at 1.6 psi and insertion loss at 21 dB(A), both comfortably inside spec. Characteristic 5 is the exception: 2 of the 5 units measured 97 dB(A) at the tailpipe against the 95 dB(A) ceiling, and we believe the packing density on that lot is low. Sound test logs, the flow bench data and the CMM report are attached. Advise whether you want the lot re-packed and re-tested before approval.'
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
      'Added comment attachment file QI-001-Sound_Test-061025-080512.pdf',
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
    link: 'Characteristic: 4 (Back pressure)',
    lines: ['Item: Performance Muffler XR-3', 'Error: External system validation failed'],
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
      ' @Steven Neilson Thanks for submitting the results for PO #5001 / 0001. Back pressure at 1.6 psi and salt spray at 336 h both look good. The 97 dB(A) reading on characteristic 5 is a hard fail for this SKU, so please re-pack those units to 96 kg/m³ and re-test per SAE J1169. The plan also calls for a weld seam photo of every unit inspected and only XR3-0412 is attached, so please add the remaining four.'
    ],
    timestamp: 'Jun 11 - 10:15 AM',
    sortKey: '2025-06-11T10:15',
    timestampInferred: true
  }
];
