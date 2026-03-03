'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, Briefcase, ChevronRight, Loader2 } from 'lucide-react'
import { companyService } from '@/services/company.service'
import { Company, CompanySize } from '@/types/models/company.model'
import { Asset } from '@/lib/asset'
import { Button } from '@/components/ui/button'

const LIMIT = 8

const sizeLabel: Record<CompanySize, string> = {
  STARTUP:    'Startup · 1–10',
  SMALL:      'Small · 11–50',
  MEDIUM:     'Medium · 51–200',
  LARGE:      'Large · 201–1000',
  ENTERPRISE: 'Enterprise · 1000+',
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Initial load
  useEffect(() => {
    setLoading(true)
    companyService.findAll({ page: 1, limit: LIMIT }).then(({ data, error }) => {
      if (!error) {
        setCompanies(data?.data.data ?? [])
        setTotal(data?.data.meta.total ?? 0)
      }
      setLoading(false)
    })
  }, [])

  const loadMore = async () => {
    const nextPage = page + 1
    setLoadingMore(true)
    const { data, error } = await companyService.findAll({ page: nextPage, limit: LIMIT })
    if (!error) {
      setCompanies((prev) => [...prev, ...(data?.data.data ?? [])])
      setPage(nextPage)
    }
    setLoadingMore(false)
  }

  const hasMore = companies.length < total

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero bar */}
      <div className="bg-white border-b px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Companies</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `${total} companies hiring right now` : 'Explore top employers'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 py-10">
        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="bg-white border rounded-xl p-5 animate-pulse h-44" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No companies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              size="lg"
              onClick={loadMore}
              disabled={loadingMore}
              className="min-w-40"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                `Load more (${total - companies.length} remaining)`
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function CompanyCard({ company }: { company: Company }) {
  const logoUrl = Asset.logoUrl(company.logo_url)
  const jobCount = company._count?.jobs ?? 0

  return (
    <Link
      href={`/jobs?company_id=${company.id}`}
      className="group bg-white border border-border/60 p-5 flex flex-col gap-4  hover:border-primary/40 transition-all"
    >
      {/* Logo + name row */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg border border-border/50 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={company.name}
              width={48}
              height={48}
              className="object-contain h-12 w-12"
              unoptimized
            />
          ) : (
            <Building2 className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm leading-snug truncate group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          {company.industry && (
            <p className="text-xs text-muted-foreground truncate">{company.industry}</p>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 flex-1">
        {company.size && (
          <p className="text-xs text-muted-foreground">{sizeLabel[company.size]}</p>
        )}
        {company.location && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {company.location.city}
            {company.location.country ? `, ${company.location.country}` : ''}
          </p>
        )}
        {company.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {company.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {jobCount} {jobCount === 1 ? 'job' : 'jobs'}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
