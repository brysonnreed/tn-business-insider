import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import businessProfileType from './businessProfile'

export default defineType({
  name: 'users',
  title: 'Users',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
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
  ],
})
