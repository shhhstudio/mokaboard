import { GatsbyNode } from "gatsby"

export const onCreatePage: GatsbyNode["onCreatePage"] = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"

    createPage(page)
  }
}