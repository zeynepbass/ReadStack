import "./globals.css";

export const metadata = {
  title: "ReadLog",
  description: "Okuduklarını ve okuyacaklarını tek yerde topla.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
