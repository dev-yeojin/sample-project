import Link from 'next/link';
import type { PostWithAuthor } from '@/lib/api';

/**
 * 게시글 목록 UI.
 * 순수 프레젠테이션 컴포넌트 — 훅도, 데이터 패칭도 없다.
 * 그래서 Server Component로도, Client Component 안에서도 그대로 쓸 수 있고
 * App Router / Pages Router 양쪽에서 동일한 파일을 공유한다.
 */

function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <article className="card">
      <div className="card__author">
        <span className="card__avatar">{initials(post.author)}</span>
        <div>
          <strong className="card__author-name">{post.author}</strong>
          <span className="card__author-email">{post.authorEmail}</span>
        </div>
      </div>

      <h3 className="card__title">{post.title}</h3>
      <p className="card__body">{post.body}</p>

      <Link href={`/posts/${post.id}`} className="card__link">
        자세히 보기
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default function PostGrid({ posts }: { posts: PostWithAuthor[] }) {
  return (
    <div className="grid">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
