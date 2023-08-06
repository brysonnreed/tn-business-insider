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
      name: 'resetToken',
      type: 'string',
      title: 'Password Reset Token',
      description: 'Token sent to user for password reset',
    }),
    defineField({
      name: 'resetTokenExpiresAt',
      type: 'datetime',
      title: 'Token Expiration Date',
      description: 'Date and time when the reset token expires',
    }),
  ],
})
