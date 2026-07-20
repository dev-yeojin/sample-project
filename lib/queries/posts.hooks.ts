"use client";

import { useQuery } from "@tanstack/react-query";
import {
  postQueryOptionsClient,
  postsQueryOptionsClient,
} from "./posts.client";

/**
 * ────────────────────────────────────────────────────────────
 *  useQuery 조회 로직 — 컴포넌트에서 떼어낸 이유
 *
 *  컴포넌트 안에 useQuery({ queryKey, queryFn })을 직접 쓰면
 *  같은 데이터를 두 화면에서 쓸 때 키와 옵션이 조금씩 어긋나기 시작한다.
 *  (한쪽만 staleTime을 주거나, 키에 오타가 나거나)
 *
 *  훅으로 한 번 감싸두면:
 *   - 화면은 usePosts()만 호출하면 되고, 어떻게 가져오는지는 몰라도 된다
 *   - 나중에 프록시 → GraphQL로 바꿔도 이 파일 하나만 고치면 된다
 *   - queryKey가 한 곳에서만 결정되므로 캐시가 갈라지지 않는다
 * ────────────────────────────────────────────────────────────
 */

/** 게시글 목록 조회 */
export function usePosts() {
  return useQuery(postsQueryOptionsClient);
}

const getPostClient = () => {
  fetch(`/api/posts/${id}`);
};
/** 게시글 상세 조회 */
export function usePost(id: string | number) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostClient(id, "dynamic"),
    enabled: Boolean(id), // id가 없으면 요청 자체를 보내지 않는다
  });
}
