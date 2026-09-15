import {
  Home,
  ChartBar,
  Tv,
  Bell,
  User,
  WalletCards,
} from "./Icons.jsx";
import logo from "../assets/logo.svg";
import logotipo from "../assets/logotipo.svg";

const NAV_ITEMS = [
  { icon: Home, label: "Início", section: "home" },
  { icon: Tv, label: "Meus projetos", section: "projects" },
  { icon: ChartBar, label: "Visão geral", section: "overview" },
  { icon: Bell, label: "Notificações", section: "help" },
];

const NAV_ITEMS_BOTTOM = [
  { icon: User, label: "Minha conta", section: "account" },
];

const ADMIN_ITEMS = [
  { icon: WalletCards, label: "Financeiro", section: "pricing" },
];

/**
 * Fixed vertical icon rail shown on the left edge of the viewport (desktop only).
 * Hidden below the `lg` breakpoint in favor of the top navbar.
 */
export default function Sidebar({ onNavigate, activeSection, loggedIn, isAdmin, open, onToggle, hasUnreadNotifications }) {
  const itemClass = (section) => `flex h-11 items-center gap-4 rounded-xl text-sm font-medium transition-colors ${open ? "px-3" : "justify-center px-0"} ${activeSection === section ? "bg-violet/15 text-violet-light" : "text-white/55 hover:bg-white/5 hover:text-white"}`;
  return (
    <aside
      className={`fixed bottom-5 left-5 top-5 z-[60] hidden flex-col rounded-[2rem] border border-white/10 bg-ink-950/90 py-5 shadow-[0_22px_70px_rgba(0,0,0,.42)] backdrop-blur-xl transition-[width,padding] duration-300 lg:flex ${open ? "w-64 px-4" : "w-20 px-3"}`}
      aria-label="Navegação lateral"
    >
      <button type="button" onClick={onToggle} className={`flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] py-2.5 text-left transition hover:bg-violet/10 ${open ? "px-2.5" : "justify-center"}`} aria-label={open ? "Recolher menu lateral" : "Expandir menu lateral"}><img src={logo} alt="" className="h-10 w-10 flex-none" />{open && <span><img src={logotipo} alt="Melges" className="h-6 w-auto" /><small className="mt-1 block text-[9px] font-bold uppercase tracking-[.22em] text-violet-light">{isAdmin ? "Administrator space" : "Client space"}</small></span>}</button>

      {open && <p className="mt-7 px-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/30">Navegação</p>}
      <nav className={`${open ? "mt-3" : "mt-8"} flex flex-col gap-2`}>
        {NAV_ITEMS.map(({ icon: Icon, label, section }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(section)}
            title={`${label}${section !== "home" && !loggedIn ? " — requer login" : ""}`}
            className={itemClass(section)}
          >
            <span className="relative grid place-items-center"><Icon size={20} />{section === "help" && hasUnreadNotifications && <i className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-violet-light shadow-[0_0_10px_rgba(184,124,250,.9)]" />}</span>
            {open && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>

      {isAdmin && <nav className="mt-5 flex flex-col gap-2 border-t border-violet/20 pt-4">
        {open && <p className="px-2 text-[10px] font-bold uppercase tracking-[.2em] text-violet-light/70">Administração</p>}
        {ADMIN_ITEMS.map(({ icon: Icon, label, section }) => <button key={section} type="button" onClick={() => onNavigate(section)} title={label} className={itemClass(section)}><Icon size={20} />{open && <span className="whitespace-nowrap">{label}</span>}</button>)}
      </nav>}

      <nav className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4">
        {NAV_ITEMS_BOTTOM.map(({ icon: Icon, label, section }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(section)}
            title={`${label}${!loggedIn ? " — requer login" : ""}`}
            className={itemClass(section)}
          >
            <Icon size={20} />
            {open && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
