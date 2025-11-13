import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { User, UserStatus } from "../../types/user";
import { useUsers } from "./useUsers";
import s from "./UsersPage.module.scss";

import {
  ActivateUser,
  ActiveUsers,
  BlacklistUser,
  FilterBtn,
  UsersIcon,
  UsersWithLoans,
  UsersWithSavings,
} from "../../assets/images";

const STATUS_COLORS: Record<UserStatus, string> = {
  Active: "#39CD62",
  Inactive: "#545F7D",
  Pending: "#E9B200",
  Blacklisted: "#E4033B",
};

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={s.card}>
      <div className={s.cardIcon} aria-hidden>
        {icon}
      </div>
      <div className={s.cardTitle}>{title}</div>
      <div className={s.cardValue}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: UserStatus }) {
  type PillStyle = React.CSSProperties & { ["--c"]?: string };
  const pillStyle: PillStyle = { ["--c"]: STATUS_COLORS[status] };
  return (
    <span className={s.pill} style={pillStyle}>
      {status}
    </span>
  );
}

type SortKey = "username" | "email" | "dateJoined";
type PageItem = number | "ellipsis";
type Filters = {
  org: string;
  username: string;
  email: string;
  phone: string;
  status: "" | UserStatus;
  date: string; // YYYY-MM-DD
};

