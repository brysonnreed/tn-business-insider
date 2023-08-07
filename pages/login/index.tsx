import { faAt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Layout from 'layout/layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import logo from 'public/images/logo.jpg'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import googleLogo from '../../public/images/Google__G__Logo.svg.png'
import styles from '../../styles/Form.module.css'

function Login() {
  async function handleGoogleSignIn() {
    signIn('google', { callbackUrl: '/' })
  }
  const [show, setShow] = useState(false)
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      // Call the NextAuth.js signIn method to handle authentication
      const result = await signIn('sanity-login', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/',
      })

      // Check the result of the signIn method
      if (result.ok) {
        // Authentication succeeded, redirect to home page or any other page you want
        router.push(result.url)
      } else {
        console.error('Error during sign-in:', result.error)
        toast.error('Invalid email or password')
      }
    } catch (error) {
      // Handle any errors during form submission
      console.error('Error during form submission:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    // Check if the 'success' query parameter is present in the URL
    if (router.query.success === 'true') {
      toast.success('Account added successfully')
    }
  }, [router.query.success])

  return (
    <Layout>
      <Head>
        <title>Login | TNBusinessInsider</title>
      </Head>
      <section className=" mx-auto flex w-3/4 flex-col">
        <div className="">
          <Link href={'/'}>
            <Image
              src={logo}
              width={250}
              height={250}
              alt="TNBusinessInsider Logo"
              className="mx-auto "
            />
          </Link>
          <h1 className="text-grey-700 pb-2 text-3xl font-semibold text-gray-700 xs:pb-4 xs:text-4xl">
            Login
          </h1>
          <p className="text-sm text-gray-700 xs:text-base">
            Welcome back, please login to your account. Forgot your password?{' '}
            <Link
              href={'/login/reset-password'}
              className="text-blue-700 transition-all duration-200 hover:underline"
            >
              Reset your password
            </Link>
          </p>
        </div>
        <form
          className="flex flex-col gap-5 py-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <div
              className={`${styles.input_group} ${
                errors.email?.type === 'required' ? 'border-rose-600' : ''
              }`}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input_text}
                {...register('email', { required: true, pattern: emailRegex })}
              />
              <span className="flex items-center px-3">
                <FontAwesomeIcon icon={faAt} className="h-4 w-4" />
              </span>
            </div>
            {errors.email?.type === 'pattern' && (
              <p className="text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>
          <div>
            <div
              className={`${styles.input_group} ${
                errors.password?.type === 'required' ? 'border-rose-600' : ''
              }`}
            >
              <input
                type={show ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...register('password', { required: true, minLength: 10 })}
              />
              <span
                className="flex items-center px-3"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" />
                ) : (
                  <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                )}
              </span>
            </div>
          </div>
          <div className=" border-gray-300 ">
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              type="submit"
              className={styles.button}
            >
              Login
            </motion.button>
          </div>

          <div className="input-button">
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              type="button"
              onClick={handleGoogleSignIn}
              className={`${styles.button_custom} text-sm`}
            >
              Sign In with Google
              <Image src={googleLogo} alt="google logo" className="h-5 w-5" />
            </motion.button>
          </div>
        </form>
        <p className="text-gray-600">
          Don&apos;t have an account yet?{' '}
          <Link
            href={`/register`}
            className="text-blue-700 transition-all duration-200 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </section>
    </Layout>
  )
}

export default Login

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)

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
