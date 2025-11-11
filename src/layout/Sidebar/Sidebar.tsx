import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { SIDEBAR_SECTIONS } from "./sidebar.config";
import s from "./Sidebar.module.scss";
import { Logo } from "../../assets/svg";
import { SwitchOrg } from "../../assets/images";

type Props = { open?: boolean; onClose?: () => void; compact?: boolean };

export default function Sidebar({
  open = false,
  onClose,
  compact = false,
}: Props) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`${s.scrim} ${open ? s.show : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={[
          s.sidebar,
          open ? s.open : "",
          compact ? s.compact : "",
        ].join(" ")}
        aria-label="Primary"
        role="dialog"
        aria-modal={open ? "true" : undefined}
      >
        <div className={s.mobileHeader}>
          <img src={Logo} alt="Lendsqr" className={s.mLogo} />
          <button
            className={s.mClose}
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <button className={s.switchRow} type="button">
          <img
            className={s.switchIcon}
            src={SwitchOrg}
            alt=""
            aria-hidden="true"
          />
          <span>Switch Organization</span>
          <i className={`fa-solid fa-angle-down ${s.chev}`} aria-hidden />
        </button>

        <nav className={s.nav}>
          {SIDEBAR_SECTIONS.map((sec, i) => (
            <div className={s.section} key={i}>
              {sec.title && <div className={s.header}>{sec.title}</div>}
              <ul className={s.list}>
                {sec.items.map((it, j) => (
                  <li key={j}>
                    <NavLink
                      to={it.to}
                      ref={i === 0 && j === 0 ? firstLinkRef : undefined}
                      className={({ isActive }) =>
                        [s.item, isActive ? s.active : ""].join(" ")
                      }
                    >
                      <img
                        className={s.icon}
                        src={it.icon}
                        alt=""
                        aria-hidden="true"
                      />
                      <span className={s.label}>{it.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
