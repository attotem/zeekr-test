
export const pickResponsivePath = (media) => {
  if (!media) return ''
  if (typeof media === 'string') return media

  if (typeof media === 'object' && media !== null) {
    let width = 1920
    if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
      width = window.innerWidth
    }

    const isMobile = width <= 876
    const isTablet = width > 876 && width <= 1200

    if (isMobile) return media.mobile || media.tablet || media.desktop || ''
    if (isTablet) return media.tablet || media.desktop || ''
    return media.desktop || ''
  }

  return ''
}

export const resolveMediaPath = (media, { carId = '7x', subfolder = '' } = {}) => {
  const fileName = pickResponsivePath(media)
  if (!fileName) return ''

  if (typeof fileName === 'string' && fileName.startsWith('/')) {
    return fileName
  }

  const base = import.meta.env.DEV ? '/src/assets/pages' : '/pages'
  const folder = subfolder ? `/${subfolder}` : ''

  return `${base}/${carId}${folder}/${fileName}`
}

export const resolveImage = (media, opts = {}) => resolveMediaPath(media, opts)
export const resolveVideo = (media, opts = {}) => resolveMediaPath(media, opts)
export const resolveMedia = (media, opts = {}) => resolveMediaPath(media, opts)

