/**
 * ────────────────────────────────────────────────────────────
 *  공통 API 레이어
 *  App Router 프로젝트와 Pages Router 프로젝트가 "완전히 동일한" 파일을 사용한다.
 *  → 두 프로젝트의 차이는 "이 함수를 누가/언제/어디서 호출하는가" 뿐이다.
 * ────────────────────────────────────────────────────────────
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/** 렌더링 방식의 차이(로딩 상태 유무)를 눈으로 보기 위한 인위적 지연 */
const ARTIFICIAL_DELAY_MS = 800;

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export type PostWithAuthor = Post & {
  author: string;
  authorEmail: string;
};

/**
 * 캐시 모드
 * - 'dynamic': 매 요청마다 새로 가져온다 (SSR / getServerSideProps / CSR)
 * - 'static' : 빌드 시점에 한 번 가져와 캐싱한다 (SSG / getStaticProps)
 *
 * `next` 옵션은 Next.js 서버 런타임에서만 해석되고,
 * 브라우저/일반 Node fetch에서는 무시되므로 어느 환경에서 호출해도 안전하다.
 */
export type CacheMode = 'dynamic' | 'static';

function cacheInit(mode: CacheMode): RequestInit {
  return mode === 'static'
    ? { next: { revalidate: 3600 } } as RequestInit
    : { cache: 'no-store' };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request<T>(path: string, mode: CacheMode): Promise<T> {
  await sleep(ARTIFICIAL_DELAY_MS);

  const res = await fetch(`${BASE_URL}${path}`, cacheInit(mode));
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${path} (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** 게시글 목록 + 작성자 정보를 합쳐서 반환 */
export async function getPosts(mode: CacheMode = 'dynamic'): Promise<PostWithAuthor[]> {
  const [posts, users] = await Promise.all([
    request<Post[]>('/posts?_limit=9', mode),
    request<User[]>('/users', mode),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));

  return posts.map((post) => ({
    ...post,
    author: userMap.get(post.userId)?.name ?? '알 수 없음',
    authorEmail: userMap.get(post.userId)?.email ?? '',
  }));
}

/** 게시글 상세 */
export async function getPost(
  id: string | number,
  mode: CacheMode = 'dynamic',
): Promise<PostWithAuthor | null> {
  try {
    const post = await request<Post>(`/posts/${id}`, mode);
    const user = await request<User>(`/users/${post.userId}`, mode);

    return {
      ...post,
      author: user.name,
      authorEmail: user.email,
    };
  } catch {
    return null;
  }
}

/** 렌더링이 "언제, 어디서" 일어났는지 눈으로 확인하기 위한 타임스탬프 */
export function nowLabel(): string {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul',
  }).format(new Date());
}
