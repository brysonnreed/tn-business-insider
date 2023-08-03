import Layout from 'layout/layout'
import Head from 'next/head'
import Image from 'next/image'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

import googleLogo from '../../public/images/Google__G__Logo.svg.png'
import styles from '../../styles/Layout.module.css'

function Login() {
  async function handleGoogleSignIn() {
    signIn('google', { callbackUrl: '/' })
  }
  return (
    <Layout>
      <Head>
        <title>Login - TNBusinessInsider</title>
      </Head>
      <section className="-my-16 mx-auto flex w-3/4 flex-col">
        <div className="text-white">
          <h1 className="text-grey-800 pb-10 text-5xl font-semibold text-white">
            Login
          </h1>
        </div>
        <form className="flex flex-col gap-5">
          {/* <div className="input-group">
            <input type="email" name="email" placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder="Password" />
          </div>
          <div className="input-button">
            <button type="submit">Login</button>
          </div> */}
          <div className="input-button">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={styles.button_custom}
            >
              Sign In with Google{' '}
              <Image src={googleLogo} alt="google logo" className="h-5 w-5" />
            </button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default Login

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
