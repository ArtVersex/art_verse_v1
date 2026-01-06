"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrder } from "@/lib/firestore/orders/read";
import { updateOrder, removeOrderItem } from "@/lib/firestore/orders/write";
import { getProduct } from "@/lib/firestore/products/read";
import { ArrowLeft, Save, Package, CreditCard, Truck, User, MapPin, FileText, Trash2, Calendar, Phone, Mail } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyBilling = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  };

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerNotes: "",
    contactMethod: "",
    orderStatus: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "pending",
    paymentMethod: "",
    orderType: "",
    orderSource: "",
    currency: "",
    subtotal: 0,
    totalAmount: 0,
    billingAddress: emptyBilling,
    adminNotes: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrder(orderId);
      if (!data) {
        setLoading(false);
        return;
      }

      const itemsWithImages = await Promise.all(
        (data.items || []).map(async (item) => {
          if (!item.productId) return item;
          const product = await getProduct(item.productId);
          return {
            ...item,
            productImage: product?.featureImageUrl || "/placeholder.png",
          };
        })
      );

      const updatedOrder = { ...data, items: itemsWithImages };
      setOrder(updatedOrder);

      setForm({
        customerName: data.customerName || "",
        customerEmail: data.customerEmail || "",
        customerPhone: data.customerPhone || "",
        customerNotes: data.customerNotes || "",
        contactMethod: data.contactMethod || "",
        orderStatus: data.orderStatus || "pending",
        paymentStatus: data.paymentStatus || "pending",
        fulfillmentStatus: data.fulfillmentStatus || "pending",
        paymentMethod: data.paymentMethod || "",
        orderType: data.orderType || "",
        orderSource: data.orderSource || "",
        currency: data.currency || "",
        subtotal: data.subtotal || 0,
        totalAmount: data.totalAmount || 0,
        billingAddress: {
          ...emptyBilling,
          ...(data.billingAddress || {}),
        },
        adminNotes: data.adminNotes || "",
      });

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateOrder({ orderData: { id: orderId, ...form } });
      alert("Order updated successfully!");
    } catch (e) {
      alert(e.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h3>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{orderId.slice(0, 8)}</h1>
              <p className="text-sm text-gray-500 mt-1 font-mono">{orderId}</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Section icon={<Package />} title="Order Items">
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.productImage || "/placeholder.png"}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                      alt={item.productName}
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Total: ₹{item.totalPrice}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        if (!confirm("Remove this item?")) return;
                        await removeOrderItem({ orderId, productId: item.productId });
                        setOrder({
                          ...order,
                          items: order.items.filter((i) => i.productId !== item.productId),
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">₹{form.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Section>

            {/* Customer Information */}
            <Section icon={<User />} title="Customer Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Customer Name"
                  icon={<User className="w-4 h-4" />}
                  value={form.customerName}
                  onChange={(v) => setForm({ ...form, customerName: v })}
                />

                <InputField
                  label="Email"
                  icon={<Mail className="w-4 h-4" />}
                  value={form.customerEmail}
                  onChange={(v) => setForm({ ...form, customerEmail: v })}
                />

                <InputField
                  label="Phone"
                  icon={<Phone className="w-4 h-4" />}
                  value={form.customerPhone}
                  onChange={(v) => setForm({ ...form, customerPhone: v })}
                />

                <InputField
                  label="Preferred Contact"
                  value={form.contactMethod}
                  onChange={(v) => setForm({ ...form, contactMethod: v })}
                />
              </div>

              {form.customerNotes && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Customer Notes</p>
                  <p className="text-sm text-blue-700">{form.customerNotes}</p>
                </div>
              )}
            </Section>

            {/* Billing Address */}
            <Section icon={<MapPin />} title="Billing Address">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  value={form.billingAddress.firstName}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      billingAddress: { ...form.billingAddress, firstName: v },
                    })
                  }
                />

                <InputField
                  label="Last Name"
                  value={form.billingAddress.lastName}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      billingAddress: { ...form.billingAddress, lastName: v },
                    })
                  }
                />

                <div className="md:col-span-2">
                  <TextAreaField
                    label="Address"
                    value={form.billingAddress.address}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        billingAddress: { ...form.billingAddress, address: v },
                      })
                    }
                  />
                </div>

                <InputField
                  label="City"
                  value={form.billingAddress.city}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      billingAddress: { ...form.billingAddress, city: v },
                    })
                  }
                />

                <InputField
                  label="State"
                  value={form.billingAddress.state}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      billingAddress: { ...form.billingAddress, state: v },
                    })
                  }
                />

                <InputField
                  label="ZIP Code"
                  value={form.billingAddress.zipCode}
                  onChange={(v) =>
                    setForm({
                      ...form,
                      billingAddress: { ...form.billingAddress, zipCode: v },
                    })
                  }
                />
              </div>
            </Section>

            {/* Admin Notes */}
            <Section icon={<FileText />} title="Admin Notes">
              <TextAreaField
                rows={4}
                placeholder="Add internal notes about this order..."
                value={form.adminNotes}
                onChange={(v) => setForm({ ...form, adminNotes: v })}
              />
            </Section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Status */}
            <Section icon={<Package />} title="Order Status">
              <StatusSelect
                label="Order Status"
                value={form.orderStatus}
                options={["pending", "confirmed", "processing", "delivered", "cancelled"]}
                onChange={(v) => setForm({ ...form, orderStatus: v })}
              />
            </Section>

            {/* Payment Status */}
            <Section icon={<CreditCard />} title="Payment">
              <StatusSelect
                label="Payment Status"
                value={form.paymentStatus}
                options={["pending", "paid", "failed", "refunded"]}
                onChange={(v) => setForm({ ...form, paymentStatus: v })}
              />
            </Section>

            {/* Fulfillment Status */}
            <Section icon={<Truck />} title="Fulfillment">
              <StatusSelect
                label="Fulfillment Status"
                value={form.fulfillmentStatus}
                options={["pending", "packed", "shipped", "delivered"]}
                onChange={(v) => setForm({ ...form, fulfillmentStatus: v })}
              />
            </Section>

            {/* Order Timeline */}
            {order.timestampCreate && (
              <Section icon={<Calendar />} title="Timeline">
                <div className="space-y-3">
                  <TimelineItem
                    label="Order Created"
                    date={order.timestampCreate.toDate()}
                  />
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* Components */
function Section({ icon, title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-600">{icon}</div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${icon ? 'pl-10' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <textarea
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function StatusSelect({ label, value, onChange, options }) {
  const getStatusColor = (status) => {
    if (["completed", "paid", "delivered"].includes(status)) return "text-green-600 bg-green-50";
    if (["cancelled", "failed"].includes(status)) return "text-red-600 bg-red-50";
    if (["processing", "shipped", "packed"].includes(status)) return "text-blue-600 bg-blue-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
      <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </div>
    </div>
  );
}

function TimelineItem({ label, date }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{date.toLocaleString()}</p>
      </div>
    </div>
  );
}