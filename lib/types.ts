export interface Invoice {
  InvoiceId: string;
  VendorName: string;
  InvoiceDate: string;
  DueDate: string;
  TotalAmount: number;
  Currency: string;
  Items?: InvoiceItem[];
  Status?: string;
}

export interface InvoiceItem {
  Description: string;
  Quantity: number;
  UnitPrice: number;
  Amount: number;
}

export interface UploadResponse {
  invoice_id: string;
  message: string;
  invoice: Invoice;
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}
