import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import {
  ArrowLeft,
  ArrowRight,
  MagnifyingGlass,
  TrashSimple,
} from 'phosphor-react'

import { Box } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Summary } from '@/components/dashboard/summary'
import { TableDashboard } from '@/components/dashboard/table'
import { Text } from '@/components/ui/Text'

import { api } from '@/lib/axios'

import { useToast } from '@/contexts/ToastContext'

import Announcement from '@/@types/announcement'

interface AnnouncementsProps {
  announcementsData: Announcement[]
  totalCount: number
}

interface ParamsProps {
  name_like?: string
  sku?: string
  ads_id?: string
}

const searchFormSchema = z.object({
  name: z.string().optional(),
  mbl: z.string().optional(),
  sku: z.string().optional(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

export default function Home({
  announcementsData,
  totalCount,
}: AnnouncementsProps) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(announcementsData)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dataCount, setDataCount] = useState(0)

  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  })

  const data = getValues()

  useEffect(() => {
    setTotalPages(Math.ceil(totalCount / 5))
    setDataCount(Math.ceil(totalCount / totalPages))
  }, [totalCount, totalPages])

  async function handleSearch(data: SearchFormData) {
    try {
      const { name, sku, mbl } = data

      const params: ParamsProps = {}

      if (name) {
        params.name_like = name
      } else if (sku) {
        params.sku = sku
      } else if (mbl) {
        params.ads_id = mbl
      }

      const response = await api.get('/announcements', {
        params: {
          ...params,
          _page: 1,
          _limit: 5,
        },
      })

      setTotalPages(Math.ceil(response.headers['x-total-count'] / 5))

      if (response.data.length === 0) {
        showToast('Falha!', 'Dado não encontrado.', 'error')
        reset()
        setAnnouncements(announcementsData)
        setTotalPages(Math.ceil(totalCount / 5))
      } else {
        setAnnouncements(response.data)
        setCurrentPage(1)
      }
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data) {
        console.log(error.response.data)
        showToast('Falha!', 'Dado não encontrado.', 'error')
        return
      }
      console.log('ERROR | ', error)
    }
  }

  async function handleNextPage(data: SearchFormData) {
    setCurrentPage(currentPage + 1)

    const { name, sku, mbl } = data

    const params: ParamsProps = {}

    if (name) {
      params.name_like = name
    } else if (sku) {
      params.sku = sku
    } else if (mbl) {
      params.ads_id = mbl
    }

    const response = await api.get('/announcements', {
      params: {
        ...params,
        _page: currentPage + 1,
        _limit: 5,
      },
    })
    setAnnouncements(response.data)
    setDataCount(response.headers['x-total-count'])
  }

  async function handlePreviousPage(data: SearchFormData) {
    setCurrentPage(currentPage - 1)

    const { name, sku, mbl } = data

    const params: ParamsProps = {}

    if (name) {
      params.name_like = name
    } else if (sku) {
      params.sku = sku
    } else if (mbl) {
      params.ads_id = mbl
    }

    const response = await api.get('/announcements', {
      params: {
        ...params,
        _page: currentPage - 1,
        _limit: 5,
      },
    })
    setAnnouncements(response.data)
    setDataCount(Math.ceil(response.headers['x-total-count'] / totalPages))
  }

  async function handleClearForm() {
    reset()
    setCurrentPage(1)
    setAnnouncements(announcementsData)
    setTotalPages(Math.ceil(totalCount / 5))
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 md:p-8 lg:p-10">
      <Summary />

      <Box className="flex-col gap-8 bg-zinc-800">
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="grid grid-cols-1 items-end gap-4 lg:grid-cols-4"
        >
          <Input
            label="Nome"
            placeholder="Buscar por nome"
            {...register('name')}
          />

          <Input
            label="SKU"
            placeholder="Buscar por SKU"
            {...register('sku')}
          />

          <Input
            label="MBL"
            placeholder="Buscar por MBL"
            {...register('mbl')}
          />

          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
            <Button
              icon={MagnifyingGlass}
              iconPosition="left"
              isLoading={isSubmitting}
            >
              Buscar
            </Button>

            <Button
              variant="destructive"
              icon={TrashSimple}
              iconPosition="left"
              onClick={handleClearForm}
              type="button"
            >
              Limpar
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <Text>Resultados exibidos: {`${dataCount} de ${totalCount}`}</Text>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={() => handlePreviousPage(data)}
              icon={ArrowLeft}
              disabled={currentPage <= 1}
            />

            <Text>
              Página: {currentPage} / {totalPages}
            </Text>

            <Button
              onClick={() => handleNextPage(data)}
              icon={ArrowRight}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>

        <TableDashboard announcements={announcements} />
      </Box>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get('/announcements', {
      params: {
        _page: 1,
        _limit: 5,
      },
    })
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
