import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'App Router — Next.js 렌더링 비교',
  description: 'Server Component / SSG / CSR 비교 예제',
};

/**
 * App Router의 루트 레이아웃.
 * Pages Router의 `pages/_app.tsx` + `pages/_document.tsx`가 하던 역할을 합친 것이다.
 * 이 파일 자체가 Server Component라서 <html>, <body>를 직접 만든다.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/*
          Providers는 Client Component지만, 그 안의 children(Nav, 각 page.tsx)은
          여전히 Server Component로 남는다.
          Client Component가 children을 "받아서" 렌더링할 때는
          이미 서버에서 완성된 결과를 끼워 넣을 뿐이기 때문이다.
        */}
        <Providers>
          <Nav routerName="app/ — App Router" />
          <main className="page">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
