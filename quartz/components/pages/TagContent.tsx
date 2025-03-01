import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { pluralize } from "../../util/lang"
import { htmlToJsx } from "../../util/jsx"

const numPages = 10
function TagContent(props: QuartzComponentProps) {
  const { tree, fileData, allFiles } = props
  const slug = fileData.slug

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)

  if (tag === "") {
    const tags = [...new Set(allFiles.flatMap((data) => data.frontmatter?.tags ?? []))]
    const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const tag of tags) {
      tagItemMap.set(tag, allPagesWithTag(tag))
    }

    return (
      <div class="popover-hint">
        <article>
          <p>{content}</p>
        </article>
        <p>Found {tags.length} total tags.</p>
        <div>
          {tags.map((tag) => {
            const pages = tagItemMap.get(tag)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `tags/${tag}`)[0]
            const content = contentPage?.description
            return (
              <div>
                <h2>
                  <a class="internal tag-link" href={`./${tag}`}>
                    #{tag}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <p>
                  {pluralize(pages.length, "item")} with this tag.{" "}
                  {pages.length > numPages && `Showing first ${numPages}.`}
                </p>
                <PageList limit={numPages} {...listProps} />
              </div>
            )
          })}
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag)
      const listProps = {
        ...props,
        allFiles: pages,
      }

    return (
      <div class="popover-hint">
        <article>{content}</article>
        <p>{pluralize(pages.length, "item")} with this tag.</p>
        <div>
          <PageList {...listProps} />
        </div>
      )
    }
  }

  TagContent.css = style + PageList.css
  return TagContent
}) satisfies QuartzComponentConstructor
