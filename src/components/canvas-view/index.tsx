'use client'
import { Three } from '@/helper/components/three'
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, forwardRef, useImperativeHandle, useRef } from 'react'
import { OrbitControls, View as ViewImpl } from '@react-three/drei'

const CanvasView = forwardRef<
  HTMLDivElement,
  PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { orbit?: boolean }>
>(({ children, orbit, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null!)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})

CanvasView.displayName = 'CanvasView'

export default CanvasView
