# Invoice Parser UI

A modern Next.js application for parsing and managing invoices.

## Features

- **Authentication**: Simple login system (demo credentials: admin/admin)
- **Dashboard**: Overview of invoice statistics and quick actions
- **Upload Invoices**: Drag-and-drop file upload with progress tracking
- **Invoice List**: Browse, search, filter, and sort invoices
- **Invoice Details**: View and edit detailed invoice information
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Tailwind
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
invparser-ui/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── invoices/          # Invoices list page
│   ├── invoice/[id]/      # Invoice details page
│   ├── upload/            # Upload page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # UI components (Button, Card, Input, etc.)
│   └── Navigation.tsx    # Navigation component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities
│   ├── api.ts           # API client functions
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
└── public/              # Static files
```

## API Endpoints

The application expects the following backend endpoints:

- `POST /extract` - Upload and extract invoice data
- `GET /invoice/{invoice_id}` - Get invoice details
- `GET /invoices/vendor/{vendor_name}` - Get invoices by vendor

## Default Credentials

- Username: `admin`
- Password: `admin`

## Features in Detail

### Dashboard
- Statistics cards showing total invoices, total amount, and recent uploads
- Quick action buttons for common tasks
- Recent invoices list

### Upload Invoice
- Drag-and-drop file upload
- File type validation (PDF, PNG, JPG, JPEG)
- File size validation (max 10MB)
- Upload progress indicator
- Success/error notifications

### Invoices List
- Searchable table of all invoices
- Sortable columns (Date, Amount, Vendor)
- Pagination support
- Click to view details

### Invoice Details
- View detailed invoice information
- Edit invoice fields
- Download invoice data as JSON
- Line items display

## License

MIT
