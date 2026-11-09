import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import Footer from "@/components/layout/Footer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = project.title === project.category ? project.title : `${project.title} — ${project.category}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${title} | ${siteConfig.name}`,
      description: project.summary,
      images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: project.summary,
      images: [project.cover.src],
    },
  };
}

type Params = Promise<{ slug: string }>;

/** Params are read inside Suspense so client navigations get an instant shell. */
export default function ProjectPage({ params }: { params: Params }) {
  return (
    <>
      <main id="main">
        <Suspense fallback={<div className="h-[100svh] bg-ink" aria-busy="true" />}>
          <Project params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function Project({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { next } = getAdjacentProjects(slug);
  return <ProjectDetail project={project} next={next} />;
}
