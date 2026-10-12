/* Brand logos are official devicon "original" SVGs or Simple Icons paths (colour baked in),
   copied into /public/logos with their licence files. Concept skills get thin line icons. */

const DEVICON = [
  "python", "java", "c", "cplusplus", "csharp", "r", "javascript", "typescript", "react", "nextjs",
  "html5", "css3", "tailwindcss", "dotnetcore", "entityframeworkcore", "postgresql", "mysql",
  "microsoftsqlserver", "redis", "docker", "nginx", "cloudflare", "amazonwebservices", "redhat",
  "ubuntu", "linux", "githubactions", "opencv", "numpy", "git", "github", "jira",
] as const;
const SIMPLE = ["cisco", "virtualbox", "credly"] as const;

const BRAND: Record<string, string> = Object.fromEntries([
  ...DEVICON.map((k) => [k, `/logos/devicon/${k}.svg`]),
  ...SIMPLE.map((k) => [k, `/logos/simple-icons/${k}.svg`]),
]);

/* 24×24 line icons, 1.5px stroke, drawn in the same quiet style. */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const CONCEPT: Record<string, React.ReactNode> = {
  sql: (<g {...P}><ellipse cx="12" cy="5.5" rx="7" ry="2.5" /><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" /><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></g>),
  asm: (<g {...P}><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" /></g>),
  api: (<g {...P}><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" /></g>),
  queue: (<g {...P}><rect x="3" y="8" width="4" height="8" rx="1" /><rect x="10" y="8" width="4" height="8" rx="1" /><rect x="17" y="8" width="4" height="8" rx="1" /><path d="M7 12h3M14 12h3" /></g>),
  schema: (<g {...P}><rect x="3" y="3" width="7" height="6" rx="1" /><rect x="14" y="3" width="7" height="6" rx="1" /><rect x="8.5" y="15" width="7" height="6" rx="1" /><path d="M6.5 9v3h11V9M12 12v3" /></g>),
  llm: (<g {...P}><path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H11l-4 4v-4h-.5A2.5 2.5 0 014 13.5z" /><path d="M8.5 9.5h7M8.5 12.5h4" /></g>),
  agent: (<g {...P}><rect x="5" y="8" width="14" height="11" rx="3" /><path d="M12 4v4M9.5 13h.01M14.5 13h.01M9.5 16h5" /><circle cx="12" cy="3.5" r="1" /></g>),
  chart: (<g {...P}><path d="M4 4v16h16" /><circle cx="8" cy="15" r=".9" /><circle cx="11" cy="12.5" r=".9" /><circle cx="14" cy="11" r=".9" /><circle cx="17.5" cy="8" r=".9" /><path d="M6 17l13-11" strokeDasharray="2 2" /></g>),
  game: (<g {...P}><path d="M7 8h10a4 4 0 014 4v1.5a3.5 3.5 0 01-6.2 2.2L13.5 14h-3l-1.3 1.7A3.5 3.5 0 013 13.5V12a4 4 0 014-4z" /><path d="M7.5 11v3M6 12.5h3M15.5 11.5h.01M17.5 13h.01" /></g>),
  oop: (<g {...P}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></g>),
  lock: (<g {...P}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 018 0v3M12 14.5v2.5" /></g>),
  agile: (<g {...P}><path d="M20 12a8 8 0 11-2.3-5.7" /><path d="M20 4v4h-4" /><path d="M9 12l2 2 4-4" /></g>),
  cycle: (<g {...P}><circle cx="12" cy="4.5" r="2" /><circle cx="19.5" cy="12" r="2" /><circle cx="12" cy="19.5" r="2" /><circle cx="4.5" cy="12" r="2" /><path d="M14 5.3a7.5 7.5 0 014.7 4.7M18.7 14a7.5 7.5 0 01-4.7 4.7M10 18.7A7.5 7.5 0 015.3 14M5.3 10A7.5 7.5 0 0110 5.3" /></g>),
  network: (<g {...P}><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><circle cx="12" cy="13" r="1.6" /><path d="M12 7v4.4M10.7 14l-4.3 2.8M13.3 14l4.3 2.8M7 18h10" /></g>),
  physics: (<g {...P}><circle cx="12" cy="12" r="1.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)" /></g>),
  bolt: (<g {...P}><path d="M13 3L5 13.5h6L10 21l8-10.5h-6z" /></g>),
  cap: (<g {...P}><path d="M2.5 9.5L12 5l9.5 4.5L12 14z" /><path d="M6.5 11.5V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.5M21.5 9.5v5" /></g>),
};

export function isBrand(key: string) {
  return key in BRAND;
}

export default function TechLogo({ k, size = 24, alt = "", className = "" }: { k: string; size?: number; alt?: string; className?: string }) {
  if (isBrand(k)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={BRAND[k]} width={size} height={size} alt={alt} loading="lazy" decoding="async" className={className} style={{ width: size, height: size, objectFit: "contain" }} />
    );
  }
  const icon = CONCEPT[k] ?? CONCEPT.api;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={className} style={{ color: "var(--ink)" }}>
      {icon}
    </svg>
  );
}
