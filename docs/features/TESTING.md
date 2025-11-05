# Testing Strategy: Featured System

## Overview

The Featured System adds admin-only functionality to mark agents, MCP servers, and workflows as "featured". Testing focuses on:
1. **Authorization** - Only admins can toggle featured status
2. **Visibility constraints** - Only public items can be featured
3. **UI behavior** - Star button appears/disappears correctly
4. **Data integrity** - Featured status persists and displays correctly

## Testing Approach

**Primary**: Manual testing (real user flows)
**Secondary**: Automated API unit tests (security boundaries)

**Rationale**: UI/UX is best tested manually. API security is best tested automatically.

---

## Automated Tests

### API Endpoint Tests

**Location**: `src/app/api/{agent|mcp|workflow}/[id]/featured/route.test.ts`

#### Test Suite: Agent Featured Toggle

```typescript
describe('PATCH /api/agent/[id]/featured', () => {
  describe('Authorization', () => {
    it('returns 401 when not authenticated', async () => {
      // Test without session
      const response = await PATCH('/api/agent/test-id/featured', {
        body: { isFeatured: true }
      });
      expect(response.status).toBe(401);
    });

    it('returns 403 when user is not admin', async () => {
      // Test with editor role
      const response = await PATCH('/api/agent/test-id/featured', {
        session: { user: { role: 'editor' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Only admins');
    });

    it('returns 200 when user is admin', async () => {
      // Test with admin role
      const response = await PATCH('/api/agent/test-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(200);
    });
  });

  describe('Visibility Constraints', () => {
    it('returns 400 when agent is private', async () => {
      // Mock agent with visibility: 'private'
      const response = await PATCH('/api/agent/private-agent-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Only public');
    });

    it('returns 200 when agent is public', async () => {
      // Mock agent with visibility: 'public'
      const response = await PATCH('/api/agent/public-agent-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(200);
    });
  });

  describe('Validation', () => {
    it('returns 400 when isFeatured is not boolean', async () => {
      const response = await PATCH('/api/agent/test-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: 'yes' } // Invalid type
      });
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid input');
    });

    it('returns 404 when agent does not exist', async () => {
      const response = await PATCH('/api/agent/nonexistent-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Data Persistence', () => {
    it('toggles featured status from false to true', async () => {
      const response = await PATCH('/api/agent/test-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: true }
      });
      expect(response.status).toBe(200);
      expect(response.body.isFeatured).toBe(true);
    });

    it('toggles featured status from true to false', async () => {
      // Assume agent starts as featured
      const response = await PATCH('/api/agent/featured-agent-id/featured', {
        session: { user: { role: 'admin' } },
        body: { isFeatured: false }
      });
      expect(response.status).toBe(200);
      expect(response.body.isFeatured).toBe(false);
    });
  });
});
```

**Same structure for**:
- `mcp/[id]/featured/route.test.ts`
- `workflow/[id]/featured/route.test.ts`

---

## Manual Testing Checklist

### Setup
- [ ] Start dev server (`pnpm dev`)
- [ ] Login as admin user
- [ ] Create at least 2 public agents, 2 public MCP servers, 2 public workflows
- [ ] Create at least 1 private agent, 1 private MCP, 1 private workflow

### Test Case 1: Admin Can Feature Public Items

**Agent**:
- [ ] Navigate to Agents page
- [ ] Open a public agent (not yours)
- [ ] Verify star button appears next to visibility controls
- [ ] Click star button
- [ ] Verify star turns yellow and fills
- [ ] Verify tooltip changes to "Remove from featured"
- [ ] Refresh page
- [ ] Verify star is still yellow/filled
- [ ] Navigate to Agents dashboard
- [ ] Verify agent appears in "Featured" section

**MCP Server**:
- [ ] Repeat above steps for a public MCP server
- [ ] Verify featured section on MCP dashboard

**Workflow**:
- [ ] Repeat above steps for a public workflow
- [ ] Verify featured section on Workflows dashboard

### Test Case 2: Admin Can Unfeature Items

- [ ] Click star button on a featured item
- [ ] Verify star turns gray and unfills
- [ ] Verify tooltip changes to "Add to featured"
- [ ] Navigate to dashboard
- [ ] Verify item NO LONGER appears in "Featured" section
- [ ] Verify item still appears in community/public section

### Test Case 3: Star Button Only on Public Items

- [ ] Navigate to a private agent you own
- [ ] Verify star button does NOT appear
- [ ] Change agent visibility to public
- [ ] Verify star button NOW appears

### Test Case 4: Featured Section Behavior

**Empty State**:
- [ ] Unfeature all items
- [ ] Navigate to dashboard
- [ ] Verify "No featured items yet" message (or similar)

**Multiple Featured Items**:
- [ ] Feature 3-5 items
- [ ] Navigate to dashboard
- [ ] Verify all featured items appear
- [ ] Verify newest items appear first (or expected sort order)

