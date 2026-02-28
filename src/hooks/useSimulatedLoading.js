import { useEffect, useState } from 'react'

function useSimulatedLoading(delay = 350) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return loading
}

export default useSimulatedLoading
