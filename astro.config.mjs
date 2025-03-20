// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Getting Started with Critter Stack",
      social: {
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
		{
			label: "Lessons",
			autogenerate: { directory: "lessons" },
		},
		{
			label: "How-to Guides",
			autogenerate: { directory: "howto" },
		},
 
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
