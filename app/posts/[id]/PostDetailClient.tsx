"use client";

import { usePost } from "@/lib/queries/posts.hooks";

/**
 * ────────────────────────────────────────────────────────────
 *  Client Component — 상세 데이터를 useQuery로 "읽기만" 한다
 *
 *  목록(PostsQueryClient)과 완전히 같은 구조다.
 *  서버가 prefetch해줬으면 캐시에서 즉시 꺼내고,
 *  비어 있으면 /api/posts/[id] 프록시를 호출한다.
 *
 *  page.tsx에서 이미 notFound() 처리를 하므로 여기서 data가 null인 경우는
 *  거의 없지만, 캐시가 비어 있을 때(직접 진입 등)를 위해 방어 코드를 둔다.
 * ────────────────────────────────────────────────────────────
 */
export default function PostDetailClient({ id }: { id: string }) {
  const {
    data: post,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = usePost(id);

  if (isPending) {
    return (
      <article className="detail">
        <p className="page__lead">
          캐시가 비어 있어 <code>/api/posts/{id}</code>를 호출하는 중입니다…
        </p>
      </article>
    );
  }

  if (isError) {
    return <p className="page__lead">에러: {error.message}</p>;
  }

  if (!post) {
    return <p className="page__lead">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <>
      <div className="rq-bar">
        <div className="rq-bar__stat">
          <span className="rq-bar__label">캐시에 데이터가 채워진 시각</span>
          <strong className="rq-bar__value">
            {/* 서버/브라우저 타임존이 달라도 결과가 같도록 고정 (hydration mismatch 방지) */}
            {new Date(dataUpdatedAt).toLocaleTimeString("ko-KR", {
              hour12: false,
              timeZone: "Asia/Seoul",
            })}
          </strong>
        </div>

        <div className="rq-bar__stat">
          <span className="rq-bar__label">배경 갱신(isFetching)</span>
          <strong className="rq-bar__value">
            {isFetching ? "요청 중…" : "멈춤"}
          </strong>
        </div>

        <button type="button" className="rq-bar__btn" onClick={() => refetch()}>
          강제로 다시 불러오기
        </button>
      </div>

      <article className="detail">
        <div className="card__author">
          <span className="card__avatar">{post.author.charAt(0)}</span>
          <div>
            <strong className="card__author-name">{post.author}</strong>
            <span className="card__author-email">{post.authorEmail}</span>
          </div>
        </div>

        <h1 className="detail__title">{post.title}</h1>
        <p className="detail__body">{post.body}</p>
      </article>
    </>
  );
}
