import {
  faArrowRight,
  faAt,
  faEye,
  faEyeSlash,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, isAfter } from 'date-fns'
import Layout from 'layout/layout'
import { getClient } from 'lib/sanity.client.cdn'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import logo from 'public/images/logo.jpg'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import styles from '../../../styles/Form.module.css'

export default function ResetPassword() {
  const router = useRouter()
  const [show, setShow] = useState({ password: false, cpassword: false })
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

  const { query } = router

  // Function to extract the email and token from the query parameters
  const getEmailAndTokenFromQuery = () => {
    const { email, token } = query
    return { email, token }
  }

  const { email, token } = getEmailAndTokenFromQuery()

  console.log(email)
  console.log(token)

  // Function to check if the email and token exist in the query parameters
  const hasEmailAndTokenInQuery = () => {
    const { email, token } = query
    return email !== undefined && token !== undefined
  }

  // Set the initial state of showForm based on the presence of email and token in the query
  const [showForm, setShowForm] = useState(!hasEmailAndTokenInQuery())

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const client = getClient()
      const existingUser = await client.fetch(
        '*[_type == "user" && email == $email]',
        {
          email: data.email,
        }
      )

      if (existingUser.length === 0) {
        reset()
        toast.error(`Email account doesn't exist.`)
        return
      }

      // Send the verification code to the user's email
      const sendCodeRes = await fetch('/api/auth/sendPasswordReset', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (sendCodeRes.status === 200) {
        // Show the verification code input and hide the registration form
        reset()
        toast.success('Email sent!')
      } else {
        toast.error('There was an error sending the email.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitPasswordReset = async (data) => {
    try {
      if (data.password !== data.cpassword) {
        toast.error('Passwords do not match.')
        return
      }

      // Check if the user exists in the database
      const client = getClient()
      const existingUser = await client.fetch(
        '*[_type == "user" && email == $email]',
        {
          email: email,
        }
      )

      if (existingUser.length === 0) {
        toast.error('User not found')
        router.push('/register')
        return
      }

      // Check if the provided token matches the user's resetToken
      const user = existingUser[0]
      if (!user.resetToken || user.resetToken !== token) {
        toast.error('Invalid Token. Please retry')
        return
      }

      // Check if the resetToken has expired
      if (
        !user.resetTokenExpiresAt ||
        isAfter(new Date(), new Date(user.resetTokenExpiresAt))
      ) {
        toast.error('Token has expired. Use the reset link to try again.')
        return
      }

      data.email = email

      const res = await fetch('/api/auth/updatePassword', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        reset()
        window.location.href = '/login'
      } else {
        toast.error('There was an error your resetting password.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Reset Password | TNBusinessInsider</title>
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
            Reset your password
          </h1>
          <p className="text-sm text-gray-700 xs:text-base">
            {showForm
              ? 'Enter the email address of the account you would like to reset the pssword for. We will send you an email with instructions to reset the password'
              : `Create a new password for your account. Password must be longer than 10 charcters.`}
          </p>
        </div>
        <form
          className="flex flex-col gap-3 py-5"
          onSubmit={
            showForm
              ? handleSubmit(onSubmit)
              : handleSubmit(onSubmitPasswordReset)
          }
        >
          {showForm ? (
            <div className="flex flex-col gap-3">
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
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 overflow-hidden rounded border border-gray-300 bg-slate-200 px-4 text-left">
                <p className="py-2 xs:text-lg ">{email}</p>
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-4 w-4 text-gray-400"
                />
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
            </div>
          )}

          <div className=" border-gray-300 ">
            <button type="submit" className={styles.button}>
              {showForm ? 'Send' : 'Reset Password'}{' '}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
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
