import Link from 'next/link';
import RenderInfo from '@/components/RenderInfo';
import { nowLabel } from '@/lib/api';
import PostsQueryClient from '../PostsQueryClient';

/**
 * ─── 대조군: prefetch를 하지 않은 같은 컴포넌트 ────────────────
 *
 * 이 페이지는 /rq 와 딱 두 가지가 다르다.
 *   - prefetchQuery를 호출하지 않는다
 *   - HydrationBoundary로 감싸지 않는다
 *
 * <PostsQueryClient />는 한 글자도 바뀌지 않았다.
 * 그런데 화면은 완전히 달라진다 — 스켈레톤이 보이고, /api/posts 요청이 나간다.
 *
 * 즉 "로딩이 보이냐 안 보이냐"를 결정하는 건 컴포넌트가 아니라
 * 서버가 캐시를 미리 채워줬느냐다.
 * ─────────────────────────────────────────────────────────────
 */

export const dynamic = 'force-dynamic';

export default function NoPrefetchPage() {
  return (
    <>
      <h1 className="page__title">대조군 — prefetch 없이</h1>
      <p className="page__lead">
        같은 <code>&lt;PostsQueryClient /&gt;</code>를 <strong>prefetch 없이</strong> 렌더링했습니다.
        컴포넌트 코드는 동일한데 동작이 어떻게 달라지는지 보세요.
      </p>

      <RenderInfo
        kind="csr"
        api="useQuery() only — prefetchQuery 없음"
        fetchedAt={nowLabel()}
        timestampMeaning="이건 서버가 HTML을 만든 시각일 뿐, 데이터를 가져온 시각이 아닙니다. 데이터는 이 시각 이후에 브라우저가 따로 가져옵니다."
        observe={[
          '스켈레톤이 약 0.8초 보인다 (/rq 에서는 안 보였다)',
          'Network 탭에 /api/posts 요청이 브라우저에서 나간다',
          '우클릭 → 페이지 소스 보기 → HTML에 게시글 제목이 없다',
          '/rq 를 먼저 방문한 뒤 이 페이지로 이동하면 스켈레톤이 안 보인다 — 브라우저 캐시가 이미 채워져 있기 때문',
        ]}
      >
        서버는 캐시를 비워둔 채 HTML을 보냅니다. <code>useQuery</code>가 마운트되면서 캐시가 비어 있는
        걸 발견하고 <code>/api/posts</code> 프록시를 호출합니다. 결국 평범한 CSR과 같아집니다.
      </RenderInfo>

      {/* HydrationBoundary가 없다 → 넘겨줄 캐시도 없다 */}
      <PostsQueryClient />

      <p className="page__lead" style={{ marginTop: '2rem' }}>
        ←{' '}
        <Link href="/rq" className="card__link">
          prefetch 있는 버전으로 돌아가기
        </Link>
      </p>
    </>
  );
}
