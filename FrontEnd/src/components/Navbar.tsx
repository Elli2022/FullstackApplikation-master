// src/components/Navbar.tsx
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md fixed top-4">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/register" className="hover:text-gray-300">
            Register
          </Link>
          <Link href="/signin" className="hover:text-gray-300">
            Sign In
          </Link>
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
