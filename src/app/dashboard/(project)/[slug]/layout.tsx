'use client'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function LayoutDetailProject({
  project,
  modal,
  children,
  params,
}: Readonly<{
  project: React.ReactNode
  modal: React.ReactNode
  children: React.ReactNode
  params: {
    slug: string
  }
}>) {
  const segment = useSelectedLayoutSegment()
  return (
    <>
      {!(segment !== null && segment !== 'members') && (
        <Tabs value={segment} aria-label="basic tabs example">
          <Tab
            label="Boards"
            value={null}
            LinkComponent={Link}
            href={`/dashboard/${params.slug}`}
          />
          <Tab
            label="Members"
            value={'members'}
            LinkComponent={Link}
            href={`/dashboard/${params.slug}/members`}
          />
        </Tabs>
      )}
      {project}
      {children}
      {modal}
    </>
  )
}
