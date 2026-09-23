import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton({
  phone,
  message,
  label,
}: {
  phone: string;
  message: string;
  label: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-emerald-900/40 px-2.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition shrink-0"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
