import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { TextReader } from './text-reader';

interface TextPageProps {
  params: Promise<{ id: string }>;
}

export default async function TextPage({ params }: TextPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/texts"
          className="hover:bg-accent inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-xl font-semibold">Ридер</h2>
      </div>

      <TextReader textId={id} />
    </div>
  );
}
