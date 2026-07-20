'use client';

import PostGrid from '@/components/PostGrid';
import Skeleton from '@/components/Skeleton';
import { usePosts } from '@/lib/queries/posts.hooks';

/**
 * ────────────────────────────────────────────────────────────
 *  Client Component — useQuery로 데이터를 "읽기만" 한다
 *
 *  이 컴포넌트는 데이터가 어디서 왔는지 모른다.
 *   - 서버가 prefetch해줬으면 → 캐시에서 즉시 꺼낸다 (로딩 없음)
 *   - 캐시가 비어 있으면      → /api/posts 프록시를 호출한다 (로딩 있음)
 *
 *  같은 코드가 두 경우 모두를 처리한다는 게 핵심이다.
 *  이게 "서버에서 데이터 내려주기"와 "클라이언트 상태 관리"를
 *  React Query가 하나로 합쳐주는 지점이다.
 * ────────────────────────────────────────────────────────────
 */
export default function PostsQueryClient() {
  const { data, isPending, isError, error, isFetching, refetch, dataUpdatedAt } = usePosts();

  /**
   * isPending  — 캐시에 데이터가 "아예 없는" 상태 (첫 로딩)
   * isFetching — 요청이 "지금 나가는 중" (배경 갱신 포함)
   *
   * prefetch가 된 페이지에서는 isPending이 처음부터 false다.
   * → 스켈레톤이 한 번도 보이지 않는다. 이게 하이드레이션이 통했다는 증거다.
   */
  if (isPending) {
    return (
      <>
        <p className="page__lead">
          캐시가 비어 있어 브라우저가 <code>/api/posts</code>를 호출하는 중입니다…
        </p>
        <Skeleton />
      </>
    );
  }

  if (isError) {
    return <p className="page__lead">에러: {error.message}</p>;
  }

  return (
    <>
      <div className="rq-bar">
        <div className="rq-bar__stat">
          <span className="rq-bar__label">캐시에 데이터가 채워진 시각</span>
          <strong className="rq-bar__value">
            {/* 서버/브라우저의 타임존이 달라도 결과가 같도록 timeZone을 고정한다.
                (고정하지 않으면 hydration mismatch 경고가 뜬다) */}
            {new Date(dataUpdatedAt).toLocaleTimeString('ko-KR', {
              hour12: false,
              timeZone: 'Asia/Seoul',
            })}
          </strong>
        </div>

        <div className="rq-bar__stat">
          <span className="rq-bar__label">배경 갱신(isFetching)</span>
          <strong className="rq-bar__value">
            {isFetching ? '요청 중…' : '멈춤'}
          </strong>
        </div>

        <button type="button" className="rq-bar__btn" onClick={() => refetch()}>
          강제로 다시 불러오기
        </button>
      </div>

      <PostGrid posts={data} />
    </>
  );
}
