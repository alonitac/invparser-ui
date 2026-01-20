'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Invoice, InvoiceItem } from '@/lib/types';
import { getInvoice, cacheInvoice } from '@/lib/api';
import { ArrowLeft, Edit, Save, Download, FileText, Calendar, DollarSign, Building } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        const data = await getInvoice(invoiceId);
        setInvoice(data);
        setEditedInvoice(data);
      } catch (error) {
        console.error('Failed to load invoice:', error);
        // Try to load from cache
        const cached = localStorage.getItem('invoices');
        if (cached) {
          const invoices: Invoice[] = JSON.parse(cached);
          const found = invoices.find((inv) => inv.InvoiceId === invoiceId);
          if (found) {
            setInvoice(found);
            setEditedInvoice(found);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && invoiceId) {
      loadInvoice();
    }
  }, [user, invoiceId]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    if (editedInvoice) {
      setInvoice(editedInvoice);
      cacheInvoice(editedInvoice);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedInvoice(invoice);
    setEditing(false);
  };

  const handleDownload = () => {
    if (!invoice) return;
    
    const dataStr = JSON.stringify(invoice, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoice.InvoiceId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateField = (field: keyof Invoice, value: any) => {
    if (editedInvoice) {
      setEditedInvoice({ ...editedInvoice, [field]: value });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The invoice with ID {invoiceId} could not be found.
            </p>
            <Link href="/invoices">
              <Button>Back to Invoices</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentInvoice = editing ? editedInvoice! : invoice;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/invoices">
          <Button variant="ghost" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Invoices</span>
          </Button>
        </Link>
        <div className="flex items-center space-x-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Invoice Details</CardTitle>
                <CardDescription className="mt-2">
                  Invoice ID: {currentInvoice.InvoiceId}
                </CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor Name</Label>
                {editing ? (
                  <Input
                    id="vendor"
                    value={currentInvoice.VendorName}
                    onChange={(e) => updateField('VendorName', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{currentInvoice.VendorName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceId">Invoice ID</Label>
                {editing ? (
                  <Input
                    id="invoiceId"
                    value={currentInvoice.InvoiceId}
                    onChange={(e) => updateField('InvoiceId', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{currentInvoice.InvoiceId}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Amount */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Dates & Amount</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                {editing ? (
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={currentInvoice.InvoiceDate}
                    onChange={(e) => updateField('InvoiceDate', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {new Date(currentInvoice.InvoiceDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                {editing ? (
                  <Input
                    id="dueDate"
                    type="date"
                    value={currentInvoice.DueDate}
                    onChange={(e) => updateField('DueDate', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {new Date(currentInvoice.DueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                {editing ? (
                  <Input
                    value={currentInvoice.Status || 'Pending'}
                    onChange={(e) => updateField('Status', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {currentInvoice.Status || 'Pending'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Financial Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                {editing ? (
                  <Input
                    id="currency"
                    value={currentInvoice.Currency}
                    onChange={(e) => updateField('Currency', e.target.value)}
                  />
                ) : (
                  <p className="text-lg font-medium">{currentInvoice.Currency}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                {editing ? (
                  <Input
                    id="totalAmount"
                    type="number"
                    value={currentInvoice.TotalAmount}
                    onChange={(e) => updateField('TotalAmount', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {currentInvoice.Currency} {currentInvoice.TotalAmount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        {currentInvoice.Items && currentInvoice.Items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Detailed breakdown of invoice items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentInvoice.Items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="font-medium mt-1">{item.Description}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Quantity</Label>
                        <p className="font-medium mt-1">{item.Quantity}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Amount</Label>
                        <p className="font-medium mt-1">
                          {currentInvoice.Currency} {item.Amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
