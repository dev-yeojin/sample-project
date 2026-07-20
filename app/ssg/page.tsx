import PostGrid from '@/components/PostGrid';
import RenderInfo from '@/components/RenderInfo';
import { getPosts, nowLabel } from '@/lib/api';

/**
 * ─── SSG (App Router 방식) ────────────────────────────────
 *
 * SSR 페이지와 코드가 거의 똑같다. 딱 한 줄, `revalidate` 설정만 다르다.
 * 이것이 App Router의 핵심 아이디어다 —
 * "데이터를 가져오는 코드"는 그대로 두고, "캐싱 정책"만 바꿔서 SSG/SSR을 오간다.
 *
 *   Pages Router:  getStaticProps  ↔  getServerSideProps   (함수 자체를 바꿔야 함)
 *   App Router:    export const revalidate = 3600  ↔  'force-dynamic'   (설정만 바꿈)
 *
 * ※ 개발 모드(`npm run dev`)에서는 매번 다시 렌더링되므로 SSG 효과가 보이지 않는다.
 *   `npm run build && npm start`로 실행해야 시각이 "빌드 시점에 멈춰 있는" 걸 확인할 수 있다.
 * ─────────────────────────────────────────────────────────
 */

// 3600초(1시간) 동안 빌드 시점의 HTML을 그대로 재사용한다.
export const revalidate = 3600;

export default async function SsgPage() {
  // ↓ 이 await는 "빌드할 때" 딱 한 번 실행된다.
  const posts = await getPosts('static');
  const builtAt = nowLabel();

  return (
    <>
      <h1 className="page__title">SSG — 빌드할 때 한 번, 미리 만들어두기</h1>
      <p className="page__lead">
        코드는 SSR 페이지와 거의 같습니다. 다른 건 <code>export const revalidate = 3600</code> 한
        줄뿐입니다. 미리 만들어둔 HTML을 그대로 내보내므로 가장 빠릅니다.
      </p>

      <RenderInfo
        kind="ssg"
        api="export const revalidate = 3600"
        fetchedAt={builtAt}
        timestampMeaning="프로덕션 빌드(npm run build)에서는 새로고침해도 이 시각이 바뀌지 않습니다. 빌드 시점에 굳어버린 HTML이기 때문입니다."
        observe={[
          'npm run build && npm start 로 실행 → 새로고침해도 시각이 그대로다',
          'npm run dev 에서는 매번 바뀐다 (개발 모드는 항상 새로 렌더링하기 때문)',
          '빌드 로그에서 이 경로 앞에 ○(Static) 표시가 붙는 걸 확인해보세요',
          'SSR 페이지보다 응답이 눈에 띄게 빠르다 (API를 호출하지 않으므로 0.8초 대기 없음)',
        ]}
      >
        빌드 시점에 API를 호출해 HTML로 굳혀둡니다. 요청이 와도 서버는 파일만 내려주면 됩니다. 자주
        바뀌지 않는 블로그·문서·랜딩 페이지에 가장 잘 맞습니다.
      </RenderInfo>

      <PostGrid posts={posts} />
    </>
  );
}
