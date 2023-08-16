// utils/sessionStorage.js

/**
 * Check if business profile has been viewed in this session
 * @param {string} businessId - The ID of the business profile
 * @returns {boolean} - True if viewed, false otherwise
 */
export const hasBusinessBeenViewed = (businessId) => {
  const viewedProfiles = JSON.parse(
    sessionStorage.getItem('viewedProfiles') || '[]'
  )
  return viewedProfiles.includes(businessId)
}

/**
 * Mark business profile as viewed in this session
 * @param {string} businessId - The ID of the business profile
 */
export const markBusinessAsViewed = (businessId) => {
  const viewedProfiles = JSON.parse(
    sessionStorage.getItem('viewedProfiles') || '[]'
  )
  viewedProfiles.push(businessId)
  sessionStorage.setItem('viewedProfiles', JSON.stringify(viewedProfiles))
}
