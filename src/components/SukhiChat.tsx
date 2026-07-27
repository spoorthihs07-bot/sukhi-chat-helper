import { useEffect, useRef, useState } from "react";

type Size = { label: string; price: string; value: string };
type Payment = "UPI Payment" | "Cash on Delivery";

type Msg = {
  from: "bot" | "user";
  text: string;
};

const SIZES: Size[] = [
  { label: "🫙 500 ml – ₹199", value: "500 ml", price: "₹199" },
  { label: "🫙 1 L – ₹399", value: "1 L", price: "₹399" },
  { label: "🫙 5 L – ₹1995", value: "5 L", price: "₹1995" },
];

type Step =
  | "menu"
  | "size"
  | "quantity"
  | "name"
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
    setName("");
    setPayment(null);
    setOrderId("");
    setInput("");
  }

  function openChat() {
    resetToWelcome();
    setOpen(true);
  }

  // Listen for global "open chat" events dispatched from Order Now buttons
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
      pushBot(`Thanks, ${val}! 💚\n\nWhat's your delivery address?`);
      setStep("address");
    } else if (step === "address") {
      setAddress(val);
      pushBot("Perfect! 🏡\n\nHow would you like to pay?");
      setStep("payment");
    }
  }

  function choosePayment(p: Payment) {
    setPayment(p);
    pushUser(p === "UPI Payment" ? "💳 UPI Payment" : "💵 Cash on Delivery");
    const id = "CNO-" + Date.now().toString(36).toUpperCase().slice(-6);
    setOrderId(id);

    if (p === "UPI Payment") {
      pushBot(
        `Thank you, ${name}! 💚\n\nYour order has been received successfully.\n\nOrder ID: ${id}\n\nOpening WhatsApp now with your payment details…`
      );
      // Open WhatsApp automatically only for UPI
      setTimeout(() => {
        window.open(whatsappUrl(id, p), "_blank", "noopener,noreferrer");
      }, 600);
    } else {
      pushBot(
        `Thank you, ${name}! 💚\n\nYour order has been received successfully.\n\nOrder ID: ${id}\n\nWe'll contact you shortly to confirm your Cash on Delivery order. 📦`
      );
    }
    setStep("done");
  }

  function whatsappUrl(id: string, p: Payment) {
    const text = `Hello! 👋\nI'd like to place an order.\n\nOrder ID: ${id}\nName: ${name}\nProduct: Cold Pressed Groundnut Oil\nSize: ${size?.value}\nQuantity: ${quantity}\nDelivery Address: ${address}\nPayment Method: ${p}\n\n${
      p === "UPI Payment"
        ? "If Payment Method is UPI, I will wait for your payment details before making the payment."
        : ""
    }`;
    return `https://wa.me/919980247775?text=${encodeURIComponent(text)}`;
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={openChat}
          className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-3 text-white shadow-2xl transition-transform hover:scale-105"
          style={{ animation: "sukhi-pulse 2.4s ease-in-out infinite" }}
          aria-label="Chat with Sukhi"
        >
          <span className="text-xl">🌻</span>
          <span className="font-semibold text-sm sm:text-base">Chat with Sukhi</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[9999] sm:inset-auto sm:bottom-5 sm:right-5">
          <div className="mx-auto flex h-[90vh] max-h-[640px] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[600px] sm:w-[380px] sm:rounded-2xl border border-amber-100">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-lg">
                  🌻
                </div>
                <div>
                  <div className="font-semibold leading-tight">Sukhi</div>
                  <div className="text-xs opacity-90">Cold Natural Organics</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetToWelcome}
                  className="rounded p-1 text-xs hover:bg-white/20"
                  title="Restart chat"
                >
                  ↻
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-lg hover:bg-white/20"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-amber-50/40 px-3 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
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
              <div className="flex flex-wrap gap-2 pt-1">
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
                {step === "payment" && (
                  <>
                    <QuickBtn onClick={() => choosePayment("UPI Payment")}>
                      💳 UPI Payment
                    </QuickBtn>
                    <QuickBtn onClick={() => choosePayment("Cash on Delivery")}>
                      💵 Cash on Delivery
                    </QuickBtn>
                  </>
                )}
                {step === "done" && payment === "UPI Payment" && (
                  <a
                    href={whatsappUrl(orderId, "UPI Payment")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-green-500 px-4 py-3 text-center font-semibold text-white shadow-md transition hover:bg-green-600"
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
              <div className="flex items-center gap-2 border-t bg-white p-2">
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
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-amber-400"
                />
                <button
                  onClick={submitText}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
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
      className="rounded-full border border-amber-300 bg-white px-3.5 py-2 text-sm font-medium text-amber-800 shadow-sm transition hover:bg-amber-100"
    >
      {children}
    </button>
  );
}
