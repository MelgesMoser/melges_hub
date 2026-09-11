import logo from "../assets/logo.svg";
import vector from "../assets/VECTOR.svg";

export default function Hero({ onRegisterProject }) {
  return (
    <section className="relative overflow-hidden bg-noise-lines">
      <img src={vector} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="container-page relative z-10 grid grid-cols-1 gap-9 py-14 sm:py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-32">
        {/* Text column */}
        <div className="flex flex-col items-start gap-6">
          <span className="eyebrow">Design & Desenvolvimento Web</span>

          <h1 className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
            Sites que transformam ideias em presença digital.
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-white/50 md:text-base">
            Criamos sites modernos, responsivos e personalizados para empresas que querem se
            destacar no digital, conquistar novos clientes e fortalecer sua presença online.
          </p>

          <button type="button" onClick={onRegisterProject} className="btn-primary mt-2">Quero cadastrar um projeto</button>
        </div>

        <div className="hidden items-center justify-center pb-2 lg:flex lg:justify-end" aria-hidden="true">
          <img src={logo} alt="" className="w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[620px]" />
        </div>
      </div>
    </section>
  );
}
