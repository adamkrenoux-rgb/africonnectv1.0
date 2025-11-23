/**
 * Safely parse JSON response from fetch
 * Handles cases where the response might be HTML (error page) instead of JSON
 */
export async function safeJsonParse<T = any>(response: Response): Promise<T | null> {
  try {
    const contentType = response.headers.get('content-type')
    
    // Check if response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        preview: text.substring(0, 200)
      })
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error parsing JSON response:', error)
    return null
  }
}

