import Link from 'next/link';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import RenderInfo from '@/components/RenderInfo';
import { nowLabel } from '@/lib/api';
import { getServerQueryClient } from '@/lib/query/server';
import { postsQueryOptionsServer } from '@/lib/queries/posts.server';
import PostsQueryClient from './PostsQueryClient';

/**
 * ─── React Query + prefetchQuery (Server Component) ───────────
 *
 * SSR의 속도와 CSR의 유연함을 동시에 갖는 방법이다.
 *
 *   1. 서버가 데이터를 미리 가져와 QueryClient 캐시에 넣는다  (prefetchQuery)
 *   2. 그 캐시를 JSON으로 직렬화해 HTML에 실어 보낸다        (dehydrate)
 *   3. 브라우저가 그 JSON을 캐시에 복원한다                   (HydrationBoundary)
 *   4. useQuery는 "이미 캐시에 있네" 하고 즉시 데이터를 꺼낸다 (로딩 없음)
 *
 * 결과:
 *   - 초기 HTML에 글 내용이 들어 있다      → SSR과 동일한 SEO/체감속도
 *   - 스켈레톤이 보이지 않는다             → CSR의 단점 제거
 *   - 그런데도 refetch/invalidate가 된다   → CSR의 장점은 유지
 * ─────────────────────────────────────────────────────────────
 */

export const dynamic = 'force-dynamic';

export default async function ReactQueryPage() {
  // 이 요청 동안만 살아 있는 QueryClient (lib/query/server.ts)
  const queryClient = getServerQueryClient();

  /**
   * ① 서버에서 미리 조회 — queryFn이 외부 API를 "직접" 호출한다.
   *
   * prefetchQuery는 fetchQuery와 달리 에러를 throw하지 않는다.
   * 실패하면 캐시가 비어 있는 채로 넘어가고, 브라우저의 useQuery가
   * 프록시로 다시 시도한다. 즉 자연스러운 폴백이 생긴다.
   *
   * await를 붙였으므로 데이터가 채워질 때까지 기다린 뒤 HTML을 만든다.
   * (await를 빼면 pending 상태로 스트리밍된다 → 아래 no-prefetch 페이지 참고)
   */
  await queryClient.prefetchQuery(postsQueryOptionsServer);

  const prefetchedAt = nowLabel();

  return (
    <>
      <h1 className="page__title">React Query — 서버가 미리 담아주고, 클라이언트가 이어받는다</h1>
      <p className="page__lead">
        서버 컴포넌트가 <code>prefetchQuery</code>로 캐시를 채우고, 클라이언트 컴포넌트의{' '}
        <code>useQuery</code>가 그 캐시를 그대로 이어받습니다. <strong>스켈레톤이 한 번도 보이지 않는</strong>{' '}
        것이 하이드레이션이 성공했다는 증거입니다.
      </p>

      <RenderInfo
        kind="ssr"
        api="prefetchQuery → dehydrate → HydrationBoundary → useQuery"
        fetchedAt={prefetchedAt}
        timestampMeaning="서버가 prefetch를 끝낸 시각입니다. 아래 카드에 표시되는 '캐시에 채워진 시각'과 같다면, 브라우저가 다시 요청하지 않고 서버 데이터를 그대로 쓴 것입니다."
        observe={[
          '스켈레톤이 보이지 않는다 (CSR 페이지와 비교해보세요)',
          '우클릭 → 페이지 소스 보기 → HTML에 게시글 제목이 들어 있다',
          'Network 탭에 /api/posts 요청이 없다 — 캐시를 썼기 때문',
          '"강제로 다시 불러오기"를 누르면 그제서야 /api/posts 요청이 나간다',
          '우측 하단 Devtools를 열면 posts 쿼리가 이미 fresh 상태로 들어와 있다',
        ]}
      >
        서버는 외부 API를 <strong>직접</strong> 호출하고, 브라우저는 <code>/api/posts</code> 프록시를
        호출합니다. 가져오는 방법(queryFn)은 다르지만 <code>queryKey</code>가 같기 때문에 둘은 같은
        캐시를 공유합니다.
      </RenderInfo>

      {/*
        ② dehydrate(queryClient) — 캐시를 직렬화 가능한 평범한 객체로 바꾼다.
        ③ HydrationBoundary — 브라우저에서 그 객체를 캐시에 복원한다.

        HydrationBoundary 자체는 Client Component지만,
        이 page.tsx는 여전히 Server Component다.
      */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsQueryClient />
      </HydrationBoundary>

      <p className="page__lead" style={{ marginTop: '2rem' }}>
        비교해보기 →{' '}
        <Link href="/rq/no-prefetch" className="card__link">
          prefetch 없이 같은 컴포넌트를 렌더링하면?
        </Link>
      </p>
    </>
  );
}
