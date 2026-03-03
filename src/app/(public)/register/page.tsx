'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Demo: just redirect to dashboard
    await new Promise(r => setTimeout(r, 600))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">

      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-primary/5 items-center justify-center"
        style={{ backgroundImage: "url('/pattern.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="relative z-10 text-center px-12">
          <Image src="/full_logo.png" alt="QuickHire" width={180} height={60} className="mx-auto mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-clash">Start hiring today</h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Join thousands of employers posting jobs and finding great talent on QuickHire.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Image src="/full_logo.png" alt="QuickHire" width={150} height={50} className="mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1 font-clash">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition bg-gray-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            By continuing you agree to our{' '}
            <span className="underline cursor-pointer">Terms</span> &amp; <span className="underline cursor-pointer">Privacy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

