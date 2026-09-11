import { Play, Check } from "../components/Icons.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

const STEPS = [
  "Design personalizado",
  "Desenvolvimento moderno",
  "Experiência do usuário",
  "Publicação do site",
];

export default function Process() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container-page">
        <SectionTitle
          title="Tudo o que sua presença digital precisa."
          subtitle="Criamos experiências digitais modernas, funcionais e pensadas para ajudar sua marca a crescer."
        />

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <img
              src="/assets/images/process-video-thumbnail.png"
              alt="Prévia em vídeo do processo de criação de sites"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/30"
              aria-label="Reproduzir vídeo"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-ink-950 shadow-lg">
                <Play size={26} className="ml-1" fill="currentColor" />
              </span>
            </button>
          </div>

          <div className="flex flex-col items-start gap-5 text-left">
            <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
              Como transformamos sua ideia em um site
            </h3>
            <p className="text-sm leading-relaxed text-white/50 md:text-base">
              Do design ao desenvolvimento, cuidamos de cada detalhe para entregar qualidade e
              responsividade.
            </p>

            <ul className="mt-2 flex flex-col gap-4">
              {STEPS.map((step) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-white/80 md:text-base">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
