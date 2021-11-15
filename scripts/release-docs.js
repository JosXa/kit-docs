let { format } = await npm("date-fns")
let { context } = await npm("@actions/github")
let { Octokit } = await npm("@octokit/rest")

let { owner, repo } = context.repo

let github = new Octokit({
  auth: await env("GITHUB_TOKEN"),
})

let dateTag = format(new Date(), "yyyy-MM-dd-HH-mm")
let releaseResponse = await github.rest.repos.createRelease(
  {
    owner,
    repo,
    tag_name: dateTag,
  }
)

let name = "docs.json"
let docsPath = path.resolve("data", name)

let uploadResponse =
  await github.rest.repos.uploadReleaseAsset({
    headers,
    owner,
    repo,
    release_id: releaseResponse.data.id,
    name,
    data: await readFile(docsPath),
  })

console.log(
  `url: ${uploadResponse.data.browser_download_url}`
)
