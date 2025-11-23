import { BusinessDirectoryPageClient } from '@/components/BusinessDirectoryPageClient'

export const dynamic = 'force-dynamic'

type SearchParams = Record<string, string | string[] | undefined>

export default function BusinessDirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return <BusinessDirectoryPageClient initialSearchParams={searchParams} />
}

