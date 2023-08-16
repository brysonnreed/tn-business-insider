import 'tailwindcss/tailwind.css'
import '../globals.css'

import { ToastDisplayProvider } from 'context/toastContext'
import { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { lazy } from 'react'
import { Toaster } from 'react-hot-toast'

export interface SharedPageProps {
  draftMode: boolean
  token: string
}

const PreviewProvider = lazy(
  () => import('components/PreviewPages/PreviewProvider')
)

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<SharedPageProps & { session: Session }>) {
  const { draftMode, token } = pageProps

  return (
    <>
      {draftMode ? (
        <PreviewProvider token={token}>
          <Component {...pageProps} />
        </PreviewProvider>
      ) : (
        <SessionProvider session={session}>
          <ToastDisplayProvider>
            <Toaster />
            <Component {...pageProps} />
          </ToastDisplayProvider>
        </SessionProvider>
      )}
    </>
  )
}
