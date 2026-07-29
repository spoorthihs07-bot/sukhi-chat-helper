import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminLogin, adminMe } from "@/lib/admin.functions";
import { listOrders, updateOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Sukhi Admin Dashboard" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const TOKEN_KEY = "sukhi_admin_token";

type Order = {
  id: number;
  created_at: string;
  customer_name: string | null;
  phone_no: string | null;
  address: string | null;
  product: string | null;
  quantity: number | null;
  total_amount: number | null;
  payment_status: string | null;
  order_status: string | null;
  notes: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
};

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const meFn = useServerFn(adminMe);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) {
      setReady(true);
      return;
    }
    meFn({ data: { token: t } })
      .then(() => setToken(t))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, [meFn]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FFF8E7] text-[#3B2A1A]">
        Loading…
      </div>
    );
  }

  if (!token) return <LoginForm onLogin={(t) => setToken(t)} />;
  return <Dashboard token={token} onLogout={() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }} />;
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const login = useServerFn(adminLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const s = await login({ data: { email, password } });
      localStorage.setItem(TOKEN_KEY, s.access_token);
      onLogin(s.access_token);
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#FFF8E7] px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
        <h1 className="text-2xl font-semibold text-[#3B2A1A] mb-1">Sukhi Admin</h1>
        <p className="text-sm text-[#3B2A1A]/70 mb-6">Sign in with your admin account.</p>
        <label className="block text-sm mb-2 text-[#3B2A1A]">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
          className="w-full rounded-lg border border-amber-200 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        <label className="block text-sm mb-2 text-[#3B2A1A]">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required
          className="w-full rounded-lg border border-amber-200 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400" />
        {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
        <button disabled={loading} className="w-full rounded-lg bg-[#D4AF37] hover:bg-[#c39f2f] text-white font-semibold py-2.5 transition disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/" className="block text-center mt-4 text-sm text-[#3B2A1A]/70 hover:underline">← Back to site</Link>
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const list = useServerFn(listOrders);
  const update = useServerFn(updateOrder);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "today" | "delivery">("all");
  const [err, setErr] = useState("");

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const rows = (await list({ data: { token } })) as Order[];
      setOrders(rows);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    if (tab === "today") {
      const today = new Date().toISOString().slice(0, 10);
      return orders.filter((o) => (o.created_at ?? "").slice(0, 10) === today);
    }
    if (tab === "delivery") {
      return orders.filter((o) => o.order_status !== "delivered" && o.order_status !== "cancelled");
    }
    return orders;
  }, [orders, tab]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => (o.created_at ?? "").slice(0, 10) === today);
    const pending = orders.filter((o) => o.order_status !== "delivered" && o.order_status !== "cancelled");
    const revenue = orders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0);
    return { total: orders.length, today: todayOrders.length, pending: pending.length, revenue };
  }, [orders]);

  async function setStatus(o: Order, order_status: string) {
    await update({ data: { token, id: o.id, order_status } });
    refresh();
  }
  async function setPayment(o: Order, payment_status: string) {
    await update({ data: { token, id: o.id, payment_status } });
    refresh();
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#3B2A1A]">
      <header className="bg-white border-b border-amber-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-semibold">Sukhi Admin</h1>
          <p className="text-xs opacity-70">Orders dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={refresh} className="rounded-md border border-amber-200 px-3 py-1.5 text-sm hover:bg-amber-50">Refresh</button>
          <button onClick={onLogout} className="rounded-md bg-[#3B2A1A] text-white px-3 py-1.5 text-sm">Sign out</button>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Total orders" value={stats.total} />
          <Stat label="Today" value={stats.today} />
          <Stat label="Pending delivery" value={stats.pending} />
          <Stat label="Revenue (₹)" value={stats.revenue.toFixed(0)} />
        </div>

        <div className="flex gap-2 mb-4">
          {(["all", "today", "delivery"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-sm border ${tab === t ? "bg-[#D4AF37] text-white border-[#D4AF37]" : "bg-white border-amber-200"}`}>
              {t === "all" ? "All" : t === "today" ? "Today" : "Pending delivery"}
            </button>
          ))}
        </div>

        {err && <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm">{err}</div>}

        {loading ? (
          <div className="p-8 text-center opacity-70">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center opacity-70 bg-white rounded-xl border border-amber-100">No orders here yet.</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((o) => (
              <div key={o.id} className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="font-semibold text-lg">{o.customer_name || "—"}</div>
                    <div className="text-xs opacity-70">
                      #{o.id} · {o.created_at ? new Date(o.created_at).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{Number(o.total_amount ?? 0).toFixed(0)}</div>
                    <div className="text-xs opacity-70">Qty: {o.quantity}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">{o.product}</div>
                {o.address && <div className="mt-1 text-sm opacity-80">📍 {o.address}</div>}
                {o.notes && (
                  <pre className="mt-2 text-xs bg-amber-50 rounded p-2 whitespace-pre-wrap font-sans opacity-90">{o.notes}</pre>
                )}
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <Badge label={`Order: ${o.order_status || "new"}`} />
                  <Badge label={`Payment: ${o.payment_status || "pending"}`} />
                  <div className="ml-auto flex flex-wrap gap-2">
                    <select
                      value={o.order_status ?? "new"}
                      onChange={(e) => setStatus(o, e.target.value)}
                      className="text-sm border border-amber-200 rounded px-2 py-1 bg-white"
                    >
                      {["new", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      value={o.payment_status ?? "pending"}
                      onChange={(e) => setPayment(o, e.target.value)}
                      className="text-sm border border-amber-200 rounded px-2 py-1 bg-white"
                    >
                      {["pending", "pending_cod", "awaiting_upi", "paid", "failed", "refunded"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white border border-amber-100 p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
function Badge({ label }: { label: string }) {
  return <span className="text-xs px-2 py-1 rounded-full bg-amber-50 border border-amber-200">{label}</span>;
}
