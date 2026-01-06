"use client";

import Link from "next/link";
import { useOrders } from "@/lib/firestore/orders/read";
import { deleteOrder } from "@/lib/firestore/orders/write";
import { useState } from "react";
import { Search, Filter, Download, Trash2, Eye, Package, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders();
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this order?")) return;
        setDeletingId(id);
        try {
            await deleteOrder({ id });
        } catch (err) {
            alert(err.message);
        }
        setDeletingId(null);
    };

    const handleExport = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            alert("No orders to export");
            return;
        }

        // Prepare CSV data
        const headers = ["Order ID", "Customer Name", "Email", "Phone", "Amount", "Status", "Payment Status", "Date"];
        const csvRows = [headers.join(",")];

        filteredOrders.forEach(order => {
            const row = [
                order.id,
                order.customerName || "",
                order.customerEmail || "",
                order.customerPhone || "",
                order.totalAmount || 0,
                order.orderStatus || "",
                order.paymentStatus || "",
                order.timestampCreate?.toDate().toLocaleString() || ""
            ];
            csvRows.push(row.map(field => `"${field}"`).join(","));
        });

        // Create and download CSV file
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Filter orders
    const filteredOrders = orders?.filter(order => {
        const matchesSearch = 
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.orderStatus === "pending").length || 0,
        completed: orders?.filter(o => o.orderStatus === "completed").length || 0,
        revenue: orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0
    };

    const getStatusColor = (status) => {
        switch(status) {
            case "completed": return "bg-green-50 text-green-700 border-green-200";
            case "cancelled": return "bg-red-50 text-red-700 border-red-200";
            case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
            default: return "bg-yellow-50 text-yellow-700 border-yellow-200";
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
                    <p className="text-gray-600">Track and manage all your customer orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                        icon={<Package className="w-6 h-6" />}
                        label="Total Orders"
                        value={stats.total}
                        color="blue"
                    />
                    <StatCard 
                        icon={<Clock className="w-6 h-6" />}
                        label="Pending"
                        value={stats.pending}
                        color="yellow"
                    />
                    <StatCard 
                        icon={<CheckCircle className="w-6 h-6" />}
                        label="Completed"
                        value={stats.completed}
                        color="green"
                    />
                    <StatCard 
                        icon={<DollarSign className="w-6 h-6" />}
                        label="Total Revenue"
                        value={`₹${stats.revenue.toLocaleString()}`}
                        color="purple"
                    />
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by customer name, email, or order ID..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <button 
                                onClick={handleExport}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                )}

                {/* No Orders */}
                {!isLoading && filteredOrders?.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter !== "all" 
                                ? "Try adjusting your filters" 
                                : "Orders will appear here once customers start placing them"}
                        </p>
                    </div>
                )}

                {/* Orders Table */}
                {!isLoading && filteredOrders?.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</span>
                                                    <span className="text-xs text-gray-500 font-mono">{order.id}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                                                    <span className="text-xs text-gray-500">{order.customerEmail}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                    {order.orderStatus === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                                                    {order.orderStatus}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.timestampCreate?.toDate().toLocaleDateString()}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        disabled={deletingId === order.id}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        yellow: "bg-yellow-50 text-yellow-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600"
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}