# Implementation Phases: Featured System

**Project Type**: Feature Addition
**Stack**: BetterChat (Next.js + Cloudflare + PostgreSQL)
**Estimated Total**: 4-5 hours (~4-5 minutes human time with Claude Code)

---

## ✅ Phase 1: Database Schema & Migration (COMPLETED)
**Type**: Database
**Estimated**: 30 minutes
**Status**: ✅ Complete

**Tasks**:
- [x] Add `is_featured` boolean column to `agent` table
- [x] Add `is_featured` boolean column to `mcp_server` table
- [x] Add `is_featured` boolean column to `workflow` table
- [x] Generate migration with Drizzle Kit
- [x] Apply migration to local database

**Files Modified**:
- `src/lib/db/pg/schema.pg.ts` (3 table updates)
- `src/lib/db/migrations/pg/0015_slippery_silk_fever.sql` (generated migration)

**Verification**:
- [x] Migration applied successfully
- [x] Database has `is_featured` column on all 3 tables
- [x] Column defaults to `false`

---

## ✅ Phase 2: TypeScript Types & Schemas (COMPLETED)
**Type**: Infrastructure
**Estimated**: 30 minutes
**Status**: ✅ Complete

**Tasks**:
- [x] Add `isFeatured` to AgentUpdateSchema
- [x] Add `isFeatured` to AgentSummary type
- [x] Add `isFeatured` to MCPServerInfo type
- [x] Add `isFeatured` to DBWorkflow type
- [x] Add `isFeatured` to WorkflowSummary type

**Files Modified**:
- `src/types/agent.ts`
- `src/types/mcp.ts`
- `src/types/workflow.ts`

**Verification**:
- [x] TypeScript compiles without errors
- [x] All types include `isFeatured?: boolean`

---

## ✅ Phase 3: Permission Functions (COMPLETED)
**Type**: Infrastructure
**Estimated**: 15 minutes
**Status**: ✅ Complete

**Tasks**:
- [x] Add `canChangeVisibilityAgent()` function
- [x] Add `canChangeVisibilityWorkflow()` function
- [x] Verify `canChangeVisibilityMCP()` exists

**Files Modified**:
- `src/lib/auth/permissions.ts`

**Verification**:
- [x] All three permission functions exist
- [x] All use "share" permission (admin-only)
- [x] TypeScript compiles

---

## ✅ Phase 4: API Endpoints (COMPLETED)
**Type**: API
**Estimated**: 1 hour
**Status**: ✅ Complete

**Tasks**:
- [x] Create `/api/agent/[id]/featured/route.ts`
- [x] Create `/api/mcp/[id]/featured/route.ts`
- [x] Create `/api/workflow/[id]/featured/route.ts`
- [x] Implement admin-only checks
- [x] Implement public-only validation
- [x] Handle errors (401, 403, 404, 500)

**Files Created**:
- `src/app/api/agent/[id]/featured/route.ts`
- `src/app/api/mcp/[id]/featured/route.ts`
- `src/app/api/workflow/[id]/featured/route.ts`

**Verification** (to be done in Phase 7):
- [ ] Admin can PATCH featured status
- [ ] Non-admin gets 403
- [ ] Private items get 400
- [ ] Invalid IDs get 404

---

## ✅ Phase 5: ShareableActions UI Component (COMPLETED)
**Type**: UI
**Estimated**: 45 minutes
**Status**: ✅ Complete

**Tasks**:
- [x] Add Star icon import
- [x] Add featured props to interface
- [x] Add featured toggle button
- [x] Style button (yellow when featured)
- [x] Add loading state
- [x] Add tooltip

**Files Modified**:
- `src/components/shareable-actions.tsx`

**Verification** (to be done when wired up):
- [ ] Star button appears for admins on public items
- [ ] Button toggles between yellow (featured) and gray (not featured)
- [ ] Loading spinner appears during toggle
- [ ] Tooltip shows correct text

---

## 🔄 Phase 6: Repository Updates (IN PROGRESS)
**Type**: Infrastructure
**Estimated**: 30 minutes
**Status**: 🔄 Next

**Tasks**:
- [ ] Update agent repository to select `isFeatured` field
- [ ] Update MCP repository to select `isFeatured` field
- [ ] Update workflow repository to select `isFeatured` field
- [ ] Test repository queries return `isFeatured`

**Files to Modify**:
- `src/lib/db/pg/repositories/agent-repository.pg.ts`
- `src/lib/db/pg/repositories/mcp-repository.pg.ts` (or equivalent)
- `src/lib/db/pg/repositories/workflow-repository.pg.ts` (or equivalent)

**Verification**:
- [ ] Fetching agents returns `isFeatured` field
- [ ] Fetching MCP servers returns `isFeatured` field
- [ ] Fetching workflows returns `isFeatured` field
- [ ] TypeScript types match returned data

**Exit Criteria**: All repository queries include `isFeatured` in SELECT statements

---

## ⏳ Phase 7: Wire Up Featured Toggle to Cards
**Type**: UI Integration
**Estimated**: 1 hour
**Status**: ⏳ Pending

