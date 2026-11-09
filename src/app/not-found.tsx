import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100svh] flex-col items-start justify-end px-gutter pb-20">
      <p className="meta mb-6 !text-ash">Error 404 — Scene missing</p>
      <h1 className="display text-[clamp(4rem,16vw,16rem)]">Cut.</h1>
      <p className="serif mt-6 max-w-md text-2xl text-bone/80">This frame didn&apos;t make the final edit.</p>
      <Link href="/" className="meta link-line mt-10 !text-bone">
        Back to the opening
      </Link>
    </main>
  );
}
