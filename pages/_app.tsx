import 'tailwindcss/tailwind.css'
import 'styles/globals.css'

import Footer from 'components/Layout/Footer'
import Header from 'components/Layout/Header/Header'
import { ToastDisplayProvider } from 'context/toastContext'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export interface SharedPageProps {
  token: string
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<SharedPageProps & { session: Session }>) {
  const { token } = pageProps

  const router = useRouter()

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
      <SessionProvider session={session}>
        <ToastDisplayProvider>
          <Toaster />
          {!isExcludedRoute && <Header />}
          <Component {...pageProps} />
          {!isExcludedRoute && <Footer />}
        </ToastDisplayProvider>
      </SessionProvider>
    </>
  )
}
