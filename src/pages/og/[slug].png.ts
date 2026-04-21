import type { APIRoute } from "astro";
import { getSortedProjects } from "../../utils/projects";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export async function getStaticPaths() {
  const projects = await getSortedProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

// ⚡ Bolt: Cache font promise to avoid redundant fetches during build
let fontPromise: Promise<ArrayBuffer> | null = null;

export const GET: APIRoute = async ({ props }) => {
  const { project } = props;

  // Load font (Inter Bold) from CDN (WOFF is supported by Satori)
  if (!fontPromise) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fontPromise = fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff",
      { signal: controller.signal },
    )
      .then((res) => {
        return res.arrayBuffer();
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }
  const fontData = await fontPromise;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          height: "100%",
          width: "100%",
          backgroundColor: "#0b0f19",
          color: "white",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
          backgroundImage: "linear-gradient(to bottom right, #0f172a, #1e1b4b)",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "32px",
                padding: "60px",
                backgroundColor: "rgba(255,255,255,0.05)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: "80px",
                      fontWeight: "bold",
                      margin: "0 0 20px 0",
                      backgroundClip: "text",
                      color: "transparent",
                      backgroundImage:
                        "linear-gradient(to right, #818cf8, #f43f5e)",
                    },
                    children: project.data.title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: "32px",
                      color: "#cbd5e1",
                      margin: "0",
                      maxWidth: "800px",
                      lineHeight: "1.4",
                    },
                    children: project.data.intro || project.data.description,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      marginTop: "40px",
                      fontSize: "24px",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    },
                    children: project.data.tag,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "40px",
                right: "60px",
                fontSize: "24px",
                color: "rgba(255,255,255,0.4)",
                fontWeight: "bold",
              },
              children: "Samuel Dulex | Portfolio",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng() as BodyInit, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
