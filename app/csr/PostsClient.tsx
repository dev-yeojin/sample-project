'use client';

import { useEffect, useState } from 'react';
import PostGrid from '@/components/PostGrid';
import RenderInfo from '@/components/RenderInfo';
import Skeleton from '@/components/Skeleton';
import { getPosts, nowLabel, type PostWithAuthor } from '@/lib/api';

/**
 * ─── CSR (클라이언트 사이드 렌더링) ───────────────────────
 *
 * 맨 위의 `'use client'` 한 줄이 이 파일을 브라우저에서 실행되는 코드로 만든다.
 * useState / useEffect 같은 훅은 Client Component에서만 쓸 수 있다.
 *
 * 이 방식은 App Router든 Pages Router든 **코드가 완전히 똑같다.**
 * ("use client"만 빼면 두 프로젝트의 이 파일은 한 글자도 다르지 않다)
 * → CSR은 라우터의 기능이 아니라, 그냥 React의 기본 동작이기 때문이다.
 *
 * 대가:
 *  - 초기 HTML은 빈 껍데기다 (SEO 불리, 소스 보기로 확인 가능)
 *  - 로딩 스피너가 반드시 필요하다
 *  - fetch가 브라우저에서 일어나므로 API 키를 숨길 수 없다
 * ─────────────────────────────────────────────────────────
 */
export default function PostsClient() {
  const [posts, setPosts] = useState<PostWithAuthor[] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string>('불러오는 중…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // ↓ 이 fetch는 "브라우저에서" 실행된다. 개발자도구 Network 탭에 그대로 찍힌다.
    getPosts('dynamic')
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
        setFetchedAt(nowLabel());
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <RenderInfo
        kind="csr"
        api="'use client' + useEffect(() => { getPosts() }, [])"
        fetchedAt={fetchedAt}
        timestampMeaning="브라우저 시각입니다. 페이지가 먼저 뜨고 → 그다음에 데이터가 도착했다는 뜻입니다."
        observe={[
          '페이지를 열면 스켈레톤이 약 0.8초 보인다 (SSR/SSG에는 없던 단계)',
          '우클릭 → 페이지 소스 보기 → 게시글 제목이 HTML에 없다',
          '개발자도구 Network 탭에 jsonplaceholder 요청이 브라우저에서 나가는 게 보인다',
          'JS를 끄면 아무것도 안 보인다',
        ]}
      >
        서버는 빈 껍데기 HTML만 보냅니다. 브라우저가 JS를 받아 실행하고, 그제서야 API를 호출해서 화면을
        그립니다. 그래서 &ldquo;로딩 → 완료&rdquo; 단계가 사용자 눈에 그대로 보입니다.
      </RenderInfo>

      {error && <p className="page__lead">에러: {error}</p>}
      {!error && (posts ? <PostGrid posts={posts} /> : <Skeleton />)}
    </>
  );
}
