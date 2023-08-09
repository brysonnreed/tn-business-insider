import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { getClient } from 'lib/sanity.client.cdn'
import { uploadImageToSanity } from 'lib/uploadSanityImages'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import styles from '../../../styles/Form.module.css'
import LogoSection from '../AddFormComponents/LogoSection'
type UserFormData = {
  name: string
  logo: File
  password: string
  cpassword: string
}

function UpdateProfileInformation({ user }) {
  const [show, setShow] = useState({ password: false, cpassword: false })
  const client = getClient()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: user.name || '', // Provide a default value for the name field
    },
  })
  const oldImage = user.mainImage
  const onSubmit = async (data) => {
    try {
      // Check if passwords match
      if (data.password !== data.cpassword) {
        toast.error('Passwords do not match.')
        return
      }
      if (typeof data.logo == 'string') {
        data.logo = ''
      }
      const logoId = data.logo ? await uploadImageToSanity(data.logo) : null
      data.logo = logoId

      const res = await fetch('/api/auth/updateUserInfo', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          data,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        // Show the verification code input and hide the registration form
        reset()
        toast.success('User information updated!')
        if (data.logo && oldImage && oldImage.asset && oldImage.asset._ref) {
          const assetId = oldImage.asset._ref
          console.log(assetId)

          // Fetch the asset
          const asset = await client.getDocument(assetId)
          // Check if the asset has any references
          const assetReferences = asset.refs || []

          if (assetReferences.length === 0) {
            // Delete the asset if it's not referenced by any document
            await client.delete(assetId)
          }
        }

        window.location.reload()
      } else {
        toast.error('There was an error updating your info.')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-2xl  font-semibold sm:text-4xl">
        Update{' '}
        <span className="text-2xl font-bold text-orange-500 sm:text-4xl">
          Profile Information
        </span>
      </h3>
      <p>Leave input fields blank if you don&apos;t wish to update it.</p>

      <form
        className="flex flex-col gap-3 py-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3">
          <div className="">
            <div className={`${styles.input_group}`}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={styles.input_text}
                {...register('name', { minLength: 4 })}
              />
              <span className="flex items-center px-3">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              </span>
            </div>
            {errors.name?.type === 'minLength' && (
              <p className="text-center text-red-500">
                Name must be atleast 4 characters.
              </p>
            )}
          </div>
          <LogoSection
            setValue={setValue}
            title={'User Image'}
            user={user}
            required={false}
          />
          <div
            className={`${styles.input_group} ${
              errors.password?.type === 'required' ? 'border-rose-600' : ''
            }`}
          >
            <input
              type={show.password ? 'text' : 'password'}
              name="password"
              placeholder="New Password"
              className={styles.input_text}
              {...register('password', { required: false, minLength: 10 })}
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
                  required: false,
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
        </div>

        <div className=" border-gray-300 ">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            type="submit"
            className={styles.button}
          >
            Update Information
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default UpdateProfileInformation
