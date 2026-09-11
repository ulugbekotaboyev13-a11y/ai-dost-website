import "./globals.css";

export const metadata = {
  title: "AI Dost — bepul sun'iy intellekt yordamchisi",
  description: "Matn bilan suhbatlashing va rasmlar yarating — bepul, ro'yxatdan o'tmasdan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
    }
