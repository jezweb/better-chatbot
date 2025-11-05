# Implementation Phases: Timeline Component

**Project**: Add Timeline visualization tool to BetterChat
**Type**: Feature Addition (New Visualization Component)
**Stack**: Existing BetterChat stack (Next.js + React + Framer Motion)
**Estimated Total**: 1.5-2 hours (~2 minutes human time with Claude Code)

---

## Phase 1: Create Timeline Tool Definition
**Type**: Tool Definition
**Estimated**: 30 minutes
**Files**:
- `src/lib/ai/tools/visualization/create-timeline.ts` (new)
- `src/lib/ai/tools/tool-kit.ts` (modify)
- `src/types/tool.ts` (modify)

### Tasks
- [ ] Create `create-timeline.ts` in visualization tools folder
- [ ] Define Zod schema for timeline data structure
  ```typescript
  z.object({
    title: z.string(),
    description: z.string().optional(),
    events: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      timestamp: z.string(),
      status: z.enum(["pending", "in-progress", "complete"]),
      icon: z.string().optional()
    }))
  })
  ```
- [ ] Write tool description for AI (when to use timeline)
- [ ] Create tool using `tool()` from Vercel AI SDK
- [ ] Add `CreateTimeline = "createTimeline"` to `DefaultToolName` enum in types/tool.ts
- [ ] Register tool in `APP_DEFAULT_TOOL_KIT.Visualization` in tool-kit.ts
- [ ] Export from tool-kit.ts

### Verification Criteria
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Tool appears in visualization toolkit
- [ ] Schema validates correctly (test with sample data)
- [ ] Tool function returns "Success" when executed

### Exit Criteria
Tool is properly defined, typed, and registered in the toolkit. Ready for component implementation.

---

## Phase 2: Build Timeline React Component
**Type**: UI Component
**Estimated**: 45-60 minutes
**Files**:
- `src/components/tool-invocation/timeline.tsx` (new)
- `src/components/message-parts.tsx` (modify)

### Tasks

#### Create Timeline Component (`timeline.tsx`)
- [ ] Create new file with TypeScript React component
- [ ] Import dependencies: framer-motion, lucide-react, date-fns, UI components
- [ ] Define props interface matching tool schema
- [ ] Create main Timeline wrapper (Card component)
- [ ] Add title and optional description header
- [ ] Build timeline connector (vertical line using Separator or custom div)
- [ ] Map events to timeline items with:
  - [ ] Status indicator dots (colored circles)
  - [ ] Event title and description
  - [ ] Timestamp formatting (relative or absolute)
  - [ ] Optional icon support
  - [ ] Connecting lines between events
- [ ] Add responsive styling (Tailwind classes)
- [ ] Implement Framer Motion animations:
  - [ ] Stagger effect for events
  - [ ] Fade-in + slide-left animation
  - [ ] 50-100ms delay between items
- [ ] Add dark/light theme support (use CSS variables)
- [ ] Export component

#### Integrate with Message Parts (`message-parts.tsx`)
- [ ] Add dynamic import for Timeline component (lines ~663-696)
  ```typescript
  const Timeline = dynamic(() => import("@/components/tool-invocation/timeline"))
  ```
- [ ] Add rendering case in switch statement (lines ~906-930)
  ```typescript
  case DefaultToolName.CreateTimeline:
    return <Timeline key={...} {...(input as any)} />;
  ```

### Verification Criteria
- [ ] Component renders with sample data in development
- [ ] Animations play smoothly (no stuttering)
- [ ] Status colors are visually distinct:
  - Pending: Gray outline circle
  - In Progress: Blue filled circle
  - Complete: Green filled circle
- [ ] Timestamps format correctly (relative time works)
- [ ] Icons display when provided (lucide icons)
- [ ] Responsive layout works on mobile (test in DevTools)
- [ ] Works in both dark and light themes
- [ ] No TypeScript errors
- [ ] No console warnings or errors
- [ ] Lazy loading works (component only loads when needed)

### Exit Criteria
Timeline component renders correctly in chat when AI invokes the tool. All animations and styling working properly.

---

## Phase 3: Testing & Polish
**Type**: Integration Testing & QA
**Estimated**: 15-30 minutes
**Files**:
- Development testing (local)
- Production build verification

### Tasks

#### Development Testing
- [ ] Start dev server (`pnpm dev`)
- [ ] Open chat interface
- [ ] Test AI invocation with prompt: "Show me a timeline of project phases"
- [ ] Verify AI calls createTimeline tool
- [ ] Verify timeline renders with correct data
- [ ] Test with various scenarios:
  - [ ] 2 events (minimal)
  - [ ] 5 events (typical)
  - [ ] 10+ events (stress test)
  - [ ] All status types (pending, in-progress, complete)
  - [ ] With icons
  - [ ] Without icons
  - [ ] With descriptions
  - [ ] Without descriptions
  - [ ] Long text (word wrapping)
- [ ] Test theme switching (dark ↔ light)
- [ ] Test responsive behavior (mobile, tablet, desktop)
- [ ] Check animation performance (should be smooth)

#### Production Build Testing
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Build project: `pnpm build`
- [ ] Verify build succeeds without errors
- [ ] Test production preview: `pnpm preview` (if available)
- [ ] Check bundle size (should not significantly increase)

#### Edge Case Testing
- [ ] Empty events array (graceful handling)
- [ ] Single event (no connector needed)
- [ ] Very long descriptions (truncation/wrapping)
- [ ] Invalid timestamps (error handling)
- [ ] Missing optional fields (icon, description)

### Verification Criteria
- [ ] AI successfully generates timelines from natural language prompts
- [ ] All visual elements render correctly
- [ ] No layout shifts or visual bugs
- [ ] Animations are smooth (60fps)
- [ ] Works across all tested scenarios
- [ ] TypeScript compilation succeeds
- [ ] Production build succeeds
- [ ] No new console errors
- [ ] Component size is reasonable (~5-10KB gzipped)

### Exit Criteria
Timeline component is fully functional, tested, and ready for deployment. All edge cases handled gracefully.

---

## Summary

**Total Phases**: 3
**Total Files**: 5 (2 new, 3 modified)
**Estimated Time**: 1.5-2 hours implementation (~2 minutes human time with Claude Code)
**Testing Time**: 15-30 minutes
**Total Time**: ~2-2.5 hours (~3 minutes human time)

### Phase Breakdown
1. **Tool Definition** (30 min) - Define schema, register tool
2. **Component** (45-60 min) - Build UI, animations, integration
3. **Testing** (15-30 min) - Verify functionality, polish

### Files Modified
**New**:
- `src/lib/ai/tools/visualization/create-timeline.ts`
- `src/components/tool-invocation/timeline.tsx`

**Modified**:
- `src/lib/ai/tools/tool-kit.ts`
- `src/types/tool.ts`
- `src/components/message-parts.tsx`

### Dependencies
- ✅ Framer Motion (already installed)
- ✅ Lucide React (already installed)
- ✅ date-fns (already installed)
- ✅ shadcn/ui components (already available)

**No new dependencies required!**

---

## Next Steps After Completion

1. **Deploy to production**: `pnpm build && vercel --prod`
2. **Test in production**: Verify timeline works on live site
3. **Documentation**: Update user-facing docs (if applicable)
4. **Optional enhancements**: Consider future features from TIMELINE_COMPONENT.md

---

## References

- Feature spec: `docs/features/TIMELINE_COMPONENT.md`
- Existing chart components: `src/components/tool-invocation/bar-chart.tsx`
- Animation pattern: `src/components/tool-invocation/sequential-thinking.tsx`
- Tool pattern: `src/lib/ai/tools/visualization/create-bar-chart.ts`
