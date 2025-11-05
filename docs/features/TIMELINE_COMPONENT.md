# Timeline Component Feature

**Feature**: Add Timeline visualization tool to BetterChat chat
**Type**: New visualization component (similar to existing charts)
**Status**: Planning
**Estimated Duration**: 1.5-2 hours (~2 minutes human time)

---

## Overview

Add a vertical timeline visualization component that AI agents can use to display:
- Event chronologies
- Project milestones/progress
- Process steps with status indicators
- Audit trails/history
- Any time-based sequential data

**Pattern**: Follows existing tool pattern (bar-chart, line-chart, pie-chart, table)
**Stack**: React + Framer Motion (already installed) + existing UI components

---

## Component Design

### Visual Structure
```
┌─────────────────────────────────┐
│  Timeline Title                 │
│  Optional description           │
├─────────────────────────────────┤
│                                 │
│  ●━━ Event 1 Title              │
│  │   Event details              │
│  │   2 hours ago                │
│  │                              │
│  ●━━ Event 2 Title              │
│  │   Event details              │
│  │   1 hour ago                 │
│  │                              │
│  ○━━ Event 3 Title              │
│      Event details              │
│      Pending                    │
│                                 │
└─────────────────────────────────┘
```

### Status Indicators
- **Complete**: Filled green circle ●
- **In Progress**: Filled blue circle ●
- **Pending**: Outline gray circle ○

### Animations
- Stagger fade-in from top to bottom
- 50-100ms delay between events
- Slide from left + fade
- Similar to sequential-thinking component pattern

---

## Data Schema

```typescript
{
  title: string;           // "Project Progress"
  description?: string;    // Optional subtitle
  events: Array<{
    title: string;         // "Design Phase"
    description?: string;  // Optional details
    timestamp: string;     // ISO date or relative ("2 hours ago")
    status: "pending" | "in-progress" | "complete";
    icon?: string;         // Optional lucide icon name
  }>;
}
```

---

## Implementation Pattern

Follows exact same pattern as existing visualization tools:

1. **Tool Definition** (`src/lib/ai/tools/visualization/create-timeline.ts`)
   - Zod schema for validation
   - AI-friendly description
   - Returns "Success"

2. **Component** (`src/components/tool-invocation/timeline.tsx`)
   - React component with animations
   - Uses existing Card, Badge, Separator
   - Framer Motion for stagger effect

3. **Registration** (modify existing files)
   - Add to `DefaultToolName` enum
   - Register in `APP_DEFAULT_TOOL_KIT.Visualization`
   - Add rendering case in `message-parts.tsx`

---

## Use Cases

**Example 1: Project Milestones**
```
AI: "Show me a timeline of the project phases"

Timeline displays:
- ● Requirements Gathering (Complete) - 2 weeks ago
- ● Design Phase (Complete) - 1 week ago
- ● Development (In Progress) - Started 3 days ago
- ○ Testing (Pending)
- ○ Deployment (Pending)
```

**Example 2: Event History**
```
AI: "Show me what happened today"

Timeline displays:
- ● Deployment successful - 2 hours ago
- ● Tests passed - 3 hours ago
- ● Code review approved - 4 hours ago
```

**Example 3: Process Steps**
```
AI: "Show me the order fulfillment process"

Timeline displays:
- ● Order Received - 10:00 AM
- ● Payment Confirmed - 10:05 AM
- ● Item Picked - 10:30 AM
- ● Shipped - 11:15 AM
- ○ Delivered - Expected tomorrow
```

---

## Technical Details

### Dependencies
- **Framer Motion**: Already installed (v12.23.24)
- **Lucide React**: Already installed (v0.486.0) for icons
- **date-fns**: Already installed for timestamp formatting
- **Existing UI**: Card, Badge, Separator from shadcn/ui

### No New Dependencies Needed
All required libraries already in package.json

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Dark/light theme support (automatic via existing system)

---

## Files to Create/Modify

**New Files (2)**:
1. `src/lib/ai/tools/visualization/create-timeline.ts` - Tool definition
2. `src/components/tool-invocation/timeline.tsx` - React component

**Modified Files (3)**:
1. `src/lib/ai/tools/tool-kit.ts` - Register tool
2. `src/types/tool.ts` - Add enum value
3. `src/components/message-parts.tsx` - Add render case

**Total**: 5 files

---

## Testing Strategy

### Development Testing
1. Start dev server
2. Open chat
3. Ask AI: "Show me a timeline of project phases"
4. Verify AI calls `createTimeline` tool
5. Verify timeline renders with proper styling
6. Test animations work smoothly
7. Test with different data (2 events, 10 events)
8. Test all status types (pending/in-progress/complete)

### Edge Cases
- Empty events array
- Single event
- Many events (10+)
- Missing optional fields
- Very long descriptions
- Mobile viewport

### Visual Testing
- Dark mode
- Light mode
- Responsive layout
- Animation performance
- Status colors distinct

---

## Success Criteria

✅ AI can invoke timeline tool from chat
✅ Timeline renders with all event data
✅ Animations work smoothly (no jank)
✅ Status indicators are visually distinct
✅ Works in dark and light themes
✅ Responsive on mobile
✅ TypeScript compiles without errors
✅ Production build succeeds
✅ No console errors or warnings

---

## Future Enhancements (Optional)

- Interactive events (click to expand details)
- Horizontal timeline option
- Custom color themes
- Export to image
- Filtering by status
- Date range selection

---

## References

**Existing Components to Study**:
- `src/components/tool-invocation/bar-chart.tsx` - Tool pattern
- `src/components/tool-invocation/sequential-thinking.tsx` - Animation pattern
- `src/lib/ai/tools/visualization/create-bar-chart.ts` - Tool definition pattern
- `src/components/message-parts.tsx` (lines 906-930) - Rendering pattern

**Libraries**:
- Framer Motion docs: https://www.framer.com/motion/
- Lucide icons: https://lucide.dev/
- Recharts (for reference): https://recharts.org/
