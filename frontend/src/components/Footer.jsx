import React from 'react'

const Footer = () => {
  return (
   <footer className="bg-[#FF6347] text-white px-6 md:px-16 lg:px-24 xl:px-32 pt-14 w-full">

  <div className="grid md:grid-cols-3 gap-10 border-b border-gray-700 pb-10">

    {/* About */}
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">StayEase</h2>
      <p className="text-sm leading-6">
        Find the best hotels and rooms at affordable prices. 
        Comfort, luxury and easy booking — all in one place.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:text-white transition">Home</a></li>
        <li><a href="/hotels" className="hover:text-white transition">Hotels</a></li>
        <li><a href="/rooms" className="hover:text-white transition">Rooms</a></li>
        <li><a href="/about" className="hover:text-white transition">About</a></li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Contact</h2>
      <p className="text-sm">📞 +91 9876543210</p>
      <p className="text-sm">✉ support@stayease.com</p>

      {/* Social Icons */}
      <div className="flex gap-4 mt-4 text-lg">
        <a href="#" className="hover:text-white">🌐</a>
        <a href="#" className="hover:text-white">📘</a>
        <a href="#" className="hover:text-white">📸</a>
      </div>
    </div>

  </div>

  {/* Bottom */}
  <div className="text-center text-xs text-gray-400 py-5">
    © 2026 StayEase. All Rights Reserved.
  </div>
</footer>

  );
}

export default Footer
