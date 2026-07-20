import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/api';

/**
 * ────────────────────────────────────────────────────────────
 *  프록시 Route Handler — GET /api/posts
 *
 *  이 파일의 존재 이유는 딱 하나다:
 *  "Server Component가 쓰는 조회 로직을, 브라우저도 쓸 수 있게 열어주는 것".
 *
 *      app/rq/page.tsx (Server Component) ──▶ getPosts() ──▶ 외부 API
 *      app/api/posts/route.ts             ──▶ getPosts() ──▶ 외부 API
 *                                              ▲
 *                                    같은 함수를 재사용한다
 *
 *  덕분에 "목록은 9개만" 같은 규칙이 lib/api.ts 한 곳에만 있고,
 *  서버 렌더링 경로와 브라우저 경로가 절대 어긋나지 않는다.
 *  (여기에 인증 토큰 주입, 응답 필드 마스킹 같은 걸 추가해도
 *   브라우저는 그 존재조차 알지 못한다)
 *
 *  ※ route.ts도 Server Component와 똑같이 서버에서 실행된다.
 *    차이는 "HTML을 만드느냐(page.tsx) / JSON을 돌려주느냐(route.ts)"뿐이다.
 * ────────────────────────────────────────────────────────────
 */

// 이 핸들러의 응답을 캐싱하지 않는다 (항상 최신 데이터)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ↓ Server Component가 부르는 것과 "완전히 같은" 함수
    const posts = await getPosts('dynamic');

    return NextResponse.json(posts, {
      headers: {
        // 브라우저 캐시는 끄고, 캐싱은 React Query에게 맡긴다
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[GET /api/posts]', error);

    return NextResponse.json(
      { message: '게시글 목록을 가져오지 못했습니다.' },
      { status: 502 },
    );
  }
}
