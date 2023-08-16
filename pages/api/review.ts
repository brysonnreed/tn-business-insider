import { getClient as FastClient } from 'lib/sanity.client'
import { getClient } from 'lib/sanity.client.cdn'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

const client = getClient()
const fastClient = FastClient()

export default async function review(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { text, rating, business, author, email, image } = JSON.parse(
        req.body
      )

      // Create the review in Sanity
      await client.create({
        _type: 'review',
        text,
        rating,
        business: {
          _type: 'reference',
          _ref: business,
        },
        author,
        email,
        image,
      })

      // Fetch the businessProfile and calculate the new average rating
      // Fetch all reviews for the businessProfile
      const allReviews = await fastClient.fetch(
        `*[_type == "review" && business._ref == "${business}"]{rating}`
      )

      // Calculate average rating using allReviews
      const totalRating = allReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      )

      const newAvgRating = totalRating / allReviews.length

      // Fetch the current distribution for the business.
      const businessData = await fastClient.fetch(
        `*[_type == "businessProfile" && _id == "${business}"][0]`
      )

      const currentDistribution = businessData.ratingsDistribution || []

      // Find if the rating already exists in the distribution.
      let ratingExists = false
      let updatedDistribution = []

      for (let item of currentDistribution) {
        if (item.rating === rating) {
          ratingExists = true
          console.log('Rating match found. Incrementing...')
          updatedDistribution.push({
            ...item,
            count: item.count + 1,
          })
        } else {
          updatedDistribution.push(item)
        }
      }

      // If the rating was not found in the distribution, add it.
      if (!ratingExists) {
        console.log('Rating not found. Adding new...')
        updatedDistribution.push({
          _key: uuidv4(),
          rating: rating,
          count: 1,
        })
      }

      const currentTotalReviews = businessData.totalReviews || 0
      const updatedOverallReviews = currentTotalReviews + 1

      // Update businessProfile with the new average rating
      await client
        .patch(business)
        .set({
          averageRating: newAvgRating,
          ratingsDistribution: updatedDistribution,
          totalReviews: updatedOverallReviews,
        })
        .commit()

      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Error adding the review' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }) // Only POST is accepted
  }
}
