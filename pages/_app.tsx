import 'tailwindcss/tailwind.css'
import '../globals.css'

import Footer from 'components/Footer'
import Header from 'components/Header/Header'
import { ToastDisplayProvider } from 'context/toastContext'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
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

  const router = useRouter()

  const isStudioRoute = router.pathname.startsWith('/studio')
  const pathsToExclude = [
    '/studio',
    '/account/register',
    '/account/login',
    '/account/reset-password',
  ]
  const isExcludedRoute = pathsToExclude.some((path) =>
    router.pathname.startsWith(path)
  )

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
            {!isExcludedRoute && <Header />}
            <Component {...pageProps} />
            {!isExcludedRoute && <Footer />}
          </ToastDisplayProvider>
        </SessionProvider>
      )}
    </>
  )
}
