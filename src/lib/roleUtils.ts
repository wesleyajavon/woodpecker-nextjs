import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

/**
 * Récupère le rôle d'un utilisateur depuis son email
 * @param email - L'email de l'utilisateur
 * @returns Le rôle de l'utilisateur ou null si non trouvé
 */
export async function getUserRoleFromEmail(email: string): Promise<UserRole | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true }
  })
  return user?.role || null
}

/**
 * Récupère l'utilisateur complet avec son rôle depuis son email
 * @param email - L'email de l'utilisateur
 * @returns L'utilisateur complet ou null si non trouvé
 */
export async function getUserWithRoleFromEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

/**
 * Vérifie si un utilisateur est admin
 * @param email - L'email de l'utilisateur
 * @returns true si l'utilisateur est admin, false sinon
 */
export async function isUserAdmin(email: string): Promise<boolean> {
  const role = await getUserRoleFromEmail(email)
  return role === UserRole.ADMIN
}

/**
 * Vérifie si un utilisateur est un utilisateur régulier
 * @param email - L'email de l'utilisateur
 * @returns true si l'utilisateur est un utilisateur régulier, false sinon
 */
export async function isUserRegular(email: string): Promise<boolean> {
  const role = await getUserRoleFromEmail(email)
  return role === UserRole.USER
}
