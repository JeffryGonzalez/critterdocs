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
		
			items: [
				{ label: "Overview", link: "/lessons/01-overview" },
				{ label: "Events", autogenerate: { directory: "lessons/Events" } },
				{ label: "Messages", autogenerate: { directory: "lessons/Messages" } },
				{ label: "APIs", autogenerate: { directory: "lessons/APIs" } },


			
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
      ],
    }),
  ],
});
