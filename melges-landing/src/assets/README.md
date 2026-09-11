# Assets pendentes

Estes são os arquivos referenciados no código como placeholders. Substitua-os
pelos arquivos reais mantendo exatamente os mesmos nomes e caminhos (ou
atualize os `src` nos componentes correspondentes).

## Ícones — `/assets/icons/`

| Arquivo | Usado em | Descrição |
|---|---|---|
| `logo.png` | `components/Navbar.jsx` | Logotipo M3LGES no cabeçalho |
| `epic-games-logo.png` | `sections/GamesShowcase.jsx` | Selo "EPIC GAMES" nos cards do carrossel |

## Imagens — `/assets/images/`

| Arquivo | Usado em | Descrição |
|---|---|---|
| `showcase-fortnite.png` | `sections/GamesShowcase.jsx` | Capa "Fortnite Chapitre 3 - Saison 5" |
| `showcase-gradient-1.png` | `sections/GamesShowcase.jsx` | Card gradiente laranja/azul (substitui o div de gradiente, opcional) |
| `showcase-gradient-2.png` | `sections/GamesShowcase.jsx` | Segundo card gradiente, parcialmente visível |
| `service-portfolios.png` | `sections/Services.jsx` | Card "Portfólios" |
| `service-landing-pages.png` | `sections/Services.jsx` | Card "Landing Pages" |
| `service-lojas-virtuais.png` | `sections/Services.jsx` | Card "Lojas Virtuais" |
| `service-sites-institucionais.png` | `sections/Services.jsx` | Card "Sites Institucionais" |
| `about-showcase.png` | `sections/About.jsx` | Imagem da caveira/identidade visual |
| `process-video-thumbnail.png` | `sections/Process.jsx` | Thumbnail do vídeo com botão de play |
| `project-01.png` … `project-06.png` | `sections/Projects.jsx` | Grade "Projetos recentes" (6 imagens) |

> Nota: os dois cards de gradiente do carrossel de jogos (`GamesShowcase.jsx`)
> já são renderizados via CSS (`bg-gradient-to-tr`) como aproximação fiel ao
> design. Se preferir usar as imagens originais, troque o bloco condicional
> `card.variant === "gradient"` para sempre renderizar a tag `<img>`.
