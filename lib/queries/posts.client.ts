import { queryOptions } from "@tanstack/react-query";
import type { PostWithAuthor } from "@/lib/api";
import { postKeys } from "./posts.keys";

/**
 * ────────────────────────────────────────────────────────────
 *  [클라이언트 전용] 조회 로직
 *
 *  브라우저는 외부 API를 직접 부르지 않는다. 우리 서버의 route.ts를 부른다.
 *
 *      Client Component ──fetch──▶ /api/posts (route.ts) ──fetch──▶ 외부 API
 *                                       └ 여기서 lib/api.ts의 getPosts()를 그대로 재사용
 *
 *  왜 프록시를 한 번 거치나:
 *   - 외부 API 주소와 인증 키가 브라우저에 노출되지 않는다
 *   - CORS를 우리 서버가 대신 처리한다 (외부 API가 CORS를 안 열어줘도 됨)
 *   - 응답 가공/필터링 로직을 서버 한 곳에서만 관리한다
 *
 *  그리고 중요한 점 — queryFn은 서버 버전과 다르지만
 *  queryKey는 postKeys.list()로 "동일"하다.
 *  그래서 서버가 prefetch해둔 캐시를 이 useQuery가 그대로 이어받는다.
 * ────────────────────────────────────────────────────────────
 */

/**
 * 프록시(route.ts) 호출용 얇은 fetch 래퍼.
 *
 * 상대경로('/api/posts')를 쓰므로 브라우저에서만 동작한다.
 * 서버 렌더링 중에는 호출되지 않는데, React Query가 queryFn을
 * "렌더 중"이 아니라 "마운트 후 effect"에서 실행하기 때문이다.
 */
async function fetchFromProxy<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(path, { signal });

  if (!res.ok) {
    // 에러를 throw해야 React Query가 isError 상태로 전환하고 재시도한다.
    throw new Error(`프록시 요청 실패: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** 게시글 목록 — 브라우저에서 /api/posts 프록시를 조회 */
export const postsQueryOptionsClient = queryOptions<PostWithAuthor[]>({
  //   ↓ 서버(posts.server.ts)와 "글자 하나까지" 같아야 한다
  queryKey: postKeys.list(),
  queryFn: ({ signal }) =>
    fetchFromProxy<PostWithAuthor[]>("/api/posts", signal),
});

/** 게시글 상세 — 브라우저에서 /api/posts/[id] 프록시를 조회 */
export function postQueryOptionsClient(id: string | number) {
  return queryOptions<PostWithAuthor | null>({
    queryKey: postKeys.detail(id),
    queryFn: ({ signal }) =>
      fetchFromProxy<PostWithAuthor>(`/api/member/${id}`, signal),
  });
}
