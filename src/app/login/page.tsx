"use client"

import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/Button";
import { Loader2 } from "lucide-react";
import toast from 'react-hot-toast'
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [loggingIn, setLoggingIn] = React.useState(false);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      return await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 shadow-xl max-w-md w-full rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error.replace("Firebase: ", "")}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              setLoggingIn(true);
              mutate(email, {
                onSuccess: ({ user }) => {
                  localStorage.setItem("user", JSON.stringify(user));
                  if (user.email == "zzhenyyang@gmail.com") {
                    router.push("/main");
                  } else {
                    router.push("/main");
                  }
                  toast.success(`Login success! (${user.email})`);
                },
                onError: (err) => {
                  setError(err.message);
                  toast.error("Error logging in!");
                },
              });
            } catch (err) {
              console.error(err);
              toast.error("Error logging in! (Server error)");
            } finally {
              setLoggingIn(false);
            }
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <Button
            onClickAction={undefined}
            text={
              loggingIn || isPending ? (
                <>
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </>
              ) : (
                <>Submit</>
              )
            }
          />

          <p className="mt-4 text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-purple-500">
              Sign up here
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
