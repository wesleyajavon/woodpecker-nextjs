// import { NextRequest, NextResponse } from 'next/server';
// import { CloudinaryService, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

// export async function POST(request: NextRequest) {
//   try {
//     // Récupération des données de la requête
//     const formData = await request.formData();
    
//     // Extraction du fichier artwork
//     const artworkFile = formData.get('artwork') as File;
//     const folder = formData.get('folder') as string || CLOUDINARY_FOLDERS.ARTWORK.BEATS;
    
//     if (!artworkFile) {
//       return NextResponse.json({
//         error: 'Fichier artwork requis'
//       }, { status: 400 });
//     }

//     // Validation du type de fichier
//     const allowedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
//     const fileExtension = artworkFile.name.toLowerCase().substring(artworkFile.name.lastIndexOf('.'));
    
//     if (!allowedFormats.includes(fileExtension)) {
//       return NextResponse.json({
//         error: 'Format de fichier non supporté',
//         allowedFormats
//       }, { status: 400 });
//     }

//     // Validation de la taille
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     if (artworkFile.size > maxSize) {
//       return NextResponse.json({
//         error: 'Fichier trop volumineux',
//         maxSize: '10MB'
//       }, { status: 400 });
//     }

//     try {
//       // Conversion du fichier en Buffer
//       const buffer = Buffer.from(await artworkFile.arrayBuffer());
      
//       // Upload vers Cloudinary
//       const uploadResult = await CloudinaryService.uploadImage(
//         buffer,
//         folder,
//         {
//           width: 800,
//           height: 800,
//           crop: 'fill',
//           quality: 'auto:good'
//         }
//       );

//       // Génération des URLs de transformation
//       const thumbnailUrl = CloudinaryService.generateTransformUrl(
//         uploadResult.public_id,
//         {
//           width: 300,
//           height: 300,
//           crop: 'fill',
//           quality: 'auto:good'
//         }
//       );

//       const mediumUrl = CloudinaryService.generateTransformUrl(
//         uploadResult.public_id,
//         {
//           width: 600,
//           height: 600,
//           crop: 'fill',
//           quality: 'auto:good'
//         }
//       );

//       const largeUrl = CloudinaryService.generateTransformUrl(
//         uploadResult.public_id,
//         {
//           width: 1200,
//           height: 1200,
//           crop: 'fill',
//           quality: 'auto:best'
//         }
//       );

//       return NextResponse.json({
//         success: true,
//         message: 'Artwork uploadé avec succès',
//         data: {
//           original: uploadResult,
//           transformations: {
//             thumbnail: thumbnailUrl,
//             medium: mediumUrl,
//             large: largeUrl
//           }
//         }
//       }, { status: 201 });

//     } catch (uploadError) {
//       console.error('Erreur lors de l\'upload vers Cloudinary:', uploadError);
      
//       return NextResponse.json({
//         error: 'Échec de l\'upload vers Cloudinary',
//         details: uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'
//       }, { status: 500 });
//     }

//   } catch (error) {
//     console.error('Erreur générale lors de l\'upload d\'artwork:', error);
//     return NextResponse.json({
//       error: 'Erreur interne du serveur',
//       details: error instanceof Error ? error.message : 'Erreur inconnue'
//     }, { status: 500 });
//   }
// }
