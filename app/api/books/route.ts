import { NextResponse } from 'next/server'
import pb from '@/lib/pocketbase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const books = await pb.collection('books').getFullList({
      sort: '-created',
    });

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, author, coverImage, description, pdfPath } = await request.json();

    if (!title || !author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const record = await pb.collection('books').create({
      title,
      author,
      cover_image: coverImage,
      description,
      pdf_path: pdfPath,
    });

    return NextResponse.json(record, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
