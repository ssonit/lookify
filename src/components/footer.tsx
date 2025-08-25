
import { Instagram, Mail, Send } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-sm text-muted-foreground">
        <p className="hidden sm:block">Gợi ý mua chỉ mang tính tham khảo. Hãy kiểm tra size chart và đánh giá shop trước khi đặt.</p>
        <div className="inline-flex items-center gap-4">
          <Link href="#" aria-label="Instagram" className="hover:text-foreground transition-colors"><Instagram className="w-5 h-5" /></Link>
          <Link href="#" aria-label="Telegram" className="hover:text-foreground transition-colors"><Send className="w-5 h-5" /></Link>
          <Link href="#" aria-label="Mail" className="hover:text-foreground transition-colors"><Mail className="w-5 h-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
