import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import businessProfileType from './businessProfile'

export default defineType({
  name: 'user',
  title: 'User',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'url',
    }),
    defineField({
      name: 'password',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'businesses',
      title: 'Businesses',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: businessProfileType.name }] }],
    }),
    defineField({
      name: 'admin',
      title: 'Admin',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificationToken',
      title: 'Verification Token',
      type: 'string',
      // hidden: true, // Hide the field in the CMS
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false, // Set the initial value to false
    }),
  ],
})
