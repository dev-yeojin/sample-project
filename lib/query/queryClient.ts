import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/**
 * ────────────────────────────────────────────────────────────
 *  QueryClient 생성 규칙
 *
 *  QueryClient는 "캐시 저장소" 그 자체다. 이 객체를 어디에, 몇 개 만드느냐가
 *  App Router에서 가장 많이 실수하는 지점이라 파일을 따로 뺐다.
 *
 *   - 서버: 요청이 올 때마다 "새로" 만들어야 한다.
 *           하나를 재사용하면 A 사용자의 데이터가 B 사용자에게 새어나간다.
 *   - 브라우저: 딱 "하나"만 만들어 계속 재사용해야 한다.
 *           매번 새로 만들면 페이지를 옮길 때마다 캐시가 날아간다.
 * ────────────────────────────────────────────────────────────
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * staleTime이 0이면(기본값) 하이드레이션 직후 클라이언트가
         * "이 데이터는 이미 낡았다"고 판단해 곧바로 다시 fetch한다.
         * 서버에서 애써 prefetch한 게 헛수고가 되므로, SSR을 쓸 때는
         * 반드시 0보다 큰 값을 준다.
         */
        staleTime: 60 * 1000, // 60초 동안은 "신선함" → 재요청하지 않는다
      },
      dehydrate: {
        /**
         * 기본값은 "성공한 쿼리"만 직렬화한다.
         * 아직 진행 중(pending)인 쿼리까지 포함시키면
         * 서버에서 await 하지 않고 스트리밍으로 넘길 수 있다.
         */
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

/** 브라우저에서 단 하나만 유지되는 QueryClient */
let browserQueryClient: QueryClient | undefined;

/**
 * Client Component(Providers)에서 쓰는 함수.
 * 서버에서 호출되면 매번 새 인스턴스, 브라우저에서는 항상 같은 인스턴스를 준다.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }

  // React가 Suspense로 렌더를 중단했다 재개해도 캐시가 날아가지 않도록 한 번만 만든다.
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
