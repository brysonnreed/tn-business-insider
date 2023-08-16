export const validateAndSanitizeInput = (value) => {
  const forbiddenCharacters = /([<>\/])/g

  if (forbiddenCharacters.test(value)) {
    return false
  }
  return true
}

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

export function sanitizeURL(url) {
  if (!url || url.trim() === '') return true
  if (isSafeURL(url) && isValidURL(url)) {
    return true // If true is returned, React Hook Form considers the validation successful.
  }
  return 'Invalid or unsafe URL' // React Hook Form will use this as the error message.
}

function isValidURL(url) {
  // Basic check using URL constructor
  try {
    new URL(url)
  } catch (e) {
    return false
  }

  // Regular expression for common URL validation
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?' + // port
      '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
      '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return pattern.test(url)
}

function isSafeURL(url) {
  // Check if the URL starts with javascript: for basic XSS prevention
  return !url.startsWith('javascript:')
}
