import ResponsiveImage from "./ResponsiveImage.jsx";
import { FaGithub } from "react-icons/fa";
import { FiActivity, FiTrendingUp, FiShield, FiExternalLink } from "react-icons/fi";

function ProjectCard({ project, index, onOpenCaseStudy }) {
  const { title, description, tech = [], image, demoLink, repoLink, status, metrics } = project;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 hover:border-white/25 hover:bg-black/50 transition-colors duration-200">
      {/* Image / banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <ResponsiveImage
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            widths={[320, 480, 640, 768]}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-amber-900/30" />
        )}
        {status && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
            {status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="mb-4 text-sm text-gray-300">{description}</p>

        {metrics && (
          <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-white/80">
              <FiTrendingUp className="opacity-70 shrink-0" /> Perf {metrics.perf ?? "—"}
            </div>
            <div className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-white/80">
              <FiShield className="opacity-70 shrink-0" /> A11y {metrics.a11y ?? "—"}
            </div>
            <div className="flex items-center gap-1 rounded-md bg-white/5 border border-white/10 px-2 py-1 text-white/80">
              <FiActivity className="opacity-70 shrink-0" /> Bundle {metrics.bundle ?? "—"}
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/80">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {onOpenCaseStudy && (
            <button
              onClick={onOpenCaseStudy}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-white/40 px-3 py-2 text-sm font-semibold text-white transition-colors"
            >
              Case Study
            </button>
          )}
          {demoLink ? (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md btn-accent px-3 py-2 text-sm font-semibold"
            >
              <FiExternalLink /> Live
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 text-white/30 cursor-not-allowed px-3 py-2 text-sm font-semibold" aria-disabled="true">
              <FiExternalLink /> Live
            </span>
          )}
          {repoLink ? (
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-white/40 px-3 py-2 text-sm font-semibold text-white transition-colors"
            >
              <FaGithub /> Code
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 text-white/30 cursor-not-allowed px-3 py-2 text-sm font-semibold" aria-disabled="true">
              <FaGithub /> Code
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
