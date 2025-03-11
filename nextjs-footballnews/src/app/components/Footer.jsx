import React from "react";
import {
  FaFacebook,
  FaLine,
  FaEnvelope,
  FaPhone,
  FaCopyright,
  FaAngleUp,
} from "react-icons/fa";
import Link from "next/link";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h4 className="text-2xl font-bold mb-4 text-white">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaFacebook className="mr-3 text-blue-500" />
                <a
                  href="https://www.facebook.com/profile.php?id=your-facebook-id" // Replace with your Facebook profile link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  FB อศนี. ฯ
                </a>
              </li>
              <li className="flex items-center">
                <FaLine className="mr-3 text-green-500" />
                <a
                  href="https://line.me/ti/p/~asanee16" // Corrected Line link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  line: asanee16
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-yellow-500" />
                <a href="tel:0645275707" className="hover:text-white">
                  0645275707
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-red-500" />
                <a
                  href="mailto:kongthe65@gmail.com"
                  className="hover:text-white"
                >
                  kongthe65@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-2xl font-bold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup (Placeholder) */}
          <div>
            <h4 className="text-2xl font-bold mb-4 text-white">
              Subscribe to Our Newsletter
            </h4>
            <p className="mb-4">
              Stay updated with the latest football news and updates!
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-100"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright and Scroll to Top */}
        <div className="mt-1 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
          <p className="text-sm">
            <FaCopyright className="inline mr-1" />
            {new Date().getFullYear()} Football News. By.ASANEE RAMPHAI.
          </p>
          <button
            onClick={scrollToTop}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center mt-4 md:mt-0"
          >
            <FaAngleUp className="text-xl" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
