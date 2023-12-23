import Link from 'next/link';

import { Hero } from 'components/hero';

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Hero />
      <div className="my-4 flex w-full items-center justify-center space-x-4 md:my-8 md:space-x-8">
        <Link
          href={'/shop'}
          className="rounded-2xl border bg-gray-50/10 px-8 py-3 hover:bg-gray-50/30"
        >
          Start Traditional Shopping
        </Link>
        <Link
          href={'/ai-shop'}
          className="rounded-2xl border bg-gray-50/10 px-8 py-3 hover:bg-gray-50/30"
        >
          Try AI-Assisted Shopping
        </Link>
      </div>
    </div>
  );
}
