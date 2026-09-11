export default function About() {
  return (
    <section id="about" className="relative z-10 py-16 md:py-24">
      <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={exampleImage}
            alt="Exemplo de identidade visual desenvolvida pela Melges"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-5">
          <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Seu site não precisa ser igual aos outros.
          </h2>

          <p className="text-sm leading-relaxed text-white/50 md:text-base">
            Desenvolvemos sites personalizados de acordo com a identidade e os objetivos de cada
            negócio. Do layout ao desenvolvimento, cada detalhe é pensado para transmitir
            profissionalismo, facilitar a navegação e proporcionar uma ótima experiência em
            qualquer dispositivo.
          </p>

          <p className="text-sm leading-relaxed text-white/50 md:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          <a href="#projetos" className="btn-primary mt-2">
            Conheça meu trabalho
          </a>
        </div>
      </div>
    </section>
  );
}
import exampleImage from "../assets/Exemplo.svg";
