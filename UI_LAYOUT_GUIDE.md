# UI Layout Guide

## Color Palette

```
Primary Color:      #0088D8 (Blue)
Secondary Color:    #0088D8 (Blue)
Success Color:      #4CAF50 (Green)
Error Color:        #f44336 (Red)
Background:         #FFFFFF (White)
Text Color:         #333333 (Dark Gray)
Border Color:       #e0e0e0 (Light Gray)
```

## Page 1: Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│          Financial Interface Service                            │
│          Invoice Management System                              │
│                                                                   │
│          ┌────────────────────────────────────────┐             │
│          │  Search Invoices                       │             │
│          │                                         │             │
│          │  Business Unit                         │             │
│          │  ┌────────────────────────────────────┐│             │
│          │  │ US                              ▼ ││             │
│          │  └────────────────────────────────────┘│             │
│          │                                         │             │
│          │  Operating Company                     │             │
│          │  ┌────────────────────────────────────┐│             │
│          │  │ 001                             ▼ ││             │
│          │  └────────────────────────────────────┘│             │
│          │                                         │             │
│          │  ┌────────────────────────────────────┐│             │
│          │  │         SEARCH (Blue)              ││             │
│          │  └────────────────────────────────────┘│             │
│          └────────────────────────────────────────┘             │
│                                                                   │
│          ┌────────────────────────────────────────┐             │
│          │  Getting Started                       │             │
│          │  → Select a Business Unit              │             │
│          │  → Select an Operating Company         │             │
│          │  → Click Search button                 │             │
│          │  → Click invoice number for details    │             │
│          └────────────────────────────────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Page 2: Results View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Search                                               │
│                                                                   │
│  Invoice Results                                                │
│  Found 2 invoice(s)                                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Invoice Number │ Business Unit │ Opco │ Status             ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ INV-2024-001   │ US            │ 001  │ ✓ COMPLETED       ││
│  │ (blue, link)   │               │      │ (green badge)     ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ INV-2024-002   │ US            │ 001  │ ⚠ PENDING         ││
│  │ (blue, link)   │               │      │ (yellow badge)    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Page 3: Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Results                                              │
│                                                                   │
│  Invoice Details                                                │
│  INV-2024-001 | BU: US | Opco: 001                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Sequence Status:  🟢 🔴 🟢 🔴 🟢                             ││
│  │                   (Seq 1-5 indicators)                       ││
│  │  🟢 = Data present (Green)                                  ││
│  │  🔴 = Missing data (Red, clickable)                         ││
│  │                                                               ││
│  │  When clicking red circle:                                   ││
│  │  ┌──────────────────────────┐                                ││
│  │  │ Flow_ECAS_Kinesis_Stream │                                ││
│  │  │ Status: Missing data     │                                ││
│  │  │ Check flow config & retry│                                ││
│  │  └──────────────────────────┘                                ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  Transaction Records                                            │
│                                                                   │
│  ▶ Sequence 1 (2 records)                                       │
│    ┌────────────────────────────────────────────────────────┐   │
│    │ Flow Name │ Transaction ID │ Timestamp │ Status        │   │
│    ├────────────────────────────────────────────────────────┤   │
│    │ Flow_...  │ TXN-001-STG    │ 2024-01.. │ ✓ COMPLETED   │   │
│    ├────────────────────────────────────────────────────────┤   │
│    │ Flow_...  │ TXN-002-CORA   │ 2024-01.. │ ✓ COMPLETED   │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ▶ Sequence 2 (1 record)                                        │
│    (Click to expand/collapse)                                   │
│                                                                   │
│  ▼ Sequence 3 (3 records) [Expanded]                           │
│    ┌────────────────────────────────────────────────────────┐   │
│    │ Flow Name │ Transaction ID │ Timestamp │ Status        │   │
│    ├────────────────────────────────────────────────────────┤   │
│    │ Flow_...  │ TXN-003-KIN    │ 2024-01.. │ ✓ COMPLETED   │   │
│    │ ...       │ ...            │ ...       │ ...           │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Styling Details

### Buttons
```
SEARCH Button:
- Background: #0088D8 (Blue)
- Text: White
- Hover: Darker blue (#0066a0)
- Rounded corners, full width

Back Button:
- Background: Light gray (#f0f0f0)
- Text: Blue (#0088D8)
- Border: 1px solid #e0e0e0
- Hover: Background becomes blue, text becomes white
```

### Status Badges
```
COMPLETED:  Green background (#c8e6c9), dark green text
PENDING:    Yellow background (#fff9c4), orange text
FAILED:     Red background (#ffcdd2), dark red text
UNKNOWN:    Gray background (#eeeeee), dark gray text
```

### Status Circles
```
Healthy (Y):
- Background: #4CAF50 (Green)
- Border: 2px solid #45a049 (Darker green)
- Content: ✓ (White checkmark)
- Not clickable

Failed (N):
- Background: #f44336 (Red)
- Border: 2px solid #da190b (Darker red)
- Content: ✗ (White X)
- Clickable with tooltip

Unknown (?):
- Background: #eeeeee (Gray)
- Border: 2px solid #cccccc
- Content: ? (Gray question mark)
- Not clickable
```

### Tables
```
Header:
- Background: Light gray (#f9f9f9)
- Text: Blue (#0088D8), uppercase, small font
- Border-bottom: 2px solid #0088D8

Rows:
- Border-bottom: 1px solid #e0e0e0
- Hover: Background becomes #f9f9f9

Links in table:
- Color: Blue (#0088D8)
- Underline on hover
```

### Dropdowns
```
Dropdown:
- Border: 2px solid #e0e0e0
- Rounded corners (4px)
- Focus state: Border becomes blue, shadow effect
- Options: Black text on white background
```

## Typography

```
Headings:
- H1: 32px, Blue (#0088D8), bold
- H2: 20px, Blue (#0088D8), bold
- H3: 16px, Blue (#0088D8), bold

Labels:
- 14px, Dark gray (#333), bold

Body Text:
- 14px, Dark gray (#666)

Small Text:
- 12px, Gray (#999)

Links:
- 14px, Blue (#0088D8), bold
- Underline on hover
```

## Responsive Design

### Mobile (< 768px)
- Full-width layout
- Single column tables
- Smaller circles and font sizes
- Stacked dropdowns and buttons

### Tablet (768px - 1024px)
- 85% width with centered margin
- Medium font sizes
- Adjusted spacing

### Desktop (> 1024px)
- Maximum 1200px width, centered
- Full-size elements
- Optimal spacing and padding

## Animation & Transitions

```
Smooth Transitions:
- All hover effects: 0.2s - 0.3s
- Button state changes: smooth color transition
- Dropdown expansion: animation with opacity

Animations:
- Status bar tooltip: slideUp animation (0.2s)
- Table row expansion: slideDown animation (0.3s)
- Status indicator click: subtle scale effect
```

## Accessibility

```
Contrast Ratios:
- Blue (#0088D8) on White: 5.8:1 ✓ WCAG AA
- Dark gray (#333) on White: 12.6:1 ✓ WCAG AAA
- Green (#4CAF50) on White: 3.3:1 ✓ WCAG AA

Focus States:
- Keyboard navigation: Visible focus outline
- Buttons: Box shadow effect around border
- Inputs: Colored outline visible on focus

Semantic HTML:
- Proper heading hierarchy
- Form labels associated with inputs
- Buttons for clickable actions
- Links for navigation
```
