import {
  ChartUpwardIcon,
  EarthAmericasIcon,
  LinkIcon,
  PinIcon,
  StarIcon,
} from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'businessProfile',
  title: 'Business Profile',
  icon: EarthAmericasIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Business Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    // Define the 'logo' field with image and URL fields
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Images of the business',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'verified',
      title: 'Verfified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{ type: 'city' }],
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'businessProfileCategory' }],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of services offered by the business',
    }),

    // Define the 'images' field with array of images and array of URLs fields
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Images of the business',
    }),
    defineField({ name: 'website', title: 'Website', type: 'url' }),

    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      icon: StarIcon,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'reference',
              to: [{ type: 'socialMediaPlatform' }],
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              icon: LinkIcon,
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'formatted_address',
          title: 'Formatted Address',
          type: 'string',
        },
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'place_id',
          title: 'Place ID',
          type: 'string',
        },
        {
          name: 'url',
          title: 'URL',
          type: 'url',
        },
        {
          name: 'geometry', // New field for latitude and longitude
          title: 'Geometry',
          type: 'object',
          fields: [
            {
              name: 'latitude',
              title: 'Latitude',
              type: 'number', // Change the type to 'number'
            },
            {
              name: 'longitude',
              title: 'Longitude',
              type: 'number', // Change the type to 'number'
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'openAllDay',
      title: 'Open 24/7',
      description: 'Check if the business is open 24/7',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'object',
      fields: [
        {
          name: 'monday',
          title: 'Monday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'tuesday',
          title: 'Tuesday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'wednesday',
          title: 'Wednesday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'thursday',
          title: 'Thursday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'friday',
          title: 'Friday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'saturday',
          title: 'Saturday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'sunday',
          title: 'Sunday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'overallViews',
      title: 'Total Views',
      type: 'number',
      description: 'Overall view count for the business.',
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'date',
              title: 'Date',
              type: 'date',
            },
            {
              name: 'count',
              title: 'Count',
              type: 'number',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'averageRating',
      title: 'Average Rating',
      type: 'number',
      description: 'Calculated average of all review ratings.',
    }),
    defineField({
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      description: 'How mant total ratings this business has.',
    }),
    defineField({
      name: 'ratingsDistribution',
      title: 'Ratings Distribution',
      type: 'array',

      of: [
        {
          type: 'object',
          icon: ChartUpwardIcon,
          fields: [
            {
              name: 'rating',
              title: 'Rating Value',
              type: 'number',
            },
            {
              name: 'count',
              title: 'Count',
              type: 'number',
            },
          ],
        },
      ],
      description: 'Distribution of ratings. How many 5s, 4s, 3s, etc.',
    }),
    defineField({
      name: 'email',
      title: 'Business Email for leads',
      type: 'string',
    }),
  ],
})
