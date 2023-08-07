import {
  faArrowRight,
  faAt,
  faEye,
  faEyeSlash,
  faKey,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Layout from 'layout/layout'
import { getClient } from 'lib/sanity.client.cdn'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import logo from 'public/images/logo.jpg'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import styles from '../../styles/Form.module.css'

function Register() {
  const [show, setShow] = useState({ password: false, cpassword: false })
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  const [verificationCode, setVerificationCode] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [codeSent, setCodeSent] = useState(false)

  const siteKey = process.env.GOOGLE_CAPTCHA_SITE_KEY

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
      // Check if passwords match
      if (data.password !== data.cpassword) {
        toast.error('Passwords do not match.')
        return
      }

      // Check if email exists in Sanity
      const client = getClient()
      const existingUser = await client.fetch(
        '*[_type == "user" && email == $email]',
        {
          email: data.email,
        }
      )

      if (existingUser.length > 0) {
        toast.error('Email already in use.')
        return
      }
      // Generate the verification code
      const generatedVerificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()
      setVerificationCode(generatedVerificationCode)

      // Send the verification code to the user's email
      const sendCodeRes = await fetch('/api/auth/sendVerificationCode', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          verificationCode: generatedVerificationCode,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (sendCodeRes.status === 200) {
        // Show the verification code input and hide the registration form
        setShowForm(false)
        // Add the query parameter to the URL
        router.push({
          pathname: router.pathname,
          query: { 'verify-email': true },
        })
        toast.success('Verification code sent.')
      } else {
        toast.error('There was an error sending the verification code.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitVerification = async (data) => {
    try {
      if (data.code == verificationCode) {
        // If the verification code is valid, create the user
        const createUserRes = await fetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (createUserRes.status === 200) {
          reset()
          window.location.href = '/login'
        } else {
          toast.error('There was an error registering.')
        }
      } else {
        toast.error('Invalid verification code.')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleResendCode = async () => {
    try {
      // Generate the verification code
      const generatedVerificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()
      setVerificationCode(generatedVerificationCode)

      // Send the new verification code to the user's email
      const sendCodeRes = await fetch('/api/auth/sendVerificationCode', {
        method: 'POST',
        body: JSON.stringify({
          email: watch('email'), // Use the email entered by the user
          verificationCode: generatedVerificationCode,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (sendCodeRes.status === 200) {
        toast.success('Verification code sent.')
        setCodeSent(true)
      } else {
        toast.error('There was an error sending the verification code.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Register | TNBusinessInsider</title>
      </Head>
      <section className=" mx-auto flex w-3/4 flex-col">
        <div className="">
          <Link href={'/'}>
            <Image
              src={logo}
              width={250}
              height={250}
              alt="TNBusinessInsider Logo"
              className="mx-auto"
            />
          </Link>
          <h1 className="text-grey-700 pb-2 text-3xl font-semibold text-gray-700 xs:pb-4 xs:text-4xl">
            {showForm ? 'Register' : 'Verify your email'}
          </h1>
          <p className="text-sm text-gray-700 xs:text-base">
            {showForm ? (
              <>
                By clicking sign-up, you agree to our{' '}
                <Link
                  href="/terms-of-service"
                  className="text-ellipsis text-blue-500 underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="text-ellipsis text-blue-500 underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
                .
              </>
            ) : (
              'Before we can create your account, you must verify your email. Please check your email for a verification code.'
            )}
          </p>
        </div>
        <form
          className="flex flex-col gap-3 py-5"
          onSubmit={
            showForm
              ? handleSubmit(onSubmit)
              : handleSubmit(onSubmitVerification)
          }
        >
          {showForm ? (
            <div className="flex flex-col gap-3">
              <div className="">
                <div
                  className={`${styles.input_group} ${
                    errors.name?.type === 'required' ? 'border-rose-600' : ''
                  }`}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className={styles.input_text}
                    {...register('name', { required: true })}
                  />
                  <span className="flex items-center px-3">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                  </span>
                </div>
              </div>
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
                    {...register('email', {
                      required: true,
                      pattern: emailRegex,
                    })}
                  />
                  <span className=" flex items-center px-3">
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
                    errors.password?.type === 'required'
                      ? 'border-rose-600'
                      : ''
                  }`}
                >
                  <input
                    type={show.password ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    className={styles.input_text}
                    {...register('password', { required: true, minLength: 10 })}
                  />
                  <span
                    className="flex items-center px-3"
                    onClick={() =>
                      setShow({ ...show, password: !show.password })
                    }
                  >
                    {show.password ? (
                      <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    )}
                  </span>
                </div>

                {errors.password?.type === 'minLength' && (
                  <p className="text-red-500">
                    Password must be at least 10 characters long.
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`${styles.input_group} ${
                    errors.cpassword?.type === 'required'
                      ? 'border-rose-600'
                      : ''
                  }`}
                >
                  <input
                    type={show.cpassword ? 'text' : 'password'}
                    name="cpassword"
                    placeholder="Confirm Password"
                    className={styles.input_text}
                    {...register('cpassword', {
                      required: true,
                      minLength: 10,
                    })}
                  />
                  <span
                    className="flex items-center px-3"
                    onClick={() =>
                      setShow({ ...show, cpassword: !show.cpassword })
                    }
                  >
                    {show.cpassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" />
                    ) : (
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    )}
                  </span>
                </div>

                {errors.cpassword?.type === 'minLength' && (
                  <p className="text-red-500">
                    Password must be at least 10 characters long.
                  </p>
                )}
              </div>
              {/* <ReCAPTCHA
                sitekey="6LfRhYEnAAAAAD0zEny1JJ2KTn1GPDqYtfPRzWtg"
                onChange={(value) => {
                  console.log('Captcha value:', value)
                }}
              /> */}
            </div>
          ) : (
            // Display the verification code input
            <div>
              <div
                className={`${styles.input_group} ${
                  errors.code?.type === 'required' ? 'border-rose-600' : ''
                }`}
              >
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter Verification Code"
                  className={styles.input_text}
                  {...register('code', {
                    required: true,
                    minLength: 6,
                  })}
                  maxLength={6}
                />
                <span className=" flex items-center px-3">
                  <FontAwesomeIcon icon={faKey} className="h-4 w-4" />
                </span>
              </div>
              {errors.code?.type === 'minLength' && (
                <p className="text-red-500">
                  Verification code must 6 characters long.
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
                <p className="text-gray-400">Don&apos;t see the email? </p>
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  type="button"
                  onClick={handleResendCode}
                  className=" text-blue-400 hover:underline"
                >
                  Resend the Verification Code
                </motion.button>
              </div>
            </div>
          )}

          <div className=" border-gray-300 ">
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              type="submit"
              className={styles.button}
            >
              {showForm ? 'Sign-up' : 'Verify Email'}{' '}
              <FontAwesomeIcon icon={faArrowRight} />
            </motion.button>
          </div>
        </form>
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href={`/login`}
            className="text-blue-500 transition-all duration-200 hover:underline"
          >
            Log in
          </Link>
        </p>
      </section>
    </Layout>
  )
}

export default Register

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
