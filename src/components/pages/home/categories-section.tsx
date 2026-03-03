import { Category } from '@/types/models/category.model'
import { Asset } from '@/lib/asset'
import { ArrowRight, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

async function getCategories(): Promise<Category[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
    const res = await fetch(`${apiUrl}/category?page=1&limit=8`, { cache: 'no-store' })
    const json = await res.json()
    return json.data?.data ?? []
  } catch {
    return []
  }
}

const BG_COLORS = [
  'bg-blue-50 border-blue-200',
  'bg-emerald-50 border-emerald-200',
  'bg-violet-50 border-violet-200',
  'bg-orange-50 border-orange-200',
  'bg-pink-50 border-pink-200',
  'bg-teal-50 border-teal-200',
  'bg-amber-50 border-amber-200',
  'bg-indigo-50 border-indigo-200',
]

export default async function CategoriesSection() {
  const categories = await getCategories()

  if (categories.length === 0) return null

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Explore by <span className='text-blue-500'>category</span></h2>
          <Link href="/jobs" className="text-primary/80 hover:text-primary font-medium text-sm sm:inline-block hidden">
            Show all jobs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category, i) => {
            const logoUrl = Asset.logoUrl(category.logo_url)
            const jobCount = category._count?.jobs ?? 0
            return (
              <Link
                key={category.id}
                href={`/jobs?category_id=${category.id}`}
                className={cn(`group border md:p-5 p-3 transition-all hover:shadow-md flex flex-row md:flex-col  gap-3 `, {
                  "bg-primary text-white!": category.is_featured,
                })}
              >
                {/* Logo or fallback */}
                <div className="h-10 w-10 flex items-center justify-center mb-1 md:mb-7">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="object-contain h-10 w-10"
                      unoptimized
                    />
                  ) : (
                    <Tag className="h-8 w-8 opacity-50" />
                  )}
                </div>

                <div className='flex-1'>
                  {/* Title + job count */}
                  <div className="">
                    <h3 className={cn("font-semibold text-gray-800 text-base leading-snug", {
                      "text-white": category.is_featured,
                    })}>{category.name}</h3>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-between items-center gap-3">
                    <p className={cn("text-sm mt-0.5", {
                      "text-white": category.is_featured,
                    })}>{jobCount} {jobCount === 1 ? 'job' : 'jobs'} available</p>
                    <ArrowRight className={cn("h-4 w-4 text-gray-400 group-hover:text-gray-700 transition-colors", {
                      "text-white group-hover:text-white": category.is_featured,
                    })} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex justify-between items-center mt-10">
          <Link href="/jobs" className="text-primary/80 hover:text-primary font-medium text-sm inline-block sm:hidden">
            Show all jobs →
          </Link>
        </div>
      </div>
    </section>
  )
}