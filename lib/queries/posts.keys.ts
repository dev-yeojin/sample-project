/**
 * ────────────────────────────────────────────────────────────
 *  queryKey — 서버와 클라이언트가 "반드시" 공유해야 하는 유일한 값
 *
 *  이 예제의 핵심이 여기 있다.
 *
 *    서버에서 prefetch한 데이터를 클라이언트의 useQuery가 이어받으려면
 *    두 곳의 queryKey가 "완전히 똑같아야" 한다. (깊은 비교로 판단한다)
 *
 *  서버는 외부 API를 직접 부르고, 클라이언트는 /api 프록시를 부르므로
 *  queryFn(조회 함수)은 서로 다르다. 그래도 상관없다.
 *  React Query가 캐시를 찾는 기준은 오직 queryKey뿐이기 때문이다.
 *
 *      queryKey  → 같아야 함 (캐시 식별자)
 *      queryFn   → 달라도 됨 (데이터를 가져오는 방법)
 *
 *  키를 문자열로 여기저기 흩어 쓰면 오타 하나에 캐시가 조용히 갈라진다.
 *  그래서 이렇게 한 파일에 모아 팩토리 형태로 관리한다.
 * ────────────────────────────────────────────────────────────
 */
export const postKeys = {
  /** ['posts'] — 이 도메인 전체. invalidateQueries({ queryKey: postKeys.all }) 로 한 번에 무효화 */
  all: ['posts'] as const,

  /** ['posts','list'] — 목록 계열 전체 */
  lists: () => [...postKeys.all, 'list'] as const,

  /** ['posts','list'] — 게시글 목록 */
  list: () => postKeys.lists(),

  /** ['posts','detail'] — 상세 계열 전체 */
  details: () => [...postKeys.all, 'detail'] as const,

  /** ['posts','detail','1'] — 게시글 하나 */
  detail: (id: string | number) => [...postKeys.details(), String(id)] as const,
};
