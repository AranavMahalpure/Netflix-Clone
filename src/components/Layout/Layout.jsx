// src/components/Layout/Layout.jsx
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}