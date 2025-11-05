# Implementation Phases: Better Chatbot UI Enhancements

**Project Type**: Open Source Contribution (Better Chatbot)
**Stack**: Next.js 15 + React 19 + Tailwind v4 + shadcn/ui
**Target**: Enhance Better Chatbot with Crayon-inspired components + UX improvements
**Estimated Total**: 12-15 hours (~12-15 minutes human time with Claude Code)

---

## Overview

This project adds:
1. **4 New UI Components** (Steps, ImageGallery, Carousel, FollowUpBlock) - Inspired by Crayon, rewritten for Better Chatbot
2. **Full-Width Chat Mode** - User preference for wide content (tables, charts)
3. **Environment-Based Customization** - Branding text and default AI model via env vars

**Strategy**: Use environment variables for configuration (no database schema changes), localStorage for user preferences (width toggle).

---

## Phase 1: Research & Architecture Planning
**Type**: Infrastructure
**Estimated**: 2 hours
**Location**: `/home/jez/Documents/betterchat/`

**Tasks**:
- [ ] Review Crayon component source code (Steps, ImageGallery, Carousel, FollowUpBlock)
- [ ] Audit Better Chatbot's existing components to avoid duplication
- [ ] Identify current chat layout width constraints
- [ ] Map out localStorage usage pattern in Better Chatbot (for width preference)
- [ ] Document environment variable naming conventions
- [ ] Create component implementation plan (file structure, dependencies)
- [ ] Review Cloudflare Workers compatibility requirements

**Files to Review**:
- `src/components/ui/` - Existing shadcn components
- `src/components/message-parts.tsx` - Chat message rendering
- `src/app/(auth)/layout.tsx` - Branding text location
- `src/app/layout.tsx` - Site metadata
- `.env.example` - Environment variable patterns
- `package.json` - Dependencies

**Verification Criteria**:
- [ ] Component duplication check complete (no overlaps with existing Better Chatbot components)
- [ ] Width constraint location identified (likely `max-w-3xl` or similar)
- [ ] localStorage pattern documented (key naming, persistence)
- [ ] Environment variable names chosen (e.g., `SITE_BRAND_NAME`, `DEFAULT_AI_MODEL`)
- [ ] No Crayon dependencies needed (fully rewritten approach confirmed)

**Exit Criteria**: Clear implementation plan with file list, no architectural blockers identified.

---

## Phase 2: Steps Component (Progress Indicator)
**Type**: UI
**Estimated**: 2-3 hours
**Files**: `src/components/ui/steps.tsx`, `src/components/ui/steps.stories.tsx` (optional demo)

**Tasks**:
- [ ] Create `steps.tsx` component file
- [ ] Define TypeScript interface: `Step { number, title, description, status: 'pending' | 'current' | 'complete' }`
- [ ] Implement vertical step layout with Tailwind v4
- [ ] Add step connectors (lines between steps)
- [ ] Style states: pending (gray), current (blue), complete (green with checkmark)
- [ ] Make responsive (stack on mobile, horizontal option for desktop)
- [ ] Add Lucide icons for step states
- [ ] Create demo example showing HR onboarding workflow
- [ ] Test with 3-7 steps (typical use case range)

**Component API**:
```tsx
<Steps
  steps={[
    { number: 1, title: "Review Policy", description: "Read employee handbook", status: "complete" },
    { number: 2, title: "Acknowledge", description: "Accept terms", status: "current" },
    { number: 3, title: "Complete", description: "Finish onboarding", status: "pending" }
  ]}
  orientation="vertical" // or "horizontal"
/>
```

**Verification Criteria**:
- [ ] Steps render with correct visual hierarchy
- [ ] Connectors properly align between steps
- [ ] States (pending/current/complete) have distinct styling
- [ ] Responsive: vertical on mobile, can toggle horizontal
- [ ] Icons display correctly (checkmark for complete, number for pending/current)
- [ ] Demo works with HR onboarding example

**Exit Criteria**: Steps component works standalone, no Crayon dependencies, fully styled with Tailwind v4.

---

## Phase 3: ImageGallery Component (Grid + Lightbox)
**Type**: UI
**Estimated**: 3-4 hours
**Files**: `src/components/ui/image-gallery.tsx`, `src/components/ui/image-lightbox.tsx`

