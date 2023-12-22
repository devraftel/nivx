import { Title } from 'components/title';
import Image from 'next/image';
import Link from 'next/link';
import main from '../main.png';

export default async function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="py-4 md:py-6">
        <Image src={main} height={500} width={600} alt="Main Image" priority />
      </div>
      <Title />
      <div className="my-4 flex w-full items-center justify-center space-x-4 md:my-8 md:space-x-8">
        <Link
          href={'/normal'}
          className="rounded-2xl border bg-gray-50/10 px-8 py-3 hover:bg-gray-50/30"
        >
          Shop in Normal Way
        </Link>
        <Link
          href={'/smart'}
          className="rounded-2xl border bg-gray-50/10 px-8 py-3 hover:bg-gray-50/30"
        >
          Shop in Smart Way
        </Link>
      </div>
    </div>
  );
}
