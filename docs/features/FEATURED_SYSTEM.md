# Feature: Featured System

## Summary

Add an admin-only "Featured" system that allows marking public agents, MCP servers, and workflows as featured, making them appear in a dedicated "Featured" section on their respective dashboards.

## User Story

**As an admin**, I want to mark high-quality public agents/MCP servers/workflows as "featured" so that **all users** can easily discover recommended, vetted resources.

**As a regular user**, I want to see featured items in a dedicated section so I can quickly find trusted, admin-recommended resources without searching through all public items.

## Current Behavior

- Public agents/MCP/workflows appear in a generic "shared" or "community" list
- MCP dashboard has hardcoded RECOMMENDED_MCPS array (GitHub, Notion, Linear, etc.)
- No way for admins to curate or highlight quality community contributions

## Proposed Behavior

### For Admins
1. When viewing a public agent/MCP/workflow, see a **star icon** next to visibility controls
2. Click star to toggle featured status (yellow when featured)
3. Featured toggle only appears for:
   - Users with admin role
   - Items with public visibility
4. Clear visual feedback (yellow star icon, filled when featured)

### For All Users
1. Each dashboard (Agents, MCP, Workflows) has a **"Featured"** section at the top
2. Featured section shows featured items with special styling (star badge)
3. Featured items also appear in regular public/community listings (not exclusive)
4. Featured items are sorted by creation date or popularity (to be decided)

## Technical Design

### Database Schema
- Add `is_featured` boolean column to:
  - `agent` table
  - `mcp_server` table
  - `workflow` table
- Default: `false`
- Indexed for filtering (performance)

### API Endpoints
Three new PATCH endpoints (admin-only):
- `PATCH /api/agent/[id]/featured` - Toggle agent featured status
- `PATCH /api/mcp/[id]/featured` - Toggle MCP server featured status
- `PATCH /api/workflow/[id]/featured` - Toggle workflow featured status

**Request body**: `{ "isFeatured": boolean }`

**Authorization**:
- Requires authenticated user
- Checks `canChangeVisibility*()` permission (admin-only via "share" permission)
- Only allows featuring public items

**Response**: Updated resource with new `isFeatured` status

### UI Components

**ShareableActions Enhancement**:
- Add star button between bookmark and edit buttons
- Props:
  - `isFeatured?: boolean` - Current featured state
  - `canFeature?: boolean` - Admin permission check
  - `onFeaturedToggle?: (isFeatured: boolean) => void` - Toggle handler
  - `isFeaturedToggleLoading?: boolean` - Loading state
- Button appearance:
  - Yellow star icon (filled when featured)
  - Tooltip: "Add to featured" / "Remove from featured"
  - Only visible when `canFeature && visibility === "public"`

**Dashboard Sections**:
Each dashboard (agents, MCP, workflows) gets a new "Featured" section:
```tsx
<section>
  <h2>Featured</h2>
  <div>
    {featuredItems.map(item => (
      <Card {...item} badge="⭐ Featured" />
    ))}
  </div>
</section>

<section>
  <h2>Community</h2>
  <div>
    {publicItems.map(item => <Card {...item} />)}
  </div>
</section>
```

### Permissions
- Uses existing "share" permission (admin-only)
- Permission functions:
  - `canChangeVisibilityAgent()` - Agent featuring
  - `canChangeVisibilityWorkflow()` - Workflow featuring
  - `canChangeVisibilityMCP()` - MCP featuring

### Security Constraints
- Only admins can toggle featured status
- Only public items can be featured (enforced in API)
- Regular users can only view featured items (read-only)

## Edge Cases

1. **Featured item becomes private**: Auto-unfeature? Or keep featured flag but hide from featured section?
   - **Decision**: Keep flag but don't show in featured section (simpler, preserves admin intent if re-publicized)

2. **Featured item is deleted**: No action needed (cascade delete handles it)

3. **User loses admin permissions**: Featured toggle disappears, existing featured items unchanged

4. **No featured items exist**: Show empty state with helpful message ("No featured items yet")

## Migration Path

1. Add `is_featured` column to all three tables (default: false)
2. No data migration needed (all start as not featured)
3. Admins manually feature items after deployment

## Testing Strategy

### Manual Testing (Primary)
1. **As admin**:
   - Create public agent/MCP/workflow
   - Verify star button appears
   - Click star → verify it turns yellow/filled
   - Check featured section → verify item appears
   - Click star again → verify item disappears from featured
   - Try featuring private item → verify button doesn't appear

2. **As regular user**:
   - Verify star button NOT visible on public items
   - Verify featured section shows featured items
   - Verify can't access featured API endpoints (403 error)

### Automated Testing (Secondary)
- Unit tests for 3 API endpoints:
  - Test admin can feature public items
  - Test non-admin gets 403
  - Test private items get 400 error
  - Test invalid IDs get 404

## Success Criteria

- ✅ Admin can toggle featured status on public items
- ✅ Featured items appear in dedicated section on each dashboard
- ✅ Non-admins cannot access featured toggle or API
- ✅ Private items cannot be featured
- ✅ UI is responsive and provides clear visual feedback
- ✅ No performance degradation (featured filtering is fast)

## Future Enhancements (Out of Scope)

- Analytics: Track featured item views/usage
- Auto-feature: Suggest items for featuring based on usage/ratings
- Featured order: Allow admins to manually sort featured items
- Featured categories: Group featured items by category/tag
- Featured expiry: Auto-unfeature after X days

## Open Questions

1. Should featured items appear in BOTH featured section AND community section?
   - **Recommended**: Yes, don't hide them from community (increases visibility)

2. How should featured items be sorted?
   - **Recommended**: Newest first (encourages fresh content)
   - **Alternative**: Most used/popular first (requires analytics)

3. Should we limit max number of featured items?
   - **Recommended**: No limit initially, monitor for abuse
   - **Alternative**: 10 max per category

---

**Status**: ✅ Infrastructure complete (DB, API, UI components)
**Next**: Wire up to cards, update dashboards, test
