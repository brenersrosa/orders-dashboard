import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Exo, Nunito } from 'next/font/google'

const exo = Exo({ subsets: ['latin'], variable: '--font-exo' })

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${exo.variable} ${nunito.variable} bg-zinc-950 font-sans`}
    >
      <Component {...pageProps} />
    </main>
  )
}
