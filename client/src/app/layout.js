import "./globals.css";

export const metadata = {
  title: "ReadLog",
  description: "Okuduklarını ve okuyacaklarını tek yerde topla.",
  icons: {
    icon: "/assets/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="m-0 bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
