/**
 * 각 페이지 상단에 붙는 "이 페이지는 어떻게 렌더링됐는가" 설명 카드.
 * 두 프로젝트가 동일한 파일을 사용하고, props로만 내용을 바꾼다.
 */

export type RenderKind = 'ssr' | 'ssg' | 'csr';

const THEME: Record<RenderKind, { label: string; where: string; className: string }> = {
  ssr: { label: 'SSR', where: '요청할 때마다 · 서버에서', className: 'info--ssr' },
  ssg: { label: 'SSG', where: '빌드할 때 한 번 · 서버에서', className: 'info--ssg' },
  csr: { label: 'CSR', where: '페이지를 연 뒤 · 브라우저에서', className: 'info--csr' },
};

type Props = {
  kind: RenderKind;
  /** 이 프로젝트에서 실제로 쓴 API 이름 (예: "Server Component", "getServerSideProps") */
  api: string;
  /** 데이터를 가져온 시각 */
  fetchedAt: string;
  /** 이 시각이 무엇을 의미하는지 */
  timestampMeaning: string;
  /** 수강생이 직접 확인해볼 것 */
  observe: string[];
  children?: React.ReactNode;
};

export default function RenderInfo({
  kind,
  api,
  fetchedAt,
  timestampMeaning,
  observe,
  children,
}: Props) {
  const theme = THEME[kind];

  return (
    <section className={`info ${theme.className}`}>
      <div className="info__head">
        <span className="info__badge">{theme.label}</span>
        <code className="info__api">{api}</code>
      </div>

      <p className="info__desc">{children}</p>

      <div className="info__stamp">
        <div>
          <span className="info__stamp-label">데이터를 가져온 시각</span>
          <strong className="info__stamp-value">{fetchedAt}</strong>
        </div>
        <p className="info__stamp-meaning">{timestampMeaning}</p>
      </div>

      <div className="info__observe">
        <span className="info__observe-title">직접 확인해보세요</span>
        <ul>
          {observe.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <p className="info__where">
        렌더링 위치 · 시점 — <strong>{theme.where}</strong>
      </p>
    </section>
  );
}
