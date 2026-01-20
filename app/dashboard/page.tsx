'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/lib/types';
import { getAllInvoices } from '@/lib/api';
import { FileText, Upload, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    recentUploads: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await getAllInvoices();
      setInvoices(data);

      // Calculate stats
      const totalAmount = data.reduce((sum, inv) => sum + inv.TotalAmount, 0);
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 7);
      const recentUploads = data.filter(inv => {
        const invDate = new Date(inv.InvoiceDate);
        return invDate >= recentDate;
      }).length;

      setStats({
        totalInvoices: data.length,
        totalAmount,
        recentUploads,
      });
    };

    if (user) {
      loadInvoices();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      description: 'All uploaded invoices',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      description: 'Sum of all invoices',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: TrendingUp,
      description: 'Last 7 days',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your invoice data.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/upload">
            <Button className="w-full h-auto py-6 flex items-center justify-between" variant="outline">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Upload Invoice</div>
                  <div className="text-sm text-muted-foreground">Add a new invoice document</div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          <Link href="/invoices">
            <Button className="w-full h-auto py-6 flex items-center justify-between" variant="outline">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">View All Invoices</div>
                  <div className="text-sm text-muted-foreground">Browse and manage invoices</div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Your latest uploaded invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices uploaded yet</p>
              <Link href="/upload">
                <Button className="mt-4">Upload Your First Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.slice(0, 5).map((invoice) => (
                <Link key={invoice.InvoiceId} href={`/invoice/${invoice.InvoiceId}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{invoice.VendorName}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.InvoiceId}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {invoice.Currency} {invoice.TotalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.InvoiceDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {invoices.length > 5 && (
                <Link href="/invoices">
                  <Button variant="outline" className="w-full">
                    View All Invoices
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
