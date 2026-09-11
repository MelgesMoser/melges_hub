import portfolio from "../assets/Portifolio.svg";
import hub3ds from "../assets/Hub3DS.svg";
import tars from "../assets/Tars.svg";

const PORTFOLIO_URL = "https://melgesmoser.github.io/portifolio_LauraMelges/";
const CARDS = [
  { title: "Portfólio", image: portfolio, href: PORTFOLIO_URL },
  { title: "Hub 3DS", image: hub3ds, href: PORTFOLIO_URL },
  { title: "Tars", image: tars, href: PORTFOLIO_URL },
];

export default function GamesShowcase() {
  return <section className="relative z-10 pb-16 md:pb-24" aria-label="Projetos em destaque"><div className="container-page"><h2 className="mb-8 pt-12 text-center font-science-gothic text-[21vw] font-black leading-none tracking-[.025em] sm:mb-10 sm:pt-16 sm:text-[14vw] lg:text-[12rem]" aria-label="Sites"><span className="bg-[linear-gradient(180deg,#B774FF_0%,#5E337C_34%,#140C1A_64%,rgba(0,0,0,0)_100%)] bg-clip-text text-transparent">SITES</span></h2><div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">{CARDS.map((card) => <a key={card.title} href={card.href} target="_blank" rel="noreferrer" aria-label={`Abrir projeto ${card.title}`} className="group relative h-56 w-[86vw] flex-none snap-start overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-lg outline-none transition duration-300 hover:-translate-y-1 hover:border-violet/70 hover:shadow-[0_18px_42px_rgba(183,116,255,.18)] focus-visible:border-violet focus-visible:ring-2 focus-visible:ring-violet/60 sm:h-64 sm:w-[420px] md:h-72"><img src={card.image} alt={`Projeto ${card.title}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /></a>)}</div><p className="mt-4 pl-1 text-[10px] font-semibold uppercase tracking-[.32em] text-white/35">Projetos selecionados · clique para conhecer</p></div></section>;
}
