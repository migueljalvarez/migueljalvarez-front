import type { PortafolioType } from "~/types/common";

export default defineEventHandler(async (event) => {
  const portafolioId = getRouterParam(event, "id");

  const portafolio: PortafolioType[] = [
    {
      id: "576754d6-7fa4-4529-8628-207e36cac3a2",
      title: "Tu Radio AR Stereo",
      version: "V1",
      description:
        "AR Stereo es una estación de radio digital que se distingue por su propuesta musical innovadora y fresca, respaldada con el sello oficial de Alfredo Rojas. Su programación de estilo Crossover ofrece una fusión de géneros cuidadosamente seleccionados, logrando una experiencia sonora única, balanceada y con calidad digital superior. Es una alternativa moderna a lo convencional, ideal para quienes buscan una radio en línea con personalidad, visión y autenticidad.",
      technologies: ["Nuxtjs", "Vuejs", "Tailwindcss", "Docker"],
      urlImage: "https://www.arstereo.com/_nuxt/banner.BeTGo23t.png",
      url: "https://www.arstereo.com/",
      initialProblem: "",
      solutionDetails: "",
      state: "Entregado",
      images: [
        {
          url: "https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          url: "https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          url: "https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          url: "https://images.pexels.com/photos/4553036/pexels-photo-4553036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
      ],
    },
  ];

  return portafolio.find((item) => item.id === portafolioId) as PortafolioType;
});
