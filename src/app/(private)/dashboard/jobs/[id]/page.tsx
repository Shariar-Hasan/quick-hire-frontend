import JobAddEditPage from '@/components/pages/job-add-edit.page'
import { Env } from '@/constants/env.constant'
import { Job } from '@/types/models/job.model'

interface Props {
  params: Promise<{ id: string }>
}

export default async function JobEditPage({ params }: Props) {
  const { id } = await params

  const res = await fetch(`${Env.API_URL}/job/slug/${id}`, { cache: 'no-store' })
  const json = await res.json()
  const job: Job | undefined = json?.data ?? undefined

  return <JobAddEditPage job={job} />
}
