# Build a Next.js Invoice Parser Frontend

## Project Overview

Build a modern, Next.js application that serves as a frontend for an Invoice Parser API. The application should allow users to upload invoice documents and view extracted details.

## API Endpoint



The backend API is available at: `http://localhost:8080`

Current available endpoints:
- POST `/extract` - Upload an invoice file (multipart/form-data) and extract invoice details
- GET `/invoice/{invoice_id}` - Get details of a specific invoice by InvoiceId
- GET `/invoices/vendor/{vendor_name}` - Get invoices filtered by vendor name

## Technical Requirements

### Framework & Setup

- Use **Next.js** with App Router
- Use **TypeScript** for type safety
- Use **Tailwind CSS** for styling
- Use some UI library for components

### Pages & Navigation (Multi-Page Application)

Create the following pages with proper routing:

1. **Login Page** (`/login`)
   - Simple form with username and password fields
   - Dummy authentication: username: `admin`, password: `admin`
   - Store auth state in localStorage or session
   - Redirect to dashboard on successful login
   - **No real backend authentication needed** - this is just for UI testing demonstration

2. **Dashboard** (`/dashboard`)
   - Overview with statistics cards (e.g., total invoices, recent uploads)
   - Quick actions section
   - Navigation menu to other pages

3. **Upload Invoice Page** (`/upload`)
   - File upload area (drag-and-drop support)
   - File format validation (PDF, images)
   - Upload progress indicator with loading spinner
   - Success/error notifications

4. **Invoices List Page** (`/invoices`)
   - Table/grid view of all uploaded invoices
   - Filtering options (dropdown menus for status, date range)
   - Sorting capabilities
   - Pagination or infinite scroll (lazy loading)
   - Click on invoice to view details

5. **Invoice Details Page** (`/invoice/[id]`)
   - Display extracted invoice information
   - Editable fields with form validation
   - Download invoice option
   - Back navigation


### Styling Guidelines

TBD by you! go wild! 