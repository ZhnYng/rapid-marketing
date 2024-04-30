"use client"

import { LogIn, Megaphone, Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav>
      <div className="hidden sm:block">
        <div className="flex flex-row items-center justify-between mt-8 mx-8">
          {/* Logo */}
          <div className="text-lg font-semibold flex justify-center items-center text-purple-500">
            <Megaphone />
            <h2 className='ms-2'>RapidMarketing</h2>
          </div>

          {/* Navbar Links */}
          <div className="flex">
            <div className="sm:ml-6">
              <div className="flex space-x-4">
                <a
                  href="/"
                  className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="#"
                  className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact Us
                </a>
                {
                  user ?
                    <UserButton />
                    :
                    <Link href="/sign-in" className="hover:cursor-pointer flex items-center gap-2 transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium">
                      Login
                      <LogIn size={20} />
                    </Link>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}