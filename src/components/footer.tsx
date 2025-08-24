export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex items-center justify-center h-16">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lookify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
