import { queryOptions } from '@tanstack/react-query';
import { getPost, getPosts, type PostWithAuthor } from '@/lib/api';
import { postKeys } from './posts.keys';

/**
 * ────────────────────────────────────────────────────────────
 *  [서버 전용] 조회 로직
 *
 *  Server Component가 prefetchQuery를 할 때 쓰는 queryOptions다.
 *  queryFn이 lib/api.ts의 fetch를 "직접" 호출한다 — 프록시를 거치지 않는다.
 *
 *      Server Component ──fetch──▶ 외부 API (jsonplaceholder)
 *
 *  서버에서 도는 코드라서 얻는 것:
 *   - 네트워크 홉이 하나 없다 (프록시를 안 거침 → 더 빠름)
 *   - API 키/토큰을 여기서 써도 브라우저에 노출되지 않는다
 *   - 브라우저 CORS 제약을 받지 않는다
 *
 *  ⚠️ 이 파일은 Client Component에서 import하면 안 된다.
 *     import하는 순간 lib/api.ts와 BASE_URL이 전부 브라우저 번들에 실린다.
 *     (실무에선 `server-only` 패키지를 설치해 맨 위에 import 'server-only' 를 넣어
 *      실수로 import하면 빌드가 깨지도록 강제한다)
 * ────────────────────────────────────────────────────────────
 */

/** 게시글 목록 — 서버에서 외부 API를 직접 조회 */
export const postsQueryOptionsServer = queryOptions<PostWithAuthor[]>({
  //   ↓ 클라이언트(posts.client.ts)와 "글자 하나까지" 같아야 한다
  queryKey: postKeys.list(),
  queryFn: () => getPosts('dynamic'),
});

/** 게시글 상세 — 서버에서 외부 API를 직접 조회 */
export function postQueryOptionsServer(id: string | number) {
  return queryOptions<PostWithAuthor | null>({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id, 'dynamic'),
  });
}
