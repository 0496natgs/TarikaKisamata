import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"
import Landing from "./Landing"
import { JSResourceToScriptElement, StaticResources } from "../util/resources"
import { FullSlug, RelativeURL, joinSegments } from "../util/path"
import { visit } from "unist-util-visit"
import { Root, Element } from "hast"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent
}

export function pageResources(
  baseDir: FullSlug | RelativeURL,
  fileData: QuartzPluginData,
  staticResources: StaticResources,
): StaticResources {
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json")
  const contentIndexScript = `const fetchData = fetch(\`${contentIndexPath}\`).then(data => data.json())`

  const resources: StaticResources = {
    css: [
      {
        content: joinSegments(baseDir, "index.css"),
      },
      ...staticResources.css,
    ],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...staticResources.js,
    ],
  }

  if (fileData.hasMermaidDiagram) {
    resources.js.push({
      script: mermaidScript,
      loadTime: "afterDOMReady",
      moduleType: "module",
      contentType: "inline",
    })
    resources.css.push({ content: mermaidStyle, inline: true })
  }

  // NOTE: we have to put this last to make sure spa.inline.ts is the last item.
  resources.js.push({
    src: joinSegments(baseDir, "postscript.js"),
    loadTime: "afterDOMReady",
    moduleType: "module",
    contentType: "external",
  })

  return resources
}

export function renderPage(
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // process transcludes in componentData
  visit(componentData.tree as Root, "element", (node, _index, _parent) => {
    if (node.tagName === "blockquote") {
      const classNames = (node.properties?.className ?? []) as string[]
      if (classNames.includes("transclude")) {
        const inner = node.children[0] as Element
        const blockSlug = inner.properties?.["data-slug"] as FullSlug
        const blockRef = node.properties!.dataBlock as string

        // TODO: avoid this expensive find operation and construct an index ahead of time
        let blockNode = componentData.allFiles.find((f) => f.slug === blockSlug)?.blocks?.[blockRef]
        if (blockNode) {
          if (blockNode.tagName === "li") {
            blockNode = {
              type: "element",
              tagName: "ul",
              children: [blockNode],
            }
          }

          node.children = [
            blockNode,
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal"] },
              children: [{ type: "text", value: `Link to original` }],
            },
          ]
        }
      }
    }
  })

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  } = components
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => (
        <BodyComponent {...componentData} />
      ))}
    </div>
  )

  const LandingComponent = Landing()

  const doc = (
    <html>
      <Head {...componentData} />
      <body data-slug={slug}>
        <div class="marquee">
          <p>
            Nat G. Sarmiento • Writer | Designer | Artist • the manuever manual • the blueprint bundle • the
            playbook pack • the approach arsenal • the strategy suitcase • the resource repository • 
            Nat G. Sarmiento • Writer | Designer | Artist • the manuever manual • the blueprint bundle • the
            playbook pack • the approach arsenal • the strategy suitcase • the resource repository • 
            Nat G. Sarmiento • Writer | Designer | Artist • the manuever manual • the blueprint bundle • the
            playbook pack • the approach arsenal • the strategy suitcase • the resource repository
          </p>
        </div>
        {slug === "index" && <LandingComponent {...componentData} />}
        {slug !== "index" && (
          <div id="quartz-root" class="page">
            <Body {...componentData}>
              {LeftComponent}
              <div class="center">
                <div class="page-header">
                  <Header {...componentData}>
                    {header.map((HeaderComponent) => (
                      <HeaderComponent {...componentData} />
                    ))}
                  </Header>
                  <div class="popover-hint">
                    {beforeBody.map((BodyComponent) => (
                      <BodyComponent {...componentData} />
                    ))}
                  </div>
                </div>
                <Content {...componentData} />
              </div>
              {RightComponent}
            </Body>
            <Footer {...componentData} />
          </div>
        )}
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}
