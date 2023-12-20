import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { ArrowLeft, ArrowRight, MagnifyingGlass, Trash } from 'phosphor-react'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Summary } from '@/components/dashboard/summary'
import { TableDashboard } from '@/components/dashboard/table'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import Announcement from '@/@types/announcement'

interface AnnouncementsProps {
  announcementsData: Announcement[]
  totalCount: number
}

export default function Home({
  announcementsData,
  totalCount,
}: AnnouncementsProps) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(announcementsData)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / 5))
  }, [totalCount])

  async function handleNextPage() {
    setCurrentPage(currentPage + 1)

    const response = await api.get(
      `/announcements?_page=${currentPage + 1}&_limit=5`,
    )
    setAnnouncements(response.data)
  }

  async function handlePreviousPage() {
    setCurrentPage(currentPage - 1)

    const response = await api.get(
      `/announcements?_page=${currentPage - 1}&_limit=5`,
    )
    setAnnouncements(response.data)
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-10">
      <div className="flex items-center gap-4">
        <Input placeholder="Filtrar por nome, SKU ou MBL" />

        <Button icon={MagnifyingGlass} />

        <Button icon={Trash} />
      </div>

      <Summary />

      <div className="flex items-center justify-between gap-4">
        <Text className="">Total de dados: {totalCount}</Text>

        <div className="flex items-center justify-end gap-4">
          <Text className="">
            {currentPage} / {totalPages}
          </Text>

          <Button
            onClick={handlePreviousPage}
            icon={ArrowLeft}
            disabled={currentPage <= 1}
          />

          <Button
            onClick={handleNextPage}
            icon={ArrowRight}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>

      <TableDashboard announcements={announcements} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get('/announcements?_page=1&_limit=5')
    const announcementsData = response.data

    let totalCount = 0

    if (response.headers['x-total-count']) {
      totalCount = response.headers['x-total-count']
    }

    return {
      props: {
        announcementsData,
        totalCount,
      },
    }
  } catch (error) {
    console.error('Error fetching data: ', error)
    return {
      props: {
        announcementsData: null,
        totalCount: 0,
      },
    }
  }
}
