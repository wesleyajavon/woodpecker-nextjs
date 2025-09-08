'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Settings, LogOut, ShoppingBag } from 'lucide-react'
import Avatar from './Avatar'

export default function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!session?.user) {
    return null
  }

  const menuItems = [
    {
      icon: User,
      label: 'Profil',
      onClick: () => {
        router.push('/profile')
        setIsOpen(false)
      }
    },
    {
      icon: ShoppingBag,
      label: 'Mes commandes',
      onClick: () => {
        router.push('/orders')
        setIsOpen(false)
      }
    },
    {
      icon: Settings,
      label: 'Paramètres',
      onClick: () => {
        router.push('/settings')
        setIsOpen(false)
      }
    },
    {
      icon: LogOut,
      label: 'Déconnexion',
      onClick: () => {
        signOut({ callbackUrl: '/' })
        setIsOpen(false)
      },
      className: 'text-red-600 hover:text-red-700'
    }
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Avatar
          src={session.user.image}
          name={session.user.name ?? ''}
          email={session.user.email ?? ''}
          size="sm"
          showName={false}
        />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {session.user.name || session.user.email}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${item.className || ''}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


