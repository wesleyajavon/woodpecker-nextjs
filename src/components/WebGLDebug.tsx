'use client'

import { useState, useEffect } from 'react'

interface WebGLDebugProps {
  children: React.ReactNode
}

export function WebGLDebug({ children }: WebGLDebugProps) {
  const [debugInfo, setDebugInfo] = useState<{
    webglSupported: boolean
    userAgent: string
    hardwareConcurrency: number
    devicePixelRatio: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    setDebugInfo({
      webglSupported: !!gl,
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      devicePixelRatio: window.devicePixelRatio
    })
  }, [])

  // Only show debug in development
  if (process.env.NODE_ENV !== 'development' || !debugInfo) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <div 
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          zIndex: 9999,
          borderRadius: '5px',
          maxWidth: '300px'
        }}
      >
        <div><strong>WebGL Debug:</strong></div>
        <div>WebGL: {debugInfo.webglSupported ? '✅' : '❌'}</div>
        <div>CPU Cores: {debugInfo.hardwareConcurrency}</div>
        <div>Pixel Ratio: {debugInfo.devicePixelRatio}</div>
        <div>Browser: {debugInfo.userAgent.includes('Chrome') ? 'Chrome' : debugInfo.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
      </div>
    </>
  )
}
