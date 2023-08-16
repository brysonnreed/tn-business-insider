/* eslint-disable import/no-anonymous-default-export */
import { BellIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'socialMediaPlatform',
  title: 'Social Media Platform',
  type: 'document',
  icon: BellIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
    }),
  ],
})