**Mixed Public and Featured**:
- [ ] Verify featured items ALSO appear in community section
- [ ] Verify they're not duplicated
- [ ] Verify they have special badge ("⭐ Featured" or similar)

### Test Case 5: Non-Admin Cannot Access Feature

**Logout and login as regular user** (or use incognito):
- [ ] Navigate to a public agent
- [ ] Verify star button does NOT appear
- [ ] Navigate to Agents dashboard
- [ ] Verify featured section shows featured items (read-only)
- [ ] Try to manually call API: `PATCH /api/agent/[id]/featured`
  - [ ] Verify 403 error
  - [ ] Verify error message: "Only admins can feature agents"

### Test Case 6: Loading States

- [ ] Click star button
- [ ] Verify loading spinner appears briefly
- [ ] Verify UI doesn't freeze
- [ ] Verify star toggles after API responds

### Test Case 7: Error States

**Network Error**:
- [ ] Disconnect internet
- [ ] Click star button
- [ ] Verify error toast/message appears
- [ ] Verify star returns to previous state (optimistic update reverts)

**API Error (simulate)**:
- [ ] Feature an agent
- [ ] Manually set agent visibility to private in database
- [ ] Try to unfeature from UI
- [ ] Verify error message appears
- [ ] (Feature shouldn't work on private items)

### Test Case 8: Responsive Design

- [ ] Resize browser to mobile width
- [ ] Verify star button still visible and clickable
- [ ] Verify featured sections stack correctly on mobile
- [ ] Verify cards don't break layout

### Test Case 9: Accessibility

- [ ] Use keyboard to navigate to star button (Tab key)
- [ ] Press Enter or Space to toggle
- [ ] Verify focus ring visible
- [ ] Use screen reader (if available)
  - [ ] Verify star button has proper aria-label
  - [ ] Verify state change is announced ("Featured" / "Not featured")

### Test Case 10: Performance

- [ ] Feature 20+ items
- [ ] Navigate to dashboard
- [ ] Verify page loads quickly (no lag)
- [ ] Open browser DevTools → Network tab
- [ ] Verify no duplicate API calls
- [ ] Verify no N+1 query issues

---

## Test Data Setup

**Seed script** (optional, for automated testing):
```sql
-- Create admin user
INSERT INTO "user" (id, email, role) VALUES
  ('admin-1', 'admin@test.com', 'admin');

-- Create regular user
INSERT INTO "user" (id, email, role) VALUES
  ('user-1', 'user@test.com', 'editor');

-- Create public agents
INSERT INTO "agent" (id, name, user_id, visibility, is_featured) VALUES
  ('agent-1', 'Public Agent 1', 'user-1', 'public', false),
  ('agent-2', 'Public Agent 2', 'user-1', 'public', false),
  ('agent-3', 'Featured Agent', 'user-1', 'public', true);

-- Create private agent
INSERT INTO "agent" (id, name, user_id, visibility, is_featured) VALUES
  ('agent-4', 'Private Agent', 'user-1', 'private', false);

-- Repeat for MCP servers and workflows
```

---

## Regression Testing

After completing feature, verify no existing functionality broke:

- [ ] Can still create agents/MCP/workflows
- [ ] Can still update visibility (public/private/readonly)
- [ ] Can still bookmark items
- [ ] Can still delete items
- [ ] Can still search/filter items
- [ ] Authentication still works
- [ ] Permission system still enforces roles correctly

---

## CI/CD Integration

**On Pull Request**:
- [ ] Run all API unit tests
- [ ] Check TypeScript compilation
- [ ] Check lint/format
- [ ] Verify no console errors in production build

**Manual verification required before merge**:
- [ ] Manual testing checklist completed
- [ ] Screenshots/GIF added to PR
- [ ] Migration tested on staging database

---

## Test Coverage Goals

- **API Endpoints**: 100% (all success/error paths)
- **UI Components**: Manual testing (visual verification)
- **Integration**: End-to-end flow tested manually

**Tools**:
- Jest / Vitest for unit tests
- React Testing Library for component tests (optional)
- Manual testing for UX validation

---

## Known Limitations

1. **No E2E tests**: Feature is admin-only, manual testing sufficient
2. **No load testing**: Featured filtering should be fast, but not stress-tested
3. **No analytics**: No tracking of feature usage (future enhancement)

---

## Success Criteria

All tests pass, and feature meets these acceptance criteria:
- ✅ Only admins see featured toggle
- ✅ Only public items can be featured
- ✅ Featured items appear in dedicated section
- ✅ UI provides clear feedback
- ✅ No performance degradation
- ✅ No accessibility issues
- ✅ No breaking changes to existing features

**Ready to merge when**: All checkboxes ticked, PR approved, CI green
