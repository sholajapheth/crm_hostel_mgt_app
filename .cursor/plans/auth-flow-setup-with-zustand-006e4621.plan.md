<!-- 006e4621-5845-477d-960a-dfed57f1312d 55eca95f-76f3-40e7-bab4-4f1e1be50ee5 -->
# Implement React Router for Route Management

## Overview

Replace the current conditional rendering navigation system with React Router to enable proper URL-based routing, browser navigation support, and route protection.

## Implementation Steps

### 1. Install React Router DOM

- Install `react-router-dom` as a dependency
- Version: latest stable (v6.x)

### 2. Create Route Configuration (`src/lib/routes.tsx` or `src/routes.tsx`)

- Define route paths:
  - `/` - Login page (public)
  - `/dashboard` - Dashboard page (protected)
  - `/users` - Users page (protected)
  - `/hostel-allocation` - Hostel Allocation page (protected)
  - `/announcements` - Announcements page (protected)
  - `/settings` - Settings page (protected)
- Create route configuration object/array

### 3. Create Protected Route Component (`src/components/ProtectedRoute.tsx`)

- Wrapper component that checks authentication
- Redirects to `/` (login) if not authenticated
- Shows loading state while checking auth
- Renders children if authenticated

### 4. Refactor App.tsx

- Wrap app with `BrowserRouter`
- Set up route structure:
  - Public route: `/` → LoginPage
  - Protected routes: `/dashboard`, `/users`, etc. → DashboardLayout with nested routes
- Use `Routes` and `Route` components
- Add `Navigate` for default redirects

### 5. Refactor DashboardLayout

- Remove `currentPage` state and `renderPage()` function
- Use `Outlet` from React Router for nested routes
- Keep Sidebar and TopNav as layout components
- Update Sidebar to use `Link` or `useNavigate` instead of `onNavigate` callback

### 6. Update Sidebar Component

- Replace `onNavigate` prop with React Router navigation
- Use `NavLink` or `Link` components for navigation
- Use `useLocation` to determine active route
- Map route paths to page types

### 7. Create Route Layout Wrapper (`src/components/layouts/DashboardLayoutWrapper.tsx`)

- Wrapper that includes Sidebar and TopNav
- Uses `Outlet` to render child routes
- Maintains the same visual structure

### 8. Update Navigation Logic

- Replace state-based navigation with router navigation
- Use `useNavigate` hook for programmatic navigation
- Update all navigation calls to use router

### 9. Add Route Protection

- Wrap all dashboard routes with `ProtectedRoute`
- Ensure unauthenticated users are redirected to login
- Handle authentication state changes

### 10. Update Default Route Handling

- Redirect `/` to `/dashboard` if authenticated
- Redirect `/dashboard` to `/` if not authenticated
- Handle 404/not found routes

## Files to Create

- `src/components/ProtectedRoute.tsx` - Route protection wrapper
- `src/components/layouts/DashboardLayoutWrapper.tsx` - Layout wrapper with Sidebar/TopNav
- `src/routes.tsx` or `src/lib/routes.tsx` - Route configuration (optional)

## Files to Modify

- `src/App.tsx` - Add BrowserRouter and route structure
- `src/components/DashboardLayout.tsx` - Remove state, use Outlet
- `src/components/Sidebar.tsx` - Use NavLink/Link instead of callbacks
- `package.json` - Add react-router-dom dependency

## Route Structure

```
/ (public)
  └── LoginPage

/dashboard (protected)
  └── DashboardLayoutWrapper
      ├── Sidebar
      ├── TopNav
      └── Outlet (renders:)
          ├── /dashboard → DashboardPage
          ├── /users → UsersPage
          ├── /hostel-allocation → HostelAllocationPage
          ├── /announcements → AnnouncementsPage
          └── /settings → SettingsPage
```

## Key Benefits

- URL-based navigation (bookmarkable, shareable)
- Browser back/forward button support
- Proper route protection
- Better SEO (if needed in future)
- Cleaner code organization
- Standard React pattern

### To-dos

- [x] Create Zustand auth store with user data and auth state
- [x] Update HTTP client with new baseURL and 401/403 interceptors
- [x] Update auth API interface and mutations
- [x] Create useAuth hook
- [x] Refactor LoginPage to use API and auth store
- [x] Refactor App.tsx to use auth store
- [x] Update DashboardLayout, TopNav, and SettingsPage to use auth store