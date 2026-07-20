import PostsClient from './PostsClient';

/**
 * 이 page.tsx는 여전히 Server Component다 ('use client'가 없다).
 * 제목 같은 정적인 부분은 서버가 HTML로 만들어 보내고,
 * 데이터가 필요한 부분만 Client Component(<PostsClient />)에 맡긴다.
 *
 * 이것이 App Router에서 권장하는 패턴이다 —
 * "페이지 전체를 클라이언트로 만들지 말고, 필요한 잎사귀(leaf)만 클라이언트로."
 */
export default function CsrPage() {
  return (
    <>
      <h1 className="page__title">CSR — 브라우저가 데이터를 가져온다</h1>
      <p className="page__lead">
        서버는 빈 껍데기만 주고, 실제 데이터는 브라우저의 <code>useEffect</code>가 가져옵니다. 로딩
        스켈레톤이 보이는지, 그리고 페이지 소스에 글이 들어 있는지 확인해보세요.
      </p>

      <PostsClient />
    </>
  );
}
