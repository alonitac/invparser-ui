import { Invoice, UploadResponse } from './types';

const API_BASE_URL = 'http://localhost:8080';

export async function uploadInvoice(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload invoice');
  }

  return response.json();
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const response = await fetch(`${API_BASE_URL}/invoice/${invoiceId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch invoice');
  }

  return response.json();
}

export async function getInvoicesByVendor(vendorName: string): Promise<Invoice[]> {
  const response = await fetch(`${API_BASE_URL}/invoices/vendor/${vendorName}`);

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return response.json();
}

// Mock function to get all invoices (since the API doesn't have this endpoint)
export async function getAllInvoices(): Promise<Invoice[]> {
  // This would need to be implemented on the backend
  // For now, return an empty array or cached invoices from localStorage
  const cached = localStorage.getItem('invoices');
  return cached ? JSON.parse(cached) : [];
}

export function cacheInvoice(invoice: Invoice) {
  const cached = localStorage.getItem('invoices');
  const invoices: Invoice[] = cached ? JSON.parse(cached) : [];
  
  const existingIndex = invoices.findIndex(inv => inv.InvoiceId === invoice.InvoiceId);
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  localStorage.setItem('invoices', JSON.stringify(invoices));
}
