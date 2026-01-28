// Utility helpers for resolving responsive media paths (images/videos)
// Supports:
// - string paths: "image.webp"
// - responsive objects: { desktop, tablet, mobile }

export const pickResponsivePath = (media) => {
  if (!media) return ''
  if (typeof media === 'string') return media

  if (typeof media === 'object' && media !== null) {
    // Fallback width for SSR / non-browser
    let width = 1920
    if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
      width = window.innerWidth
    }

    const isMobile = width <= 876
    const isTablet = width > 876 && width <= 1200

    if (isMobile && media.mobile) return media.mobile
    if (isTablet && media.tablet) return media.tablet
    if (media.desktop) return media.desktop

    return media.mobile || media.tablet || media.desktop || ''
  }

  return ''
}

export const resolveMediaPath = (media, { carId = '7x', subfolder = '' } = {}) => {
  const fileName = pickResponsivePath(media)
  if (!fileName) return ''

  // Absolute / external URL
  if (typeof fileName === 'string' && fileName.startsWith('/')) {
    return fileName
  }

  const base = import.meta.env.DEV ? '/src/assets/pages' : '/pages'
  const folder = subfolder ? `/${subfolder}` : ''

  return `${base}/${carId}${folder}/${fileName}`
}

