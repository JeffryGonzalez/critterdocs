// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "JasperFx: Critter Stack",
      social: [{
      label: "GitHub",
      href:"https://github.com/JeffryGonzalez/critterdocs",
        icon: "github",
      }],
      sidebar: [
        {
          label: "Tutorials",

          items: [
            { label: "Overview", link: "/tutorials/01-overview" },
            { label:"Getting Started", autogenerate: { directory: "tutorials/Intro" } },
           
            { label: "Events", autogenerate: { directory: "tutorials/Events" } },
            {
              label: "Messages",
              autogenerate: { directory: "tutorials/Messages" },
            },
            { label: "APIs", autogenerate: { directory: "tutorials/APIs" } },
          ],
        },
        {
          label: "How-to Guides",
          autogenerate: { directory: "howto" },
        },

        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Explanation",
          autogenerate: { directory: "explanation" },
        }
      ],
    }),
  ],
});
