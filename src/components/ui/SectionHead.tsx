import { sectionTag, type SectionId } from "@/lib/data";

/** "03 — Selected work" tag + bold heading that ends in one serif-italic word. */
export default function SectionHead({
  id,
  label,
  lead,
  accent,
  className = "",
  as: Tag = "h2",
}: {
  id: SectionId;
  label: string;
  lead: string;
  accent: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={className}>
      <p className="tag rv">
        <b>{sectionTag(id)}</b>
        <span aria-hidden>—</span>
        {label}
      </p>
      <Tag className="h2" id={`${id}-title`}>
        <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
          <span>
            {lead} <em>{accent}</em>
          </span>
        </span>
      </Tag>
    </div>
  );
}
