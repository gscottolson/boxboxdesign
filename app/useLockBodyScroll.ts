import { useEffect, useLayoutEffect, useState } from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

type UseLockedBodyOutput = [boolean, (locked: boolean) => void]

export function useLockedBody(
  initialLocked = false,
  rootId = '___gatsby', // Default to `___gatsby` to not introduce breaking change
): UseLockedBodyOutput {
  const [locked, setLocked] = useState(initialLocked)

  // Do the side effect before render
  useIsomorphicLayoutEffect(() => {
    if (!locked) {
      return
    }

    // Save initial body style
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalPaddingRight = document.body.style.paddingRight
    const originalMarginTop = document.body.style.marginTop

    const DOC_BODY = document.body
    const DOC_ELEMENT = (document.documentElement || document.body)
    const scrollTop = DOC_ELEMENT.scrollTop

    // Lock body scroll
    DOC_BODY.style.overflow = 'hidden'
    DOC_BODY.style.position = 'fixed'

    // prevent scroll-to-top by offsetting with margin
    DOC_BODY.style.marginTop = `-${scrollTop}px`

    // Get the scrollBar width
    const root = document.getElementById(rootId) // or root
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0

    // Avoid width reflow
    if (scrollBarWidth) {
      DOC_BODY.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      DOC_BODY.style.overflow = originalOverflow
      DOC_BODY.style.position = originalPosition
      DOC_BODY.style.marginTop = originalMarginTop
      
      DOC_ELEMENT.scrollTop = scrollTop

      if (scrollBarWidth) {
        DOC_BODY.style.paddingRight = originalPaddingRight
      }
    }
  }, [locked])

  // Update state if initialValue changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocked])

  return [locked, setLocked]
}

export default useLockedBody