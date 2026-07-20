import Link from 'next/link';

/**
 * 공통 네비게이션 — App Router / Pages Router 양쪽에서 동일한 파일을 사용한다.
 * (`next/link`는 두 라우터 모두에서 같은 방식으로 동작한다)
 */

export type NavItem = {
  href: string;
  label: string;
};

const ITEMS: NavItem[] = [
  { href: '/', label: '홈' },
  { href: '/ssr', label: 'SSR' },
  { href: '/ssg', label: 'SSG' },
  { href: '/csr', label: 'CSR' },
  { href: '/rq', label: 'React Query' },
];

export default function Nav({ routerName }: { routerName: string }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <Link href="/" className="nav__brand">
          <span className="nav__logo">N</span>
          <span>
            <strong>Next.js 렌더링 비교</strong>
            <em className="nav__router">{routerName}</em>
          </span>
        </Link>

        <nav className="nav__links">
          {ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