export default function UsersPage() {
  const navigate = useNavigate();

  const { data, loading } = useUsers(1, 500);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sort, setSort] = useState<SortKey | undefined>();
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState<Filters>({
    org: "",
    username: "",
    email: "",
    phone: "",
    status: "",
    date: "",
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPos, setFilterPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const tableWrapRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [menuRow, setMenuRow] = useState<string | null>(null);
  const rowMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (filterOpen && filterRef.current && !filterRef.current.contains(t)) {
        setFilterOpen(false);
      }
      if (menuRow && rowMenuRef.current && !rowMenuRef.current.contains(t)) {
        setMenuRow(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFilterOpen(false);
        setMenuRow(null);
      }
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [filterOpen, menuRow]);

  function openFilter(e: React.MouseEvent) {
    const btn = e.currentTarget as HTMLElement;
    const wrap = tableWrapRef.current!;
    const wb = wrap.getBoundingClientRect();
    const bb = btn.getBoundingClientRect();
    setFilterPos({
      top: bb.bottom - wb.top + wrap.scrollTop + 8,
      left: bb.left - wb.left + wrap.scrollLeft,
    });
    setFilterOpen(true);
  }

  const applyFilters = useCallback(
    (u: User) => {
      if (
        filters.org &&
        !u.organization.toLowerCase().includes(filters.org.toLowerCase())
      )
        return false;
      if (
        filters.username &&
        !u.username.toLowerCase().includes(filters.username.toLowerCase())
      )
        return false;
      if (
        filters.email &&
        !u.email.toLowerCase().includes(filters.email.toLowerCase())
      )
        return false;
      if (filters.phone && !u.phone.includes(filters.phone)) return false;
      if (filters.status && u.status !== filters.status) return false;
      if (filters.date) {
        const ymd = new Date(u.dateJoined).toISOString().slice(0, 10);
        if (ymd !== filters.date) return false;
      }
      return true;
    },
    [filters]
  );

  const filtered = useMemo(() => {
    const all = (data?.items ?? []) as User[];
    return all.filter(applyFilters);
  }, [data, applyFilters]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const mul = dir === "asc" ? 1 : -1;
    return [...filtered].sort((a: User, b: User) => {
      switch (sort) {
        case "username":
        case "email":
          return a[sort].localeCompare(b[sort]) * mul;
        case "dateJoined":
          return (
            (new Date(a.dateJoined).getTime() -
              new Date(b.dateJoined).getTime()) *
            mul
          );
      }
    });
  }, [filtered, sort, dir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize]
  );

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(total / pageSize));
    if (page > tp) setPage(tp);
  }, [total, page, pageSize]);

  function toggleSort(col: SortKey) {
    if (sort !== col) {
      setSort(col);
      setDir("asc");
    } else {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} ${time}`;
  }

  function buildPageItems(p: number, tp: number): PageItem[] {
    if (tp <= 6) return Array.from({ length: tp }, (_, i) => i + 1);
    const items: PageItem[] = [1];
    const leftDots = p > 3;
    const rightDots = p < tp - 2;
    if (leftDots) items.push("ellipsis");
    const start = Math.max(2, p - 1);
    const end = Math.min(tp - 1, p + 1);
    for (let x = start; x <= end; x++) items.push(x);
    if (rightDots) items.push("ellipsis");
    items.push(tp);
    return items;
  }
  const pageItems = useMemo(
    () => buildPageItems(page, totalPages),
    [page, totalPages]
  );

  return (
    <section className={s.wrap} aria-labelledby="users-title">
      <h1 id="users-title" className={s.h1}>
        Users
      </h1>

      <div className={s.cards}>
        <StatCard
          title="USERS"
          value="2,453"
          icon={<img src={UsersIcon} alt="" />}
        />
        <StatCard
          title="ACTIVE USERS"
          value="2,453"
          icon={<img src={ActiveUsers} alt="" />}
        />
        <StatCard
          title="USERS WITH LOANS"
          value="12,453"
          icon={<img src={UsersWithLoans} alt="" />}
        />
        <StatCard
          title="USERS WITH SAVINGS"
          value="102,453"
          icon={<img src={UsersWithSavings} alt="" />}
        />
      </div>

      <div
        ref={tableWrapRef}
        className={s.tableWrap}
        role="region"
        aria-label="Users table"
      >
        <table className={s.table}>
          <thead>
            <tr>
              <th>
                <div className={s.thInner}>
                  <span className={s.thLabel}>ORGANIZATION</span>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Organization"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th>
                <div className={s.thInner}>
                  <button
                    type="button"
                    className={s.thBtn}
                    onClick={() => toggleSort("username")}
                    aria-label="Sort by Username"
                  >
                    <span>USERNAME</span>
                    {sort === "username" ? (dir === "asc" ? " ▲" : " ▼") : null}
                  </button>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Username"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th>
                <div className={s.thInner}>
                  <button
                    type="button"
                    className={s.thBtn}
                    onClick={() => toggleSort("email")}
                    aria-label="Sort by Email"
                  >
                    <span>EMAIL</span>
                    {sort === "email" ? (dir === "asc" ? " ▲" : " ▼") : null}
                  </button>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Email"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th>
                <div className={s.thInner}>
                  <span className={s.thLabel}>PHONE NUMBER</span>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Phone Number"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th>
                <div className={s.thInner}>
                  <button
                    type="button"
                    className={s.thBtn}
                    onClick={() => toggleSort("dateJoined")}
                    aria-label="Sort by Date Joined"
                  >
                    <span>DATE JOINED</span>
                    {sort === "dateJoined"
                      ? dir === "asc"
                        ? " ▲"
                        : " ▼"
                      : null}
                  </button>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Date Joined"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th>
                <div className={s.thInner}>
                  <span className={s.thLabel}>STATUS</span>
                  <button
                    type="button"
                    className={s.filterBtn}
                    onClick={openFilter}
                    aria-label="Open filters for Status"
                  >
                    <img src={FilterBtn} alt="" aria-hidden="true" />
                  </button>
                </div>
              </th>

              <th aria-hidden />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={s.loading}>
                  Loading…
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className={s.empty}>
                  No users found.
                </td>
              </tr>
            ) : (
              paged.map((u) => (
                <tr key={u.id}>
                  <td>{u.organization}</td>
                  <td>{u.username}</td>
                  <td className={s.email}>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{formatDate(u.dateJoined)}</td>
                  <td>
                    <StatusPill status={u.status} />
                  </td>
                  <td className={s.kebab}>
                    <button
                      className={s.kebabBtn}
                      aria-haspopup="menu"
                      aria-label="Open row actions"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuRow((v) => (v === u.id ? null : u.id));
                      }}
                    >
                      ⋮
                    </button>

                    {menuRow === u.id && (
                      <div ref={rowMenuRef} className={s.rowMenu} role="menu">
                        <button
                          className={s.rowMenuItem}
                          onClick={() => navigate(`/customers/users/${u.id}`)}
                          role="menuitem"
                        >
                          <i className="fa-regular fa-eye" aria-hidden="true" />
                          View Details
                        </button>
                        <button className={s.rowMenuItem} role="menuitem">
                          <img src={BlacklistUser} alt="user" />
                          Blacklist User
                        </button>
                        <button className={s.rowMenuItem} role="menuitem">
                          <img src={ActivateUser} alt="user" />
                          Activate User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {paged.length > 0 && filterOpen && (
          <div
            ref={filterRef}
            className={s.filterPop}
            style={{ top: filterPos.top, left: filterPos.left }}
            role="dialog"
            aria-label="Filter users"
          >
            <div className={s.fRow}>
              <label>Organization</label>
              <input
                value={filters.org}
                onChange={(e) =>
                  setFilters({ ...filters, org: e.target.value })
                }
                placeholder="Select"
              />
            </div>
            <div className={s.fRow}>
              <label>Username</label>
              <input
                value={filters.username}
                onChange={(e) =>
                  setFilters({ ...filters, username: e.target.value })
                }
                placeholder="User"
              />
            </div>
            <div className={s.fRow}>
              <label>Email</label>
              <input
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
                placeholder="Email"
              />
            </div>
            <div className={s.fRow}>
              <label>Date</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>
            <div className={s.fRow}>
              <label>Phone Number</label>
              <input
                value={filters.phone}
                onChange={(e) =>
                  setFilters({ ...filters, phone: e.target.value })
                }
                placeholder="Phone Number"
              />
            </div>
            <div className={s.fRow}>
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as Filters["status"],
                  })
                }
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
            </div>
            <div className={s.filterActions}>
              <button
                type="button"
                className={s.resetBtn}
                onClick={() => {
                  setFilters({
                    org: "",
                    username: "",
                    email: "",
                    phone: "",
                    status: "",
                    date: "",
                  });
                  setPage(1);
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className={s.applyBtn}
                onClick={() => {
                  setPage(1);
                  setFilterOpen(false);
                }}
              >
                Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={s.tableFooter}>
        <div className={s.rowsInfo}>
          Showing&nbsp;
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          &nbsp;out of {total}
        </div>

        <nav className={s.pager} aria-label="Pagination">
          <button
            className={s.pageBtnn}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </button>

          {pageItems.map((it, idx) =>
            it === "ellipsis" ? (
              <span key={`e${idx}`} className={s.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={it}
                className={[s.pageBtn, it === page ? s.current : ""].join(" ")}
                onClick={() => setPage(it)}
                aria-current={it === page ? "page" : undefined}
              >
                {it}
              </button>
            )
          )}

          <button
            className={s.pageBtnn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </button>
        </nav>
      </div>
    </section>
  );
}
