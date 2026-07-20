import PostGrid from '@/components/PostGrid';
import RenderInfo from '@/components/RenderInfo';
import { getPosts, nowLabel } from '@/lib/api';

/**
 * ─── SSR (App Router 방식) ────────────────────────────────
 *
 * 이 함수 앞에 `async`가 붙어 있다는 점이 전부다.
 * App Router에서 페이지는 기본적으로 Server Component이므로,
 * 컴포넌트 안에서 그냥 `await`로 데이터를 가져오면 된다.
 * getServerSideProps 같은 별도의 함수가 필요 없다.
 *
 *   Pages Router:  export async function getServerSideProps() { ... return { props } }
 *                  export default function Page({ posts }) { ... }   ← 데이터를 props로 "전달"
 *
 *   App Router:    export default async function Page() {
 *                    const posts = await getPosts()                   ← 컴포넌트가 직접 "await"
 *                  }
 *
 * 이 컴포넌트의 코드는 브라우저로 전송되지 않는다.
 * (그래서 여기서 DB에 직접 접근하거나 API 키를 써도 안전하다)
 * ─────────────────────────────────────────────────────────
 */

// 매 요청마다 새로 렌더링한다는 뜻. 이게 곧 SSR이다.
export const dynamic = 'force-dynamic';

export default async function SsrPage() {
  // ↓ 이 await는 "서버에서" 실행된다. 브라우저는 결과 HTML만 받는다.
  const posts = await getPosts('dynamic');
  const fetchedAt = nowLabel();

  return (
    <>
      <h1 className="page__title">SSR — 요청할 때마다 서버에서</h1>
      <p className="page__lead">
        페이지 컴포넌트가 <code>async</code> 함수이고, 그 안에서 바로 <code>await</code>로 데이터를
        가져옵니다. 서버가 완성된 HTML을 만들어 보내므로 브라우저는 그릴 것만 그립니다.
      </p>

      <RenderInfo
        kind="ssr"
        api="async function Page() { await getPosts() }"
        fetchedAt={fetchedAt}
        timestampMeaning="새로고침할 때마다 이 시각이 바뀝니다. 매 요청마다 서버가 다시 렌더링한다는 증거입니다."
        observe={[
          '새로고침 → 위 시각이 매번 바뀐다 (매 요청마다 서버 렌더링)',
          '우클릭 → 페이지 소스 보기 → HTML 안에 게시글 제목이 이미 들어 있다',
          '로딩 스피너가 없다. 대신 서버가 응답할 때까지(약 0.8초) 화면 전환이 잠깐 멈춘다',
          'JS를 꺼도 글이 그대로 보인다',
        ]}
      >
        서버가 API를 호출하고 → HTML을 완성해서 → 브라우저에 보냅니다. 데이터는 항상 최신이지만, 그
        만큼 서버가 매번 일을 합니다.
      </RenderInfo>

      <PostGrid posts={posts} />
    </>
  );
}
