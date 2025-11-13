import { useEffect } from "react";
import { useMatches } from "react-router-dom";
import s from "./SectionPlaceholder.module.scss";

export default function SectionPlaceholder() {
  const m = useMatches();
  const title = (m[m.length - 1]?.handle as { title?: string })?.title ?? "—";

  useEffect(() => {
    document.title = `${title} • Lendsqr`;
  }, [title]);

  return (
    <section className={s.wrap} aria-labelledby="page-title">
      <h1 id="page-title" className={s.title}>
        {title}
      </h1>
    </section>
  );
}
