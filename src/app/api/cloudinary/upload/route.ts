import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { CloudinaryService, CLOUDINARY_FOLDERS } from '@/lib/cloudinary'

// GET désactivé - utilisez POST pour upload via proxy
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Méthode GET désactivée',
      message: 'Utilisez la méthode POST pour uploader via proxy et éviter les problèmes CORS',
      instructions: 'Appelez POST /api/cloudinary/upload-proxy avec FormData contenant file, folder et beatId'
    },
    { status: 405 }
  )
}
