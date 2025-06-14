// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightAutoSidebar from 'starlight-auto-sidebar'
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "JasperFx Training",
      customCss: ['./src/styles/global.css'],
      social: [{
      label: "GitHub",
      href:"https://github.com/JeffryGonzalez/critterdocs",
        icon: "github",
      }],
      plugins: [starlightAutoSidebar()],
      sidebar: [
        {
          label: "Tutorials",

          autogenerate: { directory: 'tutorials'}
        },
        {
            label: 'How-To Guides',
            autogenerate: { directory: 'howto' }
        },
        {
            label: 'Reference',
            autogenerate: { directory: 'reference' }
        },
        { 
            label: 'Deep Dives',
            autogenerate: { directory: 'explanation' }
        }
    
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});