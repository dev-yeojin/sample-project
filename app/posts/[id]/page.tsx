import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerQueryClient } from "@/lib/query/server";
import { postQueryOptionsServer } from "@/lib/queries/posts.server";
import PostDetailClient from "./PostDetailClient";

/**
 * ─── 동적 라우트 + React Query prefetch ───────────────────────
 *
 * 목록 페이지(/rq)와 완전히 같은 3단계다.
 *   ① 서버가 미리 조회해 캐시에 넣고  ② dehydrate하고  ③ 클라이언트가 이어받는다
 *
 * 다른 점은 queryKey에 id가 들어간다는 것뿐이다.
 *   목록: postKeys.list()      → ['posts','list']
 *   상세: postKeys.detail(id)  → ['posts','detail','1']
 *
 * 그래서 글마다 캐시가 따로 잡히고, 이미 본 글로 되돌아가면 요청 없이 즉시 뜬다.
 *
 * 404 처리는 `return { notFound: true }`가 아니라 `notFound()` 함수를 호출한다.
 * params는 Next.js 15부터 Promise라서 await해야 한다.
 * ─────────────────────────────────────────────────────────────
 */

type Props = { params: Promise<{ id: string }> };

/**
 * generateMetadata와 아래 페이지 컴포넌트는 "같은" QueryClient를 쓴다.
 * getServerQueryClient가 React의 cache()로 감싸여 있기 때문이다.
 *
 * → 두 곳 모두 fetchQuery를 호출하지만 외부 API 요청은 한 번만 나간다.
 *   (두 번째 호출은 이미 캐시에 있으므로 즉시 반환된다)
 *   이게 lib/query/server.ts에서 cache()를 쓴 실질적인 이유다.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const queryClient = getServerQueryClient();
  const post = await queryClient.fetchQuery(postQueryOptionsServer(id));

  if (!post) {
    return { title: "게시글을 찾을 수 없습니다" };
  }
  return { title: post.title, description: post.body.slice(0, 100) };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getServerQueryClient();

  /**
   * 목록 페이지는 prefetchQuery를 썼는데 여기서는 fetchQuery를 쓴다.
   *
   *   prefetchQuery — 캐시만 채운다. 값을 돌려주지 않고, 실패해도 조용히 넘어간다.
   *   fetchQuery    — 캐시도 채우고 "값도 돌려준다". 실패하면 throw한다.
   *
   * 여기서는 404 판정과 <title> 생성에 값 자체가 필요하므로 fetchQuery가 맞다.
   * (lib/api.ts의 getPost는 실패 시 throw 대신 null을 반환한다)
   *
   * 반대로 값을 쓰지 않는 목록 페이지에서는 prefetchQuery가 더 낫다 —
   * 외부 API가 죽어도 페이지는 뜨고, 브라우저가 프록시로 재시도하기 때문이다.
   */
  const post = await queryClient.fetchQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id, "dynamic"),
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <Link href="/rq" className="back">
        ← 목록으로
      </Link>

      {/* 서버가 채운 캐시를 그대로 브라우저로 넘긴다 → 상세도 스켈레톤이 보이지 않는다 */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostDetailClient id={id} />
      </HydrationBoundary>
    </>
  );
}
