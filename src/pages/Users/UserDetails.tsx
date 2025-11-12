import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../api/users";
import type { UserDetail } from "../../types/user";
import s from "./UserDetails.module.scss";
import { ProfilePix } from "../../assets/images";

const ngn = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

export default function UserDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [tabsOverflow, setTabsOverflow] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getUser(id!)
      .then((u) => alive && setUser(u))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setTabsOverflow(el.scrollWidth > el.clientWidth + 1);
    });
    ro.observe(el);
    setTabsOverflow(el.scrollWidth > el.clientWidth + 1);
    return () => ro.disconnect();
  }, [user]);

  const scrollTabs = (dx: number) =>
    tabsRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  if (loading) return <div className={s.loading}>Loading…</div>;
  if (!user) return <div className={s.loading}>Not found.</div>;

  return (
    <section className={s.wrap} aria-labelledby="ud-title">
      <button className={s.back} onClick={() => nav(-1)}>
        <i className="fa-solid fa-arrow-left-long"></i>
        <span>Back to Users</span>
      </button>

      <div className={s.headerRow}>
        <h1 id="ud-title" className={s.h1}>
          User Details
        </h1>
        <div className={s.actions}>
          <button className={`${s.btn} ${s.outline}`}>Blacklist User</button>
          <button className={`${s.btn} ${s.primary}`}>Activate User</button>
        </div>
      </div>
      <div className={s.profContainer}>
        <div className={s.idCard}>
          <div className={s.profile}>
            <div className={s.avatar} aria-hidden>
              {/* {user.username[0]?.toUpperCase()} */}
              <img src={ProfilePix} alt="Profile pic" />
            </div>
            <div>
              <div className={s.name}>{user.profile.fullName}</div>
              <div className={s.sub}>{user.id}</div>
            </div>
          </div>

          <div className={s.tier}>
            <div className={s.tierLabel}>User’s Tier</div>
            <div className={s.stars} aria-label={`Tier ${user.tier} of 3`}>
              {[1, 2, 3].map((n) => (
                <svg
                  key={n}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  className={n <= user.tier ? s.starOn : s.starOff}
                  aria-hidden
                >
                  <path d="M12 17.3l-6 3.6 1.6-6.9-5.3-4.5 7-.6L12 2l2.7 6.9 7 .6-5.3 4.5L18 21z" />
                </svg>
              ))}
            </div>
          </div>

          <div className={s.balance}>
            <div className={s.money}>{ngn.format(user.balance / 100)}</div>
            <div className={s.sub}>
              {user.accountNumber}/{user.bank}
            </div>
          </div>
        </div>

        <div
          className={[s.tabsWrap, tabsOverflow ? s.hasOverflow : ""].join(" ")}
        >
          {tabsOverflow && (
            <button
              className={`${s.scroll} ${s.left}`}
              onClick={() => scrollTabs(-160)}
              aria-label="Scroll tabs left"
            >
              ‹
            </button>
          )}
          <nav ref={tabsRef} className={s.tabs} aria-label="User sections">
            <button className={`${s.tab} ${s.active}`}>General Details</button>
            <button className={s.tab} disabled>
              Documents
            </button>
            <button className={s.tab} disabled>
              Bank Details
            </button>
            <button className={s.tab} disabled>
              Loans
            </button>
            <button className={s.tab} disabled>
              Savings
            </button>
            <button className={s.tab} disabled>
              App and System
            </button>
          </nav>
          {tabsOverflow && (
            <button
              className={`${s.scroll} ${s.right}`}
              onClick={() => scrollTabs(160)}
              aria-label="Scroll tabs right"
            >
              ›
            </button>
          )}
        </div>
      </div>

      <div className={s.card}>
        <Section
          title="Personal Information"
          rows={[
            ["Full Name", user.profile.fullName],
            ["Phone Number", user.profile.phone],
            ["Email Address", user.profile.email],
            ["BVN", user.profile.bvn],
            ["Gender", user.profile.gender],
            ["Marital Status", user.profile.maritalStatus],
            ["Children", user.profile.children],
            ["Type of Residence", user.profile.residence],
          ]}
        />

        <Section
          title="Education and Employment"
          rows={[
            ["Level of Education", user.education.level],
            ["Employment Status", user.education.employmentStatus],
            ["Sector of Employment", user.education.sector],
            ["Duration of Employment", user.education.duration],
            ["Office Email", user.education.officeEmail],
            [
              "Monthly Income",
              `${user.education.incomeRange[0]}–${user.education.incomeRange[1]}`,
            ],
            ["Loan Repayment", user.education.repayment],
          ]}
        />

        <Section
          title="Socials"
          rows={[
            ["Twitter", user.socials.twitter],
            ["Facebook", user.socials.facebook],
            ["Instagram", user.socials.instagram],
          ]}
        />

        {user.guarantors.map((g, i) => (
          <Section
            key={i}
            title={i === 0 ? "Guarantor" : undefined}
            rows={[
              ["Full Name", g.fullName],
              ["Phone Number", g.phone],
              ["Email Address", g.email],
              ["Relationship", g.relationship],
            ]}
          />
        ))}
      </div>
    </section>
  );
}

type SectionProps = { title?: string; rows: [string, string][] };

function Section({ title, rows }: SectionProps) {
  return (
    <section className={s.group}>
      {title && <h2 className={s.groupTitle}>{title}</h2>}
      <div className={s.grid}>
        {rows.map(([k, v]) => (
          <div key={k} className={s.field}>
            <div className={s.k}>{k}</div>
            <div className={s.v}>{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
