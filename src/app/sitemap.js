import { getAllPicos } from "../services/supabase/picosService";

export default async function sitemap() {

  const picos = await getAllPicos();

  const picoUrls = picos.map((pico) => ({
    url: `https://enciclosurf.com/pico/${pico.slug}`,
    lastModified: new Date(),
  }));

  return [

    {
      url: "https://enciclosurf.com",
      lastModified: new Date(),
    },

    ...picoUrls,

  ];
}