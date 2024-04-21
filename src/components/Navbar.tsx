"use client"

import React, { useState } from 'react';
import { Loader2, LogIn, LogOut, Megaphone } from 'lucide-react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Root() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="">
      <nav>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="text-lg font-semibold flex justify-center items-center text-purple-500">
              {/* <img src={logo} alt='RapidMarketing Logo' className="w-10 h-10"/> */}
              <Megaphone />
              <h2 className='ms-2'>RapidMarketing</h2>
            </div>

            {/* Navbar Links */}
            <div className="flex">
              <div className="hidden sm:block sm:ml-6">
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
                    loading ?
                      <Loader2 className='animate-spin' />
                      :
                      user ?
                        <a
                          onClick={() => {
                            signOut(auth)
                            router.push('/login')
                          }}
                          className="flex cursor-pointer gap-2 items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Logout
                          <LogOut size={20} />
                        </a>
                        :
                        <a
                          href="/login"
                          className="flex gap-2 items-center transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Login
                          <LogIn size={20} />
                        </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}