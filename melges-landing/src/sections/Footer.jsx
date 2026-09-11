import { Facebook, Instagram, Twitter, Linkedin } from "../components/Icons.jsx";
import logoRascunho from "../assets/logo-rascunho.svg";
import vector from "../assets/VECTOR.svg";

const ABOUT_LINKS = ["Zeus", "Portfólio", "Careers", "Contact us"];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer id="contato" className="relative z-10 overflow-hidden border-t border-white/5 pt-0">
      <div className="relative isolate py-16 text-center sm:py-20"><img src={vector} alt="" aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-auto w-full opacity-25" /><img src={logoRascunho} alt="Melges" className="mx-auto w-[min(72vw,500px)] opacity-80" /><p className="mt-5 text-xs font-semibold uppercase tracking-[.35em] text-white/45">Vamos criar algo memorável</p></div>
      <div className="container-page grid grid-cols-1 gap-12 pb-16 sm:grid-cols-3">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            Camos Lab
          </p>
          <p className="font-display text-2xl font-extrabold text-white">LAB</p>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <span className="text-sm text-white/40">@Lorem</span>
        </div>

        <nav aria-label="Sobre">
          <h3 className="mb-4 text-sm font-semibold text-white">About us</h3>
          <ul className="flex flex-col gap-3">
            {ABOUT_LINKS.map((link) => (
              <li key={link}>
                <a href="#" className="text-sm text-white/50 transition-colors hover:text-white">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-white">Contact us</h3>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <p className="mt-3 text-sm font-medium text-white/70">+908 89097 890</p>

          <div className="mt-6 flex gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-violet hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        Copyright © 2022 prodesigner. All rights reserved.
      </div>
    </footer>
  );
}
