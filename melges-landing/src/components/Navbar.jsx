import { useState } from "react";
import { X } from "./Icons.jsx";
import logotipo from "../assets/logotipo.svg";

const LINKS = [
  { label: "Início", href: "#top" },
  { label: "Sobre", href: "#about" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar({ onProjects, onHome }) {
  const [open, setOpen] = useState(false);
  const goTo = (event, href) => { event.preventDefault(); onHome?.(); window.setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 0); };

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/80 backdrop-blur-md"
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <a href="#top" onClick={(event) => goTo(event, "#top")} className="flex items-center gap-2" aria-label="Melges — página inicial">
          <img src={logotipo} alt="Melges" className="h-7 w-auto sm:h-8" />
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Navegação principal">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => goTo(event, link.href)}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button type="button" onClick={onProjects} className="btn-primary hidden md:inline-flex">Meus projetos</button>

        <button
          type="button"
          className="grid h-10 min-w-10 place-items-center rounded-lg text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={22} /> : <span className="text-xs font-semibold tracking-wide">MENU</span>}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-white/5 bg-ink-950 px-5 pb-5 pt-4 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => { setOpen(false); goTo(event, link.href); }}
              className="rounded-lg px-3 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button type="button" onClick={() => { setOpen(false); onProjects(); }} className="btn-outline mt-2">Meus projetos</button>
        </div>
      )}
    </header>
  );
}
