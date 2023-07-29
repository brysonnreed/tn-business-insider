/* eslint-disable import/no-anonymous-default-export */
import { BellIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default {
  name: 'socialMediaPlatform',
  title: 'Social Media Platform',
  type: 'document',
  icon: BellIcon,
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
    },
  ],
}
