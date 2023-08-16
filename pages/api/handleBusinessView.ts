import { getClient } from 'lib/sanity.client.cdn'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { businessId } = req.body

  if (!businessId) {
    return res.status(400).json({ error: 'Business ID not provided.' })
  }

  try {
    const client = getClient()

    // Retrieve the current views array and overall views count
    const businessProfile = await client.fetch('*[_id == $id][0]', {
      id: businessId,
    })
    const views = businessProfile?.views || []
    const overallViews = businessProfile?.overallViews || 0

    // Check if there's an existing view for the current date
    const currentDate = new Date().toISOString().split('T')[0] // Just the date part
    const existingView = views.find((view) => view.date === currentDate)

    if (existingView) {
      // If a view for the current date exists, increment the count
      existingView.count += 1
    } else {
      // Otherwise, add a new view entry for the current date
      views.push({
        _key: uuidv4(),
        date: currentDate,
        count: 1,
      })
    }

    // Increment the overall view count
    const updatedOverallViews = overallViews + 1

    // Update the views array and overall views count for the specific business profile
    await client
      .patch(businessId)
      .set({ views, overallViews: updatedOverallViews })
      .commit()

    res.status(200).json({ message: 'Business view recorded successfully.' })
  } catch (error) {
    console.error('Failed to record business view:', error)
    res.status(500).json({ error: 'Failed to record business view.' })
  }
}
