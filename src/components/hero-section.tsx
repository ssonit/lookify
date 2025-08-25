
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-24 bg-card border-b">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent py-2">
          Lookify
        </h1>
        <p className="mt-4 font-headline text-2xl md:text-4xl font-medium text-foreground">
          Nâng cấp phong cách – Nâng cấp chính mình
        </p>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-body text-muted-foreground">
          Khám phá các gợi ý trang phục được cá nhân hóa và khám phá các phong cách tuyển chọn để nâng tầm tủ quần áo và sự tự tin của bạn.
        </p>
        <Button size="lg" className="mt-8 text-body text-white" asChild>
          <Link href="/suggester" className="text-white">Khám phá ngay</Link>
        </Button>
      </div>
    </section>
  );
};
