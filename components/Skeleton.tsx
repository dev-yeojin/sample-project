/**
 * 로딩 스켈레톤.
 *
 * 중요 — 이 컴포넌트가 화면에 보이는지 여부가 렌더링 방식을 구분하는 가장 쉬운 신호다.
 *  - CSR: 데이터를 브라우저에서 가져오므로 로딩 상태가 "반드시" 존재한다 → 스켈레톤이 보인다.
 *  - SSR/SSG: 서버가 완성된 HTML을 주므로 로딩 상태 자체가 없다 → 스켈레톤을 쓸 일이 없다.
 */
export default function Skeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="게시글 불러오는 중">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card card--skeleton" key={i}>
          <div className="card__author">
            <span className="skel skel--avatar" />
            <div className="skel-stack">
              <span className="skel skel--line" style={{ width: '7rem' }} />
              <span className="skel skel--line" style={{ width: '10rem' }} />
            </div>
          </div>
          <span className="skel skel--line skel--title" />
          <span className="skel skel--line" />
          <span className="skel skel--line" style={{ width: '80%' }} />
          <span className="skel skel--line" style={{ width: '45%' }} />
        </div>
      ))}
    </div>
  );
}
