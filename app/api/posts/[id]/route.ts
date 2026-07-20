import { NextResponse } from 'next/server';
import { getPost } from '@/lib/api';

/**
 * 프록시 Route Handler — GET /api/posts/[id]
 *
 * 목록과 똑같은 원칙. Server Component가 쓰는 getPost()를 그대로 재사용한다.
 * 동적 세그먼트(params)는 Next.js 15부터 Promise라서 await해야 한다.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // ↓ Server Component가 부르는 것과 "완전히 같은" 함수
  const post = await getPost(id, 'dynamic');

  if (!post) {
    return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(post, { headers: { 'Cache-Control': 'no-store' } });
}
