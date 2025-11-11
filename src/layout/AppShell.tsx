import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import TopNav from "./TopNav/TopNav";
import s from "./AppShell.module.scss";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={s.shell}>
      <TopNav onMenu={() => setOpen(true)} />
      <div className={s.body}>
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className={s.main}>{children}</main>
      </div>
    </div>
  );
}
