import { QuartzComponentConstructor } from "./types"
import landingStyle from "./styles/landing.scss"

export const TOTAL_CARDS = 20
export const CARDS = {
  basics: (
    <a href={"/basics"}>
      <div class="card card-1">
        <p class="card-title">Who am I?</p>
        <p class="card-subhead">Issue 001</p>
        <img src="/static/1-illo.png" class="card-illustration-1" />
      </div>
    </a>
  ),
  "getting-started": (
    <a href={"/getting-started"}>
      <div class="card card-2">
        <p class="card-title">Getting Started</p>
        <p class="card-subhead">Issue 002</p>
        <img src="/static/2-illo.png" class="card-illustration-2" />
      </div>
    </a>
  ),
  "growing-people": (
    <a href={"/growing-people"}>
      <div class="card card-3">
        <p class="card-title">Ankrverse</p>
        <p class="card-subhead">Issue 003</p>
        <img src="/static/3-illo.png" class="card-illustration-3" />
      </div>
    </a>
  ),
  "superboosting-ideas": (
    <a href={"/superboosting-ideas"}>
      <div class="card card-4">
        <p class="card-title">Super- boosting Ideas</p>
        <p class="card-subhead">Issue 004</p>
        <img src="/static/4-illo.png" class="card-illustration-4" />
      </div>
    </a>
  ),
  maintenance: (
    <a href={"/maintenance"}>
      <div class="card card-5">
        <p class="card-title">Maintenance</p>
        <p class="card-subhead">Issue 005</p>
        <img src="/static/5-illo.png" class="card-illustration-5" />
      </div>
    </a>
  ),
}

export default (() => {
  function LandingComponent() {
    return (
      <div>
        <div class="content-container">
          <p class="landing-header">Tarika Kisamata</p>
          <p class="page-subhead">
            Website Guide •{" "}
            <a href="https://tarikakisamata.com/" target="_blank">
              Ankrverse
            </a>{" "}
            •{" "}
            <a href="https://tarikakisamata.com" target="_blank">
              Contribute
            </a>{" "}
            •{" "}
            <a href="https://tarikakisamata/credits" target="_self">
              Credits
            </a>
          </p>

          <div class="issue-container">
            {Object.values(CARDS)}
            {Array(TOTAL_CARDS - Object.keys(CARDS).length)
              .fill(0)
              .map(() => (
                <div class="card card-coming">
                  <p class="card-title">Coming Soon</p>
                  <p class="card-subhead">Issue XXX</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  LandingComponent.css = landingStyle
  return LandingComponent
}) satisfies QuartzComponentConstructor