**Tasks**:
- [ ] Find MCP card component and add featured toggle props
- [ ] Find Agent card component and add featured toggle props
- [ ] Find Workflow card component and add featured toggle props
- [ ] Create mutation hooks for featured toggle API calls
- [ ] Wire up `canChangeVisibility*()` permission checks
- [ ] Handle optimistic updates (instant UI feedback)
- [ ] Handle error states

**Files to Modify**:
- MCP card component (find with grep/glob)
- Agent card component (find with grep/glob)
- Workflow card component (find with grep/glob)
- Create: `src/hooks/mutations/use-toggle-featured.ts` (or similar pattern)

**Verification**:
- [ ] Star button appears on public items (admin only)
- [ ] Clicking star toggles featured status
- [ ] UI updates optimistically
- [ ] API call succeeds
- [ ] Error states display correctly
- [ ] Non-admins don't see star button

**Exit Criteria**: Admins can toggle featured status from any card, UI updates correctly

---

## ⏳ Phase 8: Dashboard Featured Sections
**Type**: UI
**Estimated**: 1.5 hours
**Status**: ⏳ Pending

**Tasks**:
- [ ] Update MCP dashboard to show featured section
  - [ ] Filter featured MCP servers (isFeatured === true)
  - [ ] Render "Featured" section above community items
  - [ ] Add star badge to featured items
  - [ ] Handle empty state ("No featured items yet")
- [ ] Update Agents page to show featured section
  - [ ] Filter featured agents
  - [ ] Render featured section
  - [ ] Add star badge
  - [ ] Handle empty state
- [ ] Update Workflows page to show featured section
  - [ ] Filter featured workflows
  - [ ] Render featured section
  - [ ] Add star badge
  - [ ] Handle empty state

**Files to Modify**:
- `src/components/mcp-dashboard.tsx` (or equivalent)
- Agent dashboard component (find with grep/glob)
- Workflow dashboard component (find with grep/glob)

**Verification**:
- [ ] Featured sections appear on all 3 dashboards
- [ ] Featured items display correctly with star badge
- [ ] Featured items also appear in community/public sections
- [ ] Empty state shows when no featured items
- [ ] Sections are responsive on mobile

**Exit Criteria**: All dashboards show featured sections with correct filtering

---

## ⏳ Phase 9: Testing & Polish
**Type**: Testing
**Estimated**: 1 hour
**Status**: ⏳ Pending

**Tasks**:
- [ ] Write unit tests for 3 API endpoints
  - [ ] Test admin can feature public items (200)
  - [ ] Test non-admin gets 403
  - [ ] Test private items get 400
  - [ ] Test invalid IDs get 404
  - [ ] Test Zod validation errors get 400
- [ ] Manual testing as admin user
  - [ ] Toggle featured on agent
  - [ ] Toggle featured on MCP
  - [ ] Toggle featured on workflow
  - [ ] Verify featured sections update
- [ ] Manual testing as regular user
  - [ ] Verify star button NOT visible
  - [ ] Verify can view featured items
  - [ ] Verify API returns 403
- [ ] Performance check
  - [ ] Featured filtering is fast
  - [ ] No N+1 queries
- [ ] Accessibility check
  - [ ] Star button has proper aria-label
  - [ ] Keyboard navigation works
  - [ ] Screen reader announces state changes

**Files to Create**:
- `src/app/api/agent/[id]/featured/route.test.ts`
- `src/app/api/mcp/[id]/featured/route.test.ts`
- `src/app/api/workflow/[id]/featured/route.test.ts`

**Verification**:
- [ ] All tests pass
- [ ] Manual testing checklist complete
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Feature works in production build

**Exit Criteria**: All tests pass, manual testing complete, feature ready for PR

---

## 📝 Phase 10: Documentation & PR Submission
**Type**: Documentation
**Estimated**: 30 minutes
**Status**: ⏳ Pending

**Tasks**:
- [ ] Update CHANGELOG.md with feature description
- [ ] Create PR with clear description
  - [ ] Link to FEATURED_SYSTEM.md spec
  - [ ] Include screenshots/GIFs of feature
  - [ ] List breaking changes (none expected)
  - [ ] Note migration requirement (DB migration needed)
- [ ] Request review from maintainers
- [ ] Address review feedback

**Files to Create/Update**:
- `CHANGELOG.md` (add entry)
- GitHub PR description

**PR Checklist**:
- [ ] Title follows conventional commits: `feat: add admin featured system for agents/mcp/workflows`
- [ ] Description explains feature clearly
- [ ] Screenshots included
- [ ] Migration instructions included
- [ ] Tests included
- [ ] No merge conflicts
- [ ] CI passes

**Exit Criteria**: PR submitted and ready for review

---

## Summary

**Completed Phases**: 5/10 (50%)
**Remaining Work**: ~4 hours (~4 minutes human time)

**Current Status**: Infrastructure complete, need to wire up UI and test

**Next Action**: Start Phase 6 - Update repositories to return `isFeatured` field

**Deployment Notes**:
- Requires database migration on production
- No breaking changes to existing features
- Admin-only feature (low risk)
- Can be deployed incrementally (backend first, UI later)
