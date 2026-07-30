import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CreateOrderInput = z.object({
  order_id: z.string(),
  name: z.string().min(1),
  size: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  delivery: z.enum(["Home Delivery", "Outlet Pickup"]),
  address: z.string().default(""),
  outlet: z.string().default(""),
  payment: z.enum(["UPI Payment", "Cash on Delivery"]),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => CreateOrderInput.parse(d))
  .handler(async ({ data }) => {
    const { adminClient } = await import("./supabase-ext.server");
    const supabase = adminClient();

    const location =
      data.delivery === "Home Delivery"
        ? data.address
        : `Pickup Outlet: ${data.outlet}`;

    const notes = [
      `Order ID: ${data.order_id}`,
      `Size: ${data.size}`,
      `Delivery: ${data.delivery}`,
      data.delivery === "Outlet Pickup" ? `Outlet: ${data.outlet}` : null,
      `Payment: ${data.payment}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { data: row, error } = await supabase
      .from("orders")
      .insert({
        customer_name: data.name,
        "phone no.": "",
        address: location,
        product: `Cold Pressed Groundnut Oil (${data.size})`,
        quantity: data.quantity,
        total_amount: data.price * data.quantity,
        payment_status: data.payment === "UPI Payment" ? "awaiting_upi" : "pending_cod",
        order_status: "new",
        notes,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id, order_id: data.order_id };
  });

export const listOrders = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { adminClient, verifyAdminToken } = await import("./supabase-ext.server");
    await verifyAdminToken(data.token);
    const { data: rows, error } = await adminClient()
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const updateOrder = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        token: z.string(),
        id: z.number(),
        order_status: z.string().optional(),
        payment_status: z.string().optional(),
        delivery_date: z.string().nullable().optional(),
        delivery_time: z.string().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { adminClient, verifyAdminToken } = await import("./supabase-ext.server");
    await verifyAdminToken(data.token);
    const patch: Record<string, unknown> = {};
    if (data.order_status !== undefined) patch.order_status = data.order_status;
    if (data.payment_status !== undefined) patch.payment_status = data.payment_status;
    if (data.delivery_date !== undefined) patch.delivery_date = data.delivery_date;
    if (data.delivery_time !== undefined) patch.delivery_time = data.delivery_time;
    const { error } = await adminClient().from("orders").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
