import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/otb-logo.png" alt="OTB" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold">Online Tyre Bazaar</span>
            </div>
            <p className="text-[#9CA3AF] text-sm mb-4">
              Your trusted destination for quality tyres. New & used tyres for all vehicles with free installation
              across India.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center hover:bg-[#0D9488] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center hover:bg-[#0D9488] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center hover:bg-[#0D9488] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center hover:bg-[#0D9488] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              {/* <li>
                <Link href="/search" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Browse Tyres
                </Link>
              </li> */}
              {/* <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Sell Your Tyres
                </Link>
              </li> */}
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#9CA3AF] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[#9CA3AF]">
                <Phone className="w-4 h-4 text-[#0D9488]" />
                <span>1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-[#9CA3AF]">
                <Mail className="w-4 h-4 text-[#0D9488]" />
                <span>support@onlinetyrebazaar.in</span>
              </li>
              <li className="flex items-start gap-3 text-[#9CA3AF]">
                <MapPin className="w-4 h-4 text-[#0D9488] mt-0.5" />
                <span>2nd floor, No. 212/A, 1st Main Rd, Stage 2, Domlur, Bengaluru, Karnataka 560071</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#374151] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#9CA3AF] text-sm">© 2025 Online Tyre Bazaar. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-[#9CA3AF]">
            <span>🔒 Secure Payments</span>
            <span>🚚 Free Installation</span>
            <span>✅ Quality Assured</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