**Tasks**:
- [ ] Create `image-gallery.tsx` component
- [ ] Implement responsive grid layout (1-5 images)
  - 1 image: full width
  - 2 images: 2 columns
  - 3 images: 2 columns (1 spanning 2 rows)
  - 4 images: 2x2 grid
  - 5+ images: 2x2 grid + "Show All" button
- [ ] Create `image-lightbox.tsx` modal component (reuse Better Chatbot's Dialog)
- [ ] Add image navigation in lightbox (prev/next arrows, close button)
- [ ] Implement keyboard navigation (arrow keys, escape)
- [ ] Add loading states and error handling for images
- [ ] Make images lazy-load (Next.js Image component)
- [ ] Add zoom on hover (subtle scale effect)
- [ ] Create demo with HR policy screenshots

**Component API**:
```tsx
<ImageGallery
  images={[
    { src: "/policy1.png", alt: "PTO Policy", caption: "Paid Time Off" },
    { src: "/policy2.png", alt: "Benefits", caption: "Health Benefits" }
  ]}
  maxPreview={4} // Show 4, then "Show All" button
/>
```

**Verification Criteria**:
- [ ] Grid layouts correct for 1-5+ images
- [ ] Lightbox opens on image click
- [ ] Navigation works (prev/next arrows, keyboard)
- [ ] Images lazy-load properly
- [ ] Close button and escape key dismiss lightbox
- [ ] Responsive on mobile (single column grid)
- [ ] Works with Better Chatbot's existing Dialog/Modal

**Exit Criteria**: ImageGallery renders correctly, lightbox fully functional, no layout shifts.

---

## Phase 4: Carousel Component (Horizontal Scroll)
**Type**: UI
**Estimated**: 2-3 hours
**Files**: `src/components/ui/carousel.tsx`

**Tasks**:
- [ ] Create `carousel.tsx` component
- [ ] Implement horizontal scroll container with smooth scrolling
- [ ] Add navigation buttons (prev/next arrows)
- [ ] Implement snap-to-grid scrolling (CSS scroll-snap)
- [ ] Add scroll indicators (dots showing position)
- [ ] Make touch-friendly (swipe on mobile)
- [ ] Add auto-scroll option (optional autoplay)
- [ ] Support card variant (with shadows/borders) and sunk variant (flush)
- [ ] Create demo with employee profile cards

**Component API**:
```tsx
<Carousel
  items={[
    <ProfileCard name="Alice" role="HR Manager" />,
    <ProfileCard name="Bob" role="Engineer" />
  ]}
  variant="card" // or "sunk"
  showIndicators={true}
  snapToGrid={true}
/>
```

**Verification Criteria**:
- [ ] Smooth horizontal scrolling works
- [ ] Snap-to-grid aligns items correctly
- [ ] Navigation buttons scroll to next/prev item
- [ ] Touch swipe works on mobile
- [ ] Scroll indicators show current position
- [ ] Responsive: adjusts item width on different screens
- [ ] Works with variable-width items

**Exit Criteria**: Carousel scrolls smoothly, navigation works, mobile-friendly.

---

## Phase 5: FollowUpBlock Component (Suggested Actions)
**Type**: UI
**Estimated**: 1-2 hours
**Files**: `src/components/ui/follow-up-block.tsx`

**Tasks**:
- [ ] Create `follow-up-block.tsx` wrapper component
- [ ] Create `follow-up-item.tsx` button component (chip-style)
- [ ] Style as compact button chips (rounded, subtle background)
- [ ] Support icons (optional Lucide icons)
- [ ] Add hover/focus states
- [ ] Implement click handler to trigger follow-up action
- [ ] Make responsive (wrap on narrow screens)
- [ ] Create demo showing HR query suggestions

**Component API**:
```tsx
<FollowUpBlock>
  <FollowUpItem onClick={() => askQuestion("PTO policy")}>
    Ask about PTO policy
  </FollowUpItem>
  <FollowUpItem icon={Heart} onClick={() => askQuestion("Benefits")}>
    Health benefits
  </FollowUpItem>
  <FollowUpItem onClick={() => askQuestion("401k")}>
    401k details
  </FollowUpItem>
</FollowUpBlock>
```

**Verification Criteria**:
- [ ] Chips render in horizontal row
- [ ] Wrap to multiple rows on narrow screens
- [ ] Hover states work (subtle color change)
- [ ] Click handlers fire correctly
- [ ] Icons display properly when provided
- [ ] Accessible (keyboard navigation, focus states)

**Exit Criteria**: FollowUpBlock displays suggestion chips, fully interactive.

---

## Phase 6: Full-Width Chat Mode
**Type**: UI
**Estimated**: 2 hours
**Files**: `src/components/chat-container.tsx` (or equivalent layout file), `src/lib/user-preferences.ts`

**Tasks**:
- [ ] Locate current chat width constraint (likely `max-w-3xl` or `max-w-4xl`)
- [ ] Create localStorage utility for user preferences
  - Key: `better-chatbot-chat-width`
  - Values: `"default"` | `"wide"`
- [ ] Add width toggle button to chat header/toolbar
- [ ] Implement conditional width classes:
  - Default: `max-w-3xl` (current, ~768px)
  - Wide: `max-w-7xl` or `max-w-full px-8` (~1280px or full width)
- [ ] Ensure tables/charts benefit from wide mode
- [ ] Add smooth transition between modes
- [ ] Persist preference across sessions
- [ ] Make toggle button accessible (aria-label, keyboard)

**Component Changes**:
```tsx
// Add to chat layout
const [chatWidth, setChatWidth] = useLocalStorage('better-chatbot-chat-width', 'default');

<div className={cn(
  "mx-auto transition-all duration-300",
  chatWidth === 'wide' ? 'max-w-7xl' : 'max-w-3xl'
)}>
  {/* chat content */}
</div>

// Toggle button
<Button onClick={() => setChatWidth(w => w === 'wide' ? 'default' : 'wide')}>
  <Maximize2 /> {/* or Minimize2 when wide */}
</Button>
```

**Verification Criteria**:
- [ ] Toggle button visible in chat header
- [ ] Click toggles between default and wide width
- [ ] Preference persists after page reload
- [ ] Tables and charts look better in wide mode
- [ ] Smooth transition (no jarring layout shift)
- [ ] Mobile behavior: no change (already full width)
- [ ] Works across all chat pages

**Exit Criteria**: Width toggle fully functional, preference persisted, no layout issues.

---

## Phase 7: Environment-Based Customization
**Type**: Integration
**Estimated**: 2-3 hours
**Files**: `.env.example`, `src/app/layout.tsx`, `src/app/(auth)/layout.tsx`, `src/lib/env.ts` (if exists)

**Tasks**:
- [ ] Add new environment variables to `.env.example`:
  - `SITE_BRAND_NAME` (default: "better-chatbot")
  - `SITE_BRAND_TAGLINE` (optional description)
  - `DEFAULT_AI_MODEL` (e.g., "openai/gpt-4o")
  - `AVAILABLE_AI_MODELS` (comma-separated list, optional)
- [ ] Update `src/app/layout.tsx` metadata to use `SITE_BRAND_NAME`
- [ ] Update `src/app/(auth)/layout.tsx` to use `SITE_BRAND_NAME` instead of hardcoded "Chat Bot"
- [ ] Add environment variable validation (Zod schema if Better Chatbot uses one)
- [ ] Update model selection logic to respect `DEFAULT_AI_MODEL`
- [ ] Filter model list if `AVAILABLE_AI_MODELS` is set
- [ ] Document new env vars in README or deployment docs
- [ ] Test with different branding (e.g., "HR Chat")

**Environment Variables**:
```bash
# Site Branding
SITE_BRAND_NAME="HR Chat"
SITE_BRAND_TAGLINE="AI-powered HR assistant"

# AI Configuration
DEFAULT_AI_MODEL="openai/gpt-4o"
AVAILABLE_AI_MODELS="openai/gpt-4o,anthropic/claude-sonnet-4-5,google/gemini-2.5-pro"
```

**Code Changes**:
```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  title: process.env.SITE_BRAND_NAME || "better-chatbot",
  description: process.env.SITE_BRAND_TAGLINE || "Better Chatbot..."
}

// src/app/(auth)/layout.tsx
<span>{process.env.SITE_BRAND_NAME || "Chat Bot"}</span>
```

**Verification Criteria**:
- [ ] Environment variables load correctly
- [ ] Branding text updates in auth page, header, metadata
- [ ] Default model applies to new chats
- [ ] Model list filters correctly when `AVAILABLE_AI_MODELS` is set
- [ ] Fallback to defaults when env vars not set
- [ ] No build errors with missing env vars
- [ ] Works in development and production (Vercel)

**Exit Criteria**: Branding and AI model configuration work via environment variables, fully documented.

---

## Phase 8: Testing & Documentation
**Type**: Testing
**Estimated**: 2-3 hours
**Files**: `docs/NEW_COMPONENTS.md`, `README.md` (update), test files

**Tasks**:
- [ ] Manual testing checklist:
  - Test all 4 components in real chat scenarios
  - Verify full-width toggle with various content types
  - Test environment variable customization
  - Check responsive behavior (mobile, tablet, desktop)
  - Verify localStorage persistence
  - Test keyboard navigation and accessibility
- [ ] Create `docs/NEW_COMPONENTS.md` documentation:
  - Component APIs and examples
  - Environment variable reference
  - Usage examples for HR workflows
- [ ] Update Better Chatbot README with:
  - New component showcase
  - Environment variable documentation
  - Migration notes (if needed)
- [ ] Create demo examples:
  - HR onboarding with Steps component
  - Policy documents with ImageGallery
  - Employee profiles with Carousel
  - Query suggestions with FollowUpBlock
- [ ] Add Crayon attribution in component headers
- [ ] Take screenshots for PR documentation

**Testing Checklist**:
- [ ] Steps: 3-step, 5-step, 7-step workflows render correctly
- [ ] ImageGallery: Test with 1, 2, 3, 4, 5+ images
- [ ] Carousel: Test with 3-10 items, check scroll behavior
- [ ] FollowUpBlock: Test with 2-6 suggestions, check wrapping
- [ ] Width toggle: Works in all chat views, persists correctly
- [ ] Environment vars: Test with custom branding, verify fallbacks
- [ ] Responsive: All components work on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Accessibility: Keyboard navigation works, screen reader labels correct

**Documentation Structure**:
```markdown
# New Components

## Steps Component
**Purpose**: Visual progress indicator for multi-step workflows

**Usage**:
```tsx
<Steps steps={[...]} orientation="vertical" />
```

**Example**: HR Onboarding Checklist
[Screenshot]

## ImageGallery Component
[... etc ...]

## Environment Variables

### SITE_BRAND_NAME
**Type**: String
**Default**: "better-chatbot"
**Example**: "HR Chat"
**Description**: Site name shown in header, auth page, and metadata

[... etc ...]
```

**Verification Criteria**:
- [ ] All components tested manually
- [ ] Documentation is clear and includes examples
- [ ] Screenshots captured for PR
- [ ] No console errors or warnings
- [ ] TypeScript types are correct
- [ ] Components work in Cloudflare Workers environment

**Exit Criteria**: All features tested and documented, ready for contribution PR.

---

## Phase 9: Contribution PR to Better Chatbot
**Type**: Integration
**Estimated**: 1-2 hours
**Files**: N/A (GitHub PR)

**Tasks**:
- [ ] Create clean commit history in `betterchat` fork
- [ ] Push to GitHub (`github.com/jezweb/betterchat`)
- [ ] Create PR to `cgoinglove/better-chatbot` with:
  - **Title**: "feat: Add Crayon-inspired UI components + customization options"
  - **Description**: Benefits, use cases, implementation details
  - **Screenshots**: All 4 components + width toggle
  - **Demo**: Link to deployed demo if possible
  - **Attribution**: Credit to Thesys Crayon
  - **Breaking Changes**: None (all additive)
  - **Environment Variables**: Document new optional env vars
- [ ] Respond to maintainer feedback
- [ ] Make requested changes if needed
- [ ] Celebrate when merged! 🎉

**PR Description Template**:
```markdown
## Summary
Adds 4 new UI components inspired by Thesys Crayon (fully rewritten with Tailwind v4) plus UX improvements:

1. **Steps** - Multi-step progress indicator
2. **ImageGallery** - Responsive image grid with lightbox
3. **Carousel** - Horizontal scrolling content
4. **FollowUpBlock** - Suggested action chips
5. **Full-Width Mode** - User preference for wide content
6. **Environment Customization** - Brand name and default AI model

## Motivation
These components enhance Better Chatbot for workflow-oriented use cases (HR, customer support, education) while maintaining the project's design philosophy.

## Use Cases
- HR onboarding workflows (Steps)
- Policy documentation (ImageGallery)
- Employee/product browsing (Carousel)
- Guided conversations (FollowUpBlock)
- Data tables and analytics (Full-Width Mode)

## Implementation
- All components use Tailwind v4 + shadcn/ui patterns
- No new dependencies added
- No database schema changes
- Fully accessible (keyboard nav, ARIA labels)
- Responsive on all screen sizes

## Screenshots
[4-6 screenshots showing components in action]

## Attribution
Components inspired by [Thesys Crayon](https://github.com/thesysdev/crayon) (MIT License), fully rewritten for Better Chatbot.

## Testing
- [x] Manual testing on desktop, tablet, mobile
- [x] Keyboard navigation verified
- [x] Works in Cloudflare Workers environment
- [x] No console errors or TypeScript issues

## Breaking Changes
None - all features are additive and opt-in.
```

**Verification Criteria**:
- [ ] PR created with complete description
- [ ] All screenshots attached
- [ ] CI/CD passes (if Better Chatbot has automated tests)
- [ ] No merge conflicts with main branch
- [ ] Maintainer has reviewed

**Exit Criteria**: PR submitted, ready for review by Better Chatbot maintainer.

---

## Phase 10: Sync to HR Chat (After Upstream Merge)
**Type**: Integration
**Estimated**: 30 minutes
**Location**: `/home/jez/Documents/hr-chat/`

**Tasks**:
- [ ] Once PR is merged to Better Chatbot upstream
- [ ] Sync HR Chat from upstream:
  ```bash
  cd /home/jez/Documents/hr-chat
  git fetch upstream
  git merge upstream/main
  ```
- [ ] Apply HR Chat environment variables:
  ```bash
  SITE_BRAND_NAME="HR Chat"
  SITE_BRAND_TAGLINE="AI-powered HR assistant"
  DEFAULT_AI_MODEL="openai/gpt-4o"
  ```
- [ ] Test all new components in HR Chat deployment
- [ ] Deploy to production (Vercel auto-deploys)
- [ ] Verify branding updates live at hrchat.jezweb.ai

**Verification Criteria**:
- [ ] HR Chat has all new components from upstream
- [ ] Branding shows "HR Chat" instead of "better-chatbot"
- [ ] No merge conflicts with HR Chat customizations
- [ ] Production deployment successful

**Exit Criteria**: HR Chat has all enhancements, live and working at hrchat.jezweb.ai.

---

## Notes

### Testing Strategy
- Manual testing per phase (automated tests if Better Chatbot has test infrastructure)
- Visual verification in real chat interface
- Responsive testing on 3 screen sizes
- Accessibility verification (keyboard + screen reader)

### Deployment Strategy
- Work in `/home/jez/Documents/betterchat/` (public fork)
- Deploy to preview URL for testing (optional)
- Contribute via PR when ready
- Sync to HR Chat after upstream merge

### Context Management
- Phases sized for single sessions (2-4 hours implementation + verification)
- Each phase has clear entry/exit criteria
- Can pause between phases without losing context

### Contribution Philosophy
- **Additive only** - No breaking changes to Better Chatbot
- **Optional features** - All new components are opt-in
- **Documentation-first** - Clear examples and use cases
- **Community value** - Benefits all Better Chatbot users, not just HR Chat

### Environment Variables Philosophy
- **No database changes** - Simpler contribution, easier to maintain
- **Deploy-time config** - Set once in Vercel, applies to all users
- **Sensible defaults** - Works without any env vars set
- **Forward compatible** - Can add database-backed admin panel later if needed

---

## Success Metrics

**Technical**:
- [ ] All 4 components render correctly
- [ ] Width toggle works and persists
- [ ] Environment variables customize branding
- [ ] No TypeScript errors
- [ ] No accessibility violations
- [ ] Works in Cloudflare Workers

**Contribution**:
- [ ] PR accepted by Better Chatbot maintainer
- [ ] Components used in community deployments
- [ ] Positive feedback from users

**HR Chat**:
- [ ] All features live at hrchat.jezweb.ai
- [ ] "HR Chat" branding applied
- [ ] Improved UX for HR workflows

---

**Total Estimated Time**: 12-15 hours (~12-15 minutes human time with Claude Code automation)

**Ready to start Phase 1?** Let's begin with research and architecture planning!
