import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tighter">
              LUMINA <span className="text-pink-600">FASHION</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elevating your style with contemporary designs and timeless elegance. We bring you the finest fabrics and latest trends, crafted for the modern individual.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Shop</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/new-arrivals" className="hover:text-pink-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/dresses" className="hover:text-pink-500 transition-colors">Dresses</Link></li>
              <li><Link href="/tops" className="hover:text-pink-500 transition-colors">Tops & Blouses</Link></li>
              <li><Link href="/accessories" className="hover:text-pink-500 transition-colors">Accessories</Link></li>
              <li><Link href="/sale" className="hover:text-pink-500 transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Customer Care</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/profile" className="hover:text-pink-500 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-pink-500 transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-pink-500 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="hover:text-pink-500 transition-colors">Shipping Info</Link></li>
              <li><Link href="/faq" className="hover:text-pink-500 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-600 shrink-0" />
                <span>123 Fashion Avenue, <br />New York, NY 10012</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-600 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-600 shrink-0" />
                <span>support@luminafashion.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Lumina Fashion. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}