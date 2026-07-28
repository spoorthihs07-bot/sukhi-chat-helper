import { useEffect, useRef, useState } from "react";

type Size = { label: string; price: string; value: string };
type Payment = "UPI Payment" | "Cash on Delivery";
type Delivery = "Home Delivery" | "Outlet Pickup";

type Msg = {
  from: "bot" | "user";
  text: string;
};

const SIZES: Size[] = [
  { label: "🫙 500 ml – ₹199", value: "500 ml", price: "₹199" },
  { label: "🫙 1 L – ₹399", value: "1 L", price: "₹399" },
  { label: "🫙 5 L – ₹1995", value: "5 L", price: "₹1995" },
];

const OUTLETS = [
  "JP Nagar 5th Phase, Bengaluru (Main Outlet)",
];

type Step =
  | "menu"
  | "size"
  | "quantity"
  | "name"
  | "delivery"
  | "outlet"
  | "address"
  | "payment"
  | "done"
  | "about";

const WELCOME =
  "Hi! 👋\n\nI'm Sukhi from Cold Natural Organics. 💚\n\nI'm here to help you.\n\nPlease choose an option.";

export default function SukhiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("menu");
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState("");
  const [address, setAddress] = useState("");
  const [outlet, setOutlet] = useState("");
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [name, setName] = useState("");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [orderId, setOrderId] = useState("");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function resetToWelcome() {
    setMessages([{ from: "bot", text: WELCOME }]);
    setStep("menu");
    setSize(null);
    setQuantity("");
    setAddress("");
    setOutlet("");
    setDelivery(null);
    setName("");
    setPayment(null);
    setOrderId("");
    setInput("");
  }

  function openChat() {
    resetToWelcome();
    setOpen(true);
  }

  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener("sukhi:open", handler);
    return () => window.removeEventListener("sukhi:open", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    if (open && needsTextInput()) inputRef.current?.focus();
  }, [step, open]);

  function pushBot(text: string) {
    setMessages((m) => [...m, { from: "bot", text }]);
  }
  function pushUser(text: string) {
    setMessages((m) => [...m, { from: "user", text }]);
  }

  function needsTextInput() {
    return step === "quantity" || step === "address" || step === "name";
  }

  function handleMenu(choice: "order" | "about" | "contact") {
    if (choice === "order") {
      pushUser("🛒 Place an Order");
      pushBot(
        "That's wonderful! 😊\n\n✨ We're currently sharing our special launch offer.\n\nPlease choose your preferred size."
      );
      setStep("size");
    } else if (choice === "about") {
      pushUser("🌿 About Our Oil");
      pushBot(
        "Our Cold Pressed Groundnut Oil is 100% natural, extracted the traditional way — no heat, no chemicals. 🌻\n\nJust pure, wholesome goodness straight from farm to your kitchen. 💚"
      );
      setStep("about");
    } else {
      pushUser("📞 Contact Us");
      pushBot(
        "You can reach us at:\n\n📞 +91 9980247775\n📍 JP Nagar 5th Phase, Bengaluru — 560078\n\nWe'd love to hear from you! 💚"
      );
      setStep("about");
    }
  }

  function chooseSize(s: Size) {
    setSize(s);
    pushUser(s.label);
    pushBot("Lovely choice! 🌻\n\nHow many bottles would you like?");
    setStep("quantity");
  }

  function submitText() {
    const val = input.trim();
    if (!val) return;
    pushUser(val);
    setInput("");
    if (step === "quantity") {
      setQuantity(val);
      pushBot("Got it! 📦\n\nMay I know your name?");
      setStep("name");
    } else if (step === "name") {
      setName(val);
      pushBot(`Thanks, ${val}! 💚\n\nHow would you like to receive your order?`);
      setStep("delivery");
    } else if (step === "address") {
      setAddress(val);
      pushBot("Perfect! 🏡\n\nHow would you like to pay?");
      setStep("payment");
    }
  }

  function chooseDelivery(d: Delivery) {
    setDelivery(d);
    pushUser(d === "Home Delivery" ? "🚚 Home Delivery" : "🏬 Outlet Pickup");
    if (d === "Home Delivery") {
      pushBot("Great! 🚚\n\nWhat's your delivery address?");
      setStep("address");
    } else {
      pushBot("Wonderful! 🏬\n\nPlease choose your pickup outlet.");
      setStep("outlet");
    }
  }

  function chooseOutlet(o: string) {
    setOutlet(o);
    pushUser("📍 " + o);
    pushBot("Perfect! 🏬\n\nHow would you like to pay?");
    setStep("payment");
  }

  function choosePayment(p: Payment) {
    setPayment(p);
    pushUser(p === "UPI Payment" ? "💳 UPI Payment" : "💵 Cash on Delivery");
    const id = "CNO-" + Date.now().toString(36).toUpperCase().slice(-6);
    setOrderId(id);

    pushBot(
      `Thank you, ${name}! 💚\n\nYour order has been received successfully.\n\nOrder ID: ${id}\n\nOpening WhatsApp now with your order details…`
    );
    setTimeout(() => {
      window.open(whatsappUrl(id, p, delivery, p === "Home Delivery" ? address : outlet), "_blank", "noopener,noreferrer");
    }, 600);
    setStep("done");
  }

  function whatsappUrl(id: string, p: Payment, d: Delivery | null, loc: string) {
    const isPickup = d === "Outlet Pickup";
    const text = `Hello! 👋\nI'd like to place an order.\n\nOrder ID: ${id}\nName: ${name}\nProduct: Cold Pressed Groundnut Oil\nSize: ${size?.value}\nQuantity: ${quantity}\nOrder Type: ${d ?? ""}\n${isPickup ? "Pickup Outlet" : "Delivery Address"}: ${loc}\nPayment Method: ${p}\n\n${
      p === "UPI Payment"
        ? "Please share the UPI payment details. I will complete the payment and confirm."
        : "I will pay by Cash on Delivery."
    }`;
    return `https://wa.me/919980247775?text=${encodeURIComponent(text)}`;
  }

  return (
    <>
      {!open && (
        <button
          onClick={openChat}
          className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 text-white shadow-2xl transition-transform hover:scale-105"
          style={{ animation: "sukhi-pulse 2.4s ease-in-out infinite" }}
          aria-label="Chat with Sukhi"
        >
          <span className="text-xl">🌻</span>
          <span className="font-semibold text-base">Chat with Sukhi</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[9999] flex items-stretch justify-center bg-black/40 sm:p-6">
          <div className="mx-auto flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-full sm:max-w-2xl sm:rounded-2xl border border-amber-100">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20 text-2xl">
                  🌻
                </div>
                <div>
                  <div className="font-semibold leading-tight text-lg">Sukhi</div>
                  <div className="text-sm opacity-90">Cold Natural Organics</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetToWelcome}
                  className="rounded p-2 text-base hover:bg-white/20"
                  title="Restart chat"
                >
                  ↻
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-2 text-xl hover:bg-white/20"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto bg-amber-50/40 px-4 py-5"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-[16px] leading-relaxed shadow-sm ${
                      m.from === "user"
                        ? "rounded-br-sm bg-amber-500 text-white"
                        : "rounded-bl-sm bg-white text-gray-800"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Quick reply buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {step === "menu" && (
                  <>
                    <QuickBtn onClick={() => handleMenu("order")}>🛒 Place an Order</QuickBtn>
                    <QuickBtn onClick={() => handleMenu("about")}>🌿 About Our Oil</QuickBtn>
                    <QuickBtn onClick={() => handleMenu("contact")}>📞 Contact Us</QuickBtn>
                  </>
                )}
                {step === "size" &&
                  SIZES.map((s) => (
                    <QuickBtn key={s.value} onClick={() => chooseSize(s)}>
                      {s.label}
                    </QuickBtn>
                  ))}
                {step === "delivery" && (
                  <>
                    <QuickBtn onClick={() => chooseDelivery("Home Delivery")}>🚚 Home Delivery</QuickBtn>
                    <QuickBtn onClick={() => chooseDelivery("Outlet Pickup")}>🏬 Outlet Pickup</QuickBtn>
                  </>
                )}
                {step === "outlet" &&
                  OUTLETS.map((o) => (
                    <QuickBtn key={o} onClick={() => chooseOutlet(o)}>
                      📍 {o}
                    </QuickBtn>
                  ))}
                {step === "payment" && (
                  <>
                    <QuickBtn onClick={() => choosePayment("Cash on Delivery")}>
                      💵 Cash on Delivery
                    </QuickBtn>
                    <QuickBtn onClick={() => choosePayment("UPI Payment")}>
                      💳 UPI Payment
                    </QuickBtn>
                  </>
                )}
                {step === "done" && payment && (
                  <a
                    href={whatsappUrl(orderId, payment, delivery, delivery === "Home Delivery" ? address : outlet)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-green-500 px-4 py-3.5 text-center text-base font-semibold text-white shadow-md transition hover:bg-green-600"
                  >
                    📱 Open WhatsApp Again
                  </a>
                )}
                {step === "about" && (
                  <>
                    <QuickBtn onClick={() => handleMenu("order")}>🛒 Place an Order</QuickBtn>
                    <QuickBtn onClick={resetToWelcome}>↩︎ Back to Menu</QuickBtn>
                  </>
                )}
              </div>
            </div>

            {/* Input */}
            {needsTextInput() && (
              <div className="flex items-center gap-2 border-t bg-white p-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitText()}
                  placeholder={
                    step === "quantity"
                      ? "e.g. 2"
                      : step === "address"
                        ? "Your delivery address"
                        : "Your name"
                  }
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-3 text-base outline-none focus:border-amber-400"
                />
                <button
                  onClick={submitText}
                  className="rounded-full bg-amber-500 px-5 py-3 text-base font-semibold text-white hover:bg-amber-600"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes sukhi-pulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 10px 25px -5px rgba(245,158,11,0.5); }
          50% { transform: translateY(-4px); box-shadow: 0 18px 30px -5px rgba(245,158,11,0.55); }
        }
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 80px; }
      `}</style>
    </>
  );
}

function QuickBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-amber-300 bg-white px-4 py-2.5 text-[15px] font-medium text-amber-800 shadow-sm transition hover:bg-amber-100"
    >
      {children}
    </button>
  );
}
