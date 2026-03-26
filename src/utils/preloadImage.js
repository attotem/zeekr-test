const loaded = new Set()
const inFlight = new Map()

export const preloadImage = (src) => {
  if (!src) return Promise.resolve()
  if (loaded.has(src)) return Promise.resolve()
  if (inFlight.has(src)) return inFlight.get(src)

  const promise = new Promise((resolve) => {
    const img = new Image()
    const done = () => {
      loaded.add(src)
      inFlight.delete(src)
      resolve()
    }
    img.onload = done
    img.onerror = done
    img.src = src
  })

  inFlight.set(src, promise)
  return promise
}

