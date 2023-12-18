import { GetServerSideProps } from 'next'

import { api } from '@/lib/axios'

import Announcement from '@/@types/announcement'

interface AnnouncementsProps {
  announcements: Announcement[]
}

export default function Home({ announcements }: AnnouncementsProps) {
  console.log(announcements)

  return (
    <main className="flex flex-col">
      {announcements.map((announcement) => (
        <span key={announcement.ads_id}>{announcement.name}</span>
      ))}
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get('/announcements')
    const announcements = response.data

    return {
      props: {
        announcements,
      },
    }
  } catch (error) {
    console.error('Error fetching data: ', error)
    return {
      props: {
        announcements: null,
      },
    }
  }
}
