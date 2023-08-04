import {
  faAt,
  faEye,
  faEyeSlash,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Layout from 'layout/layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { signUp } from 'next-auth-sanity/client'
import logo from 'public/images/logo.jpg'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import styles from '../../styles/Form.module.css'

function Register() {
  const [show, setShow] = useState({ password: false, cpassword: false })
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      // Call the API to create the user in Sanity
      const res = await fetch('/api/auth/register', {
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
        toast.error('There was an error registering.')
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
          <Image
            src={logo}
            width={250}
            height={250}
            alt="TNBusinessInsider Logo"
            className="mx-auto"
          />
          <h1 className="text-grey-700 pb-2 text-3xl font-semibold text-black xs:pb-4 xs:text-5xl">
            Register
          </h1>
          <p className="text-sm text-gray-700 xs:text-base">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum,
            porro odit.{' '}
          </p>
        </div>
        <form
          className="flex flex-col gap-3 py-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
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
                type={show.password ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...register('password', { required: true, minLength: 10 })}
              />
              <span
                className="flex items-center px-3"
                onClick={() => setShow({ ...show, password: !show.password })}
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
                errors.cpassword?.type === 'required' ? 'border-rose-600' : ''
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
                onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
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

          <div className=" border-gray-300 ">
            <button type="submit" className={styles.button}>
              Sign-up
            </button>
          </div>
        </form>
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href={`/login`}
            className="text-blue-700 transition-all duration-200 hover:underline"
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
