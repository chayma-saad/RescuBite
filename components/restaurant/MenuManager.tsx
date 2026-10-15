"use client";
import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2, UtensilsCrossed } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  typicalPortions: number;
  costPerPortion: number;
  pricePerPortion: number;
  active: boolean;
}

interface MenuManagerProps {
  restaurantId: string;
  menuItems: MenuItem[];
}

function MenuItemCard({ item, onToggle, onDelete, onEdit }: {
  item: MenuItem;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItem) => void;
}) {
  const margin = ((item.pricePerPortion - item.costPerPortion) / item.pricePerPortion * 100).toFixed(0);
  return (
    <div className={`card p-5 transition-all ${!item.active ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>{item.name}</h3>
            {item.category && <span className="badge badge-gray">{item.category}</span>}
            {!item.active && <span className="badge badge-red">Inactive</span>}
          </div>
          {item.description && <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>}
          <div className="flex flex-wrap gap-4 text-xs">
            <span style={{ color: "var(--color-text-secondary)" }}>Cost: <strong style={{ color: "var(--color-text)" }}>{formatCurrency(item.costPerPortion)}</strong></span>
            <span style={{ color: "var(--color-text-secondary)" }}>Price: <strong style={{ color: "var(--color-primary)" }}>{formatCurrency(item.pricePerPortion)}</strong></span>
            <span style={{ color: "var(--color-text-secondary)" }}>Margin: <strong style={{ color: "#4A7C4E" }}>{margin}%</strong></span>
            <span style={{ color: "var(--color-text-secondary)" }}>Typical: <strong style={{ color: "var(--color-text)" }}>{item.typicalPortions} portions</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => onToggle(item.id, !item.active)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title={item.active ? "Deactivate" : "Activate"}>
            {item.active ? <ToggleRight size={18} style={{ color: "#4A7C4E" }} /> : <ToggleLeft size={18} style={{ color: "var(--color-text-secondary)" }} />}
          </button>
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Edit2 size={16} style={{ color: "var(--color-text-secondary)" }} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={16} style={{ color: "var(--color-danger)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItemForm({ item, onSave, onCancel, restaurantId }: {
  item?: MenuItem | null;
  onSave: (data: Omit<MenuItem, "id" | "active">) => void;
  onCancel: () => void;
  restaurantId: string;
}) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    category: item?.category ?? "",
    typicalPortions: item?.typicalPortions ?? 20,
    costPerPortion: item?.costPerPortion ?? 0,
    pricePerPortion: item?.pricePerPortion ?? 0,
  });

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.type === "number" ? parseFloat(e.target.value) : e.target.value }));
  };

  return (
    <div className="card p-6">
      <h3 className="font-bold mb-4" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>
        {item ? "Edit Menu Item" : "Add New Menu Item"}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Name *", field: "name", type: "text", placeholder: "e.g. Couscous Royal" },
          { label: "Category", field: "category", type: "text", placeholder: "e.g. Main, Starter, Dessert" },
          { label: "Cost per Portion (TND) *", field: "costPerPortion", type: "number", placeholder: "0.00" },
          { label: "Price per Portion (TND) *", field: "pricePerPortion", type: "number", placeholder: "0.00" },
          { label: "Typical Portions per Day", field: "typicalPortions", type: "number", placeholder: "20" },
        ].map((f2) => (
          <div key={f2.field}>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>{f2.label}</label>
            <input
              type={f2.type}
              value={(form as Record<string, unknown>)[f2.field] as string}
              onChange={f(f2.field)}
              placeholder={f2.placeholder}
              step={f2.type === "number" ? "0.01" : undefined}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)", background: "white" }}
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>Description</label>
          <textarea
            value={form.description}
            onChange={f("description")}
            rows={2}
            placeholder="Brief description of the dish..."
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)", background: "white" }}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={() => onSave(form)} className="btn-primary">
          {item ? "Save Changes" : "Add Item"}
        </button>
        <button onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </div>
  );
}

export function MenuManager({ restaurantId, menuItems: initial }: MenuManagerProps) {
  const [items, setItems] = useState<MenuItem[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function saveItem(data: Omit<MenuItem, "id" | "active">) {
    const url = editItem ? `/api/restaurant/menu/${editItem.id}` : "/api/restaurant/menu";
    const method = editItem ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, restaurantId }) });
    const result = await res.json();
    if (!res.ok) { setError(result.error); return; }
    if (editItem) {
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...data } : i));
    } else {
      setItems((prev) => [...prev, { ...data, id: result.id, active: true }]);
    }
    setShowForm(false);
    setEditItem(null);
  }

  async function toggleItem(id: string, active: boolean) {
    await fetch(`/api/restaurant/menu/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active }) });
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, active } : i));
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/restaurant/menu/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (showForm || editItem) {
    return <MenuItemForm item={editItem} onSave={saveItem} onCancel={() => { setShowForm(false); setEditItem(null); }} restaurantId={restaurantId} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{items.filter(i => i.active).length} active items</p>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} /> Add Item
        </button>
      </div>
      {error && <div className="p-3 rounded-lg text-sm" style={{ background: "#fde8e8", color: "var(--color-danger)" }}>{error}</div>}
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <UtensilsCrossed size={40} className="mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }} />
          <p className="font-medium mb-1" style={{ color: "var(--color-text)" }}>No menu items yet</p>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>Add your dishes to start getting AI-powered demand forecasts.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add First Item</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} onEdit={(i) => { setEditItem(i); setShowForm(false); }} />
          ))}
        </div>
      )}
    </div>
  );
}
