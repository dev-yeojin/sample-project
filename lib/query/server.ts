import { cache } from 'react';
import { makeQueryClient } from './queryClient';

/**
 * ────────────────────────────────────────────────────────────
 *  Server Component 전용 QueryClient
 *
 *  React의 `cache()`로 감싸면 "하나의 요청(request)" 동안에는
 *  몇 번을 호출하든 같은 QueryClient를 돌려준다.
 *
 *  덕분에 page.tsx와 layout.tsx가 각자 prefetch를 해도
 *  결과가 하나의 캐시에 모이고, dehydrate() 한 번으로 전부 넘길 수 있다.
 *  요청이 끝나면 버려지므로 사용자 간 데이터 유출도 없다.
 *
 *  ⚠️ 이 파일은 Client Component에서 import하면 안 된다.
 *     (`cache()`는 서버 전용 API다) → 그래서 queryClient.ts와 파일을 나눴다.
 * ────────────────────────────────────────────────────────────
 */
export const getServerQueryClient = cache(makeQueryClient);
