import Link from 'next/link';

/**
 * 홈 — 세 가지 렌더링 방식으로 들어가는 입구.
 * 데이터 패칭이 없으므로 이 페이지는 빌드 시점에 정적으로 만들어진다.
 */

const MODES = [
  {
    href: '/ssr',
    kind: 'ssr',
    badge: 'SSR',
    title: '서버 사이드 렌더링',
    api: 'async Server Component',
    desc: '요청이 올 때마다 서버가 데이터를 가져와 완성된 HTML을 만들어 보낸다. 항상 최신 데이터, 로딩 화면 없음.',
  },
  {
    href: '/ssg',
    kind: 'ssg',
    badge: 'SSG',
    title: '정적 사이트 생성',
    api: 'Server Component + revalidate',
    desc: '빌드할 때 한 번만 데이터를 가져와 HTML로 굳혀둔다. 가장 빠르지만 데이터는 그 시점에 멈춰 있다.',
  },
  {
    href: '/csr',
    kind: 'csr',
    badge: 'CSR',
    title: '클라이언트 사이드 렌더링',
    api: "'use client' + useEffect",
    desc: '빈 껍데기 HTML을 먼저 받고, 브라우저에서 JS가 데이터를 가져와 그린다. 로딩 화면이 반드시 존재한다.',
  },
  {
    href: '/rq',
    kind: 'rq',
    badge: 'RQ',
    title: 'React Query + prefetch',
    api: 'prefetchQuery + HydrationBoundary',
    desc: '서버가 캐시를 미리 채워 HTML과 함께 보내고, 브라우저의 useQuery가 그 캐시를 이어받는다. SSR의 속도와 CSR의 유연함을 동시에.',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <h1 className="page__title">App Router 렌더링 비교</h1>
      <p className="page__lead">
        같은 API, 같은 디자인, 같은 컴포넌트. 오직 <strong>데이터를 어디서 언제 가져오는지</strong>만
        다릅니다. 세 페이지를 열어보고 <code>보기 → 소스</code>와 네트워크 탭을 비교해보세요.
      </p>

      <div className="modes">
        {MODES.map((mode) => (
          <Link key={mode.href} href={mode.href} className={`mode mode--${mode.kind}`}>
            <span className="mode__badge">{mode.badge}</span>
            <h2 className="mode__title">{mode.title}</h2>
            <span className="mode__api">{mode.api}</span>
            <p className="mode__desc">{mode.desc}</p>
            <span className="mode__go">열어보기 →</span>
          </Link>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>SSR</th>
              <th>SSG</th>
              <th>CSR</th>
              <th>RQ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HTML 생성 시점</td>
              <td>매 요청</td>
              <td>빌드 1회</td>
              <td>안 만듦 (빈 껍데기)</td>
              <td>매 요청</td>
            </tr>
            <tr>
              <td>데이터 fetch 위치</td>
              <td>서버</td>
              <td>서버 (빌드 머신)</td>
              <td>브라우저</td>
              <td>서버 → 브라우저가 이어받음</td>
            </tr>
            <tr>
              <td>초기 HTML에 글 내용</td>
              <td>있음</td>
              <td>있음</td>
              <td>없음</td>
              <td>있음</td>
            </tr>
            <tr>
              <td>로딩 스피너</td>
              <td>없음</td>
              <td>없음</td>
              <td>있음</td>
              <td>없음</td>
            </tr>
            <tr>
              <td>SEO</td>
              <td>좋음</td>
              <td>가장 좋음</td>
              <td>불리함</td>
              <td>좋음</td>
            </tr>
            <tr>
              <td>API 키 노출</td>
              <td>안 됨</td>
              <td>안 됨</td>
              <td>노출됨</td>
              <td>안 됨 (route.ts 프록시)</td>
            </tr>
            <tr>
              <td>어울리는 화면</td>
              <td>대시보드, 피드</td>
              <td>블로그, 문서, 랜딩</td>
              <td>마이페이지, 실시간 UI</td>
              <td>목록+필터/정렬, 무한스크롤</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
