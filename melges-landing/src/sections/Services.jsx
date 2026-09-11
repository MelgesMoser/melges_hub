import portfolioCategory from "../assets/portolio_ctg.svg";
import landingCategory from "../assets/landing_ctg.svg";
import storeCategory from "../assets/loja_ctg.svg";
import siteCategory from "../assets/site_ctg.svg";

const SERVICES = [
  { key: "portfolios", label: "Portfólios", image: portfolioCategory, glow: "hover:shadow-[0_0_34px_rgba(248,70,70,.72)]" },
  { key: "landing", label: "Landing Pages", image: landingCategory, glow: "hover:shadow-[0_0_34px_rgba(183,116,255,.72)]" },
  { key: "lojas", label: "Lojas Virtuais", image: storeCategory, glow: "hover:shadow-[0_0_34px_rgba(245,190,57,.72)]" },
  { key: "institucional", label: "Sites Institucionais", image: siteCategory, glow: "hover:shadow-[0_0_34px_rgba(75,210,129,.72)]" },
];

export default function Services({ onRegisterProject }) {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            O que podemos criar para você
          </h2>
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={onRegisterProject}>
            Cadastrar projeto
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <li key={service.key} className="flex flex-col items-center gap-4">
              <div className={`aspect-square w-full overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 ${service.glow}`}>
                <img
                  src={service.image}
                  alt={service.label}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-center text-sm font-semibold text-violet-light">
                {service.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
