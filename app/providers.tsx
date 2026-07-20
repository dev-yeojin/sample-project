'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query/queryClient';

/**
 * ────────────────────────────────────────────────────────────
 *  QueryClientProvider를 다는 곳
 *
 *  layout.tsx는 Server Component라서 Context를 직접 만들 수 없다.
 *  그래서 'use client' 파일을 하나 두고 layout이 이걸 감싸게 한다.
 *
 *  주의 — Provider가 children을 감싸도, children이 Server Component라면
 *  children은 "여전히 서버에서" 렌더링된다.
 *  Client Component가 Server Component를 자식으로 받으면
 *  이미 렌더링이 끝난 결과물(RSC payload)을 그냥 끼워 넣기 때문이다.
 *  → 루트에서 감싼다고 앱 전체가 CSR이 되는 게 아니다. 흔한 오해.
 * ────────────────────────────────────────────────────────────
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // useState(() => new QueryClient())가 아니라 getQueryClient()를 쓰는 이유는
  // lib/query/queryClient.ts 주석 참고 (서버는 매번 새로, 브라우저는 하나만).
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 화면 우측 하단 꽃 아이콘 — 캐시에 뭐가 들었는지 눈으로 볼 수 있다 */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
