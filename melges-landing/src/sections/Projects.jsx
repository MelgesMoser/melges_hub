import SectionTitle from "../components/SectionTitle.jsx";
import photo1 from "../assets/foto-1.svg";
import photo2 from "../assets/foto-2.svg";
import photo3 from "../assets/foto-3.svg";
import photo4 from "../assets/foto-4.svg";
import photo5 from "../assets/foto-5.svg";
import photo6 from "../assets/foto-6.svg";

const PROJECTS = [
  { key: "p1", image: photo1, label: "Projeto recente 1" },
  { key: "p2", image: photo2, label: "Projeto recente 2" },
  { key: "p3", image: photo3, label: "Projeto recente 3" },
  { key: "p4", image: photo4, label: "Projeto recente 4" },
  { key: "p5", image: photo5, label: "Projeto recente 5" },
  { key: "p6", image: photo6, label: "Projeto recente 6" },
];

export default function Projects({ onRegisterProject }) {
  return (
    <section id="projetos" className="relative z-10 py-16 md:py-24">
      <div className="container-page">
        <SectionTitle
          title="Projetos recentes"
          subtitle="Alguns dos projetos desenvolvidos para diferentes marcas, empresas e ideias."
        />

        <div className="mt-7 flex justify-center">
          <button type="button" className="btn-outline" onClick={onRegisterProject}>
            Cadastrar projeto
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <li
              key={project.key}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <img
                src={project.image}
                alt={project.label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative diagonal divider lines */}
      <div className="container-page mt-16 flex flex-col items-end gap-3" aria-hidden="true">
        <span className="h-px w-40 -skew-y-6 bg-white/10 sm:w-64" />
        <span className="h-px w-56 -skew-y-6 bg-white/10 sm:w-80" />
        <span className="h-px w-72 -skew-y-6 bg-white/10 sm:w-96" />
      </div>
    </section>
  );
}
