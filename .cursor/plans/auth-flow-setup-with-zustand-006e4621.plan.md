<!-- 006e4621-5845-477d-960a-dfed57f1312d fde65e62-054d-4df6-9df9-6540ea5195a8 -->
# Replace RequestsPage Implementation with AdminUsers API

## Overview

The `RequestsPage` currently uses the `members` API, but it should use the `adminUsers` API's `useApplicants()` hook which queries `/api/v3/admin/users/` for ordinary users/registrants. The adminUsers API already exists and has all necessary endpoints.

## Changes Required

### 1. Update RequestsPage Component (`src/components/pages/UsersPage.tsx`)

- Replace `useMembers()` import with `useApplicants()` from `@/lib/api/adminUsers`
- Replace `Member` type with `Applicant` type
- Update state to use `ApplicantFilters` for server-side filtering (searchTerm, gender, zoneId, state)
- Replace client-side filtering with API filter parameters
- Update CSV download to use `fetchApplicantsCsv()` or `useDownloadApplicantsCsv()` hook
- Change `isLoading` to `isFetching` for consistency
- Update table columns to display: Name, Gender, Email, Zone, Fellowship, State, Hostel Assignment status
- Add loading skeletons using `isFetching` state
- Update filtered count display logic

### 2. Update Table Structure

- Add columns for: Zone, Fellowship, State, Hostel Assignment (with badge showing assigned/unassigned and hostel name if assigned)
- Remove Fellowship ID column (or keep if needed, but Applicant interface doesn't have fellowshipId directly)
- Update Badge styling for hostel assignment status

### 3. Enhance Filters

- Keep search and gender filters (now server-side)
- Add zoneId filter (if zones data is available)
- Add state filter (if states data is available)
- Update filter UI to show they're server-side filtered

### 4. CSV Download

- Replace client-side CSV generation with `fetchApplicantsCsv()` API call
- Handle blob response and trigger download
- Add loading state during CSV download

## Files to Modify

- `src/components/pages/UsersPage.tsx` - Main component update

## Notes

- The `adminUsers` API already exists with all required endpoints
- `useApplicants()` accepts optional `ApplicantFilters` parameter
- `Applicant` interface includes: id, name, gender, email, zone, fellowship, state, hostelAssigned, hostelName
- Server-side filtering will improve performance for large datasets

### To-dos

- [ ] Create Zustand auth store with user data and auth state
- [ ] Update HTTP client with new baseURL and 401/403 interceptors
- [ ] Update auth API interface and mutations
- [ ] Create useAuth hook
- [ ] Refactor LoginPage to use API and auth store
- [ ] Refactor App.tsx to use auth store
- [ ] Update DashboardLayout, TopNav, and SettingsPage to use auth store
- [ ] Update imports in RequestsPage to use useApplicants and Applicant type from adminUsers API
- [ ] Replace client-side filtering state with ApplicantFilters for server-side filtering
- [ ] Replace useMembers() with useApplicants() passing filter parameters, use isFetching instead of isLoading
- [ ] Update table columns to match Applicant interface (add Zone, Fellowship, State, Hostel Assignment columns)
- [ ] Replace client-side CSV generation with fetchApplicantsCsv() API call
- [ ] Add loading skeletons to RequestsPage using isFetching state