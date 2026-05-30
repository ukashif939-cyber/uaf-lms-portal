"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CreditCard, Banknote } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function FeesPage() {
    type Voucher = { id: string; title: string; amount: number; status: string; dueDate: string };
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFees = async () => {
            try {
                setError("");
                const data = await apiFetch("/api/student/fees");
                setVouchers(Array.isArray(data) ? data.map((f) => ({
                    ...f,
                    title: `${f.type || "Fee"} (${f.voucherNo || f.id})`,
                    status: (f.status || "").toString().charAt(0).toUpperCase() + (f.status || "").toString().slice(1).toLowerCase(),
                    dueDate: f.dueDate ? new Date(f.dueDate).toISOString().slice(0, 10) : "-"
                })) : []);
            } catch {
                setError("Unable to load fee vouchers.");
            }
        };
        loadFees();
    }, []);

    const downloadVoucher = (voucher: Voucher) => {
        const content = `Voucher: ${voucher.title}\nAmount: Rs. ${voucher.amount}\nStatus: ${voucher.status}\nDue Date: ${voucher.dueDate}`;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${voucher.id || "voucher"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-uaf-green">Fee Vouchers</h1>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vouchers.map((voucher) => (
                    <Card key={voucher.id} className="glass-panel hover:shadow-lg transition-all relative overflow-hidden">
                        {/* Status Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${voucher.status === 'Paid' ? 'bg-uaf-green' : 'bg-uaf-accent'}`}></div>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg text-uaf-dark">{voucher.title}</CardTitle>
                            {voucher.status === 'Paid' ? <Banknote className="text-uaf-green" /> : <CreditCard className="text-uaf-accent" />}
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1 mb-4">
                                <span className="text-3xl font-bold text-gray-800">Rs. {voucher.amount.toLocaleString()}</span>
                                <span className="text-sm text-gray-500">Due: {voucher.dueDate}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mr-auto ${voucher.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {voucher.status}
                                </span>

                                <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadVoucher(voucher)}>
                                    <Download size={14} /> Voucher
                                </Button>
                                {voucher.status === 'Pending' && (
                                    <Button size="sm" className="bg-uaf-green hover:bg-green-800 text-white" onClick={() => alert("Online payment gateway will be integrated next.")}>
                                        Pay Now
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
