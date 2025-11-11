import { AngleDown, DP } from "../../assets/images";
import { Logo } from "../../assets/svg";
import s from "./TopNav.module.scss";

export default function TopNav({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className={s.nav} role="banner">
      <div className={s.left}>
        <button className={s.menu} onClick={onMenu} aria-label="Open menu">
          <i className="fa-solid fa-bars"></i>
        </button>
        <img src={Logo} alt="lendsqr" className={s.logo} />
      </div>
      <form
        className={s.search}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          aria-label="Search for anything"
          placeholder="Search for anything"
          type="search"
        />
        <button aria-label="Search">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M21 21l-4.3-4.3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </form>

      <div className={s.right}>
        <a className={s.docs} href="#" onClick={(e) => e.preventDefault()}>
          Docs
        </a>
        <i className="fa-regular fa-bell"></i>
        <img src={DP} alt="" className={s.avatar} />
        <button
          className={s.profile}
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <span className={s.name}>Adedeji</span>
          <img src={AngleDown} alt="angle-down" className={s.down} />
        </button>
      </div>
    </header>
  );
}
