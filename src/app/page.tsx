import type { CSSProperties } from "react";
import ParticleField from "./components/ParticleField";

const assistantCards = [
  {
    code: "A-01",
    title: "深度对话",
    description: "理解上下文与真实意图，从零散问题中提炼出清晰、可执行的答案。",
    status: "在线",
  },
  {
    code: "A-02",
    title: "智能创作",
    description: "从策略、文案到创意草案，让高质量内容快速从想法走向完成。",
    status: "在线",
  },
  {
    code: "A-03",
    title: "任务推演",
    description: "拆解复杂任务、规划行动路径，在每个关键节点提供可靠辅助。",
    status: "进化中",
  },
];

const projects = [
  {
    number: "01",
    type: "AI WORKSPACE",
    title: "智能知识中枢",
    description: "连接内容、任务与思考，让个人知识真正流动起来。",
    accent: "cyan",
  },
  {
    number: "02",
    type: "CREATIVE ENGINE",
    title: "未来创作实验室",
    description: "融合人类想象与 AI 能力，探索新一代创作方式。",
    accent: "violet",
  },
  {
    number: "03",
    type: "AUTOMATION",
    title: "自动化工作流",
    description: "把繁琐流程变成可靠、清晰、可重复的数字能力。",
    accent: "amber",
  },
];

export default function Home() {
  return (
    <main>
      <ParticleField />
      <div className="gridBackdrop" aria-hidden="true" />

      <nav className="nav logoEntrance" aria-label="主导航">
        <a className="brand" href="#top" aria-label="晴天盒子首页">
          <span className="brandSignal"><i /></span>
          <span>
            晴天盒子 <b>SUNNYBOX AI</b>
          </span>
        </a>
        <div className="navLinks">
          <a href="#top">首页</a>
          <a href="/chat">AI助手</a>
          <a href="/account">用户中心</a>
          <a className="navContact" href="#about">关于SunnyBox AI</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="heroCopy reveal revealOne">
          <p className="eyebrow"><span>●</span> INTELLIGENCE, AMPLIFIED</p>
          <h1>
            SunnyBox
            <span>AI</span>
          </h1>
          <p className="heroIntro">
            不只是回答问题，而是与你一起<span>完成事情</span>。
          </p>
          <p className="heroText">
            晴天盒子 SunnyBox AI 是由张YQ与徐XH打造的个人智能产品。它理解语境、组织思考并推进任务，让先进 AI 成为每个人都能自然使用的生产力。
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="/chat">
              AI助手 <span>↗</span>
            </a>
            <a className="secondaryButton" href="#product">
              了解晴天盒子
            </a>
          </div>
          <div className="systemLine">
            <span>SYSTEM READY</span>
            <i />
            <span>SUNNYBOX CORE / ONLINE</span>
          </div>
        </div>

        <div className="robotStage reveal revealTwo" aria-label="SunnyBox AI 智能核心">
          <div className="orbit orbitOne" />
          <div className="orbit orbitTwo" />
          <div className="robot">
            <div className="antenna"><i /></div>
            <div className="robotHead">
              <div className="robotEar left" />
              <div className="robotEar right" />
              <div className="face">
                <span className="eye leftEye" />
                <span className="eye rightEye" />
                <span className="mouth" />
              </div>
            </div>
            <div className="robotNeck" />
            <div className="robotBody">
              <div className="core"><span /></div>
              <div className="bodyLine" />
            </div>
          </div>
          <div className="hud hudTop"><b>AI CORE</b><span>98.7%</span></div>
          <div className="hud hudBottom"><b>STATUS</b><span>LEARNING</span></div>
          <div className="chipModule" aria-label="实时运算芯片">
            <div className="binaryStream" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    "--binary-left": `${(index % 9) * 11}px`,
                    "--binary-delay": `${(index % 9) * -0.42}s`,
                  } as CSSProperties}
                >
                  {index % 3 === 0 ? "1" : "0"}
                </span>
              ))}
            </div>
            <div className="chipPins topPins" />
            <div className="chipFace">
              <i />
              <b>SUNNY</b>
              <span>NEURAL CORE</span>
            </div>
            <div className="chipPins bottomPins" />
          </div>
          <p className="stageLabel">SUNNYBOX INTELLIGENCE / CORE 01</p>
        </div>
      </section>

      <section className="section productIntro reveal revealThree" id="product">
        <div className="sectionHeader">
          <div>
            <p className="sectionIndex">01 / PRODUCT VISION</p>
            <h2>为行动而生的 AI</h2>
          </div>
          <p>简洁如优秀工具，强大如智能系统。SunnyBox AI 把复杂模型能力封装成清晰、可信的产品体验。</p>
        </div>
        <div className="productStatement">
          <p>
            从一个问题开始，经过理解、推理与组织，最终抵达一个可以执行的结果。
          </p>
          <div className="productMetrics">
            <div><strong>24 / 7</strong><span>持续在线</span></div>
            <div><strong>20</strong><span>轮上下文记忆</span></div>
            <div><strong>∞</strong><span>创意可能</span></div>
          </div>
        </div>
      </section>

      <section className="section assistants reveal revealThree" id="capabilities">
        <div className="sectionHeader">
          <div>
            <p className="sectionIndex">02 / AI CAPABILITIES</p>
            <h2>AI能力展示</h2>
          </div>
          <p>围绕真实任务设计的核心能力，不炫技，只专注于更好的结果。</p>
        </div>
        <div className="assistantGrid">
          {assistantCards.map((assistant) => (
            <article className="assistantCard" key={assistant.code}>
              <div className="cardTop">
                <span>{assistant.code}</span>
                <span className="online"><i />{assistant.status}</span>
              </div>
              <div className="botIcon" aria-hidden="true">
                <i /><i /><span />
              </div>
              <h3>{assistant.title}</h3>
              <p>{assistant.description}</p>
              <span className="cardArrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section workflow reveal revealThree" id="workflow">
        <div className="sectionHeader">
          <div>
            <p className="sectionIndex">03 / HOW IT WORKS</p>
            <h2>使用流程</h2>
          </div>
          <p>无需学习复杂指令，像与专业伙伴交流一样自然。</p>
        </div>
        <div className="flowGrid">
          <article><span>01</span><i>输入</i><h3>说出你的目标</h3><p>描述问题、想法或希望完成的任务。</p></article>
          <article><span>02</span><i>思考</i><h3>晴天盒子理解与推演</h3><p>结合多轮上下文，识别重点并组织方案。</p></article>
          <article><span>03</span><i>行动</i><h3>获得清晰结果</h3><p>继续追问、调整方向，直到真正可执行。</p></article>
        </div>
        <a className="flowCta" href="/chat">现在开始对话 <span>→</span></a>
      </section>

      <section className="section projects reveal revealThree" id="projects">
        <div className="sectionHeader">
          <div>
            <p className="sectionIndex">04 / SELECTED EXPERIMENTS</p>
            <h2>项目展示</h2>
          </div>
          <p>每个项目，都是我们对 AI 产品边界的一次认真探索。</p>
        </div>
        <div className="projectList">
          {projects.map((project) => (
            <article className={`projectRow ${project.accent}`} key={project.number}>
              <span className="projectNumber">{project.number}</span>
              <div className="projectVisual">
                <span /><i /><b />
              </div>
              <div className="projectCopy">
                <p>{project.type}</p>
                <h3>{project.title}</h3>
                <span>{project.description}</span>
              </div>
              <span className="projectArrow">→</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section about reveal revealThree" id="about">
        <div className="aboutPanel">
          <div className="aboutCode">
            <span>ABOUT / 05</span>
            <div className="codeOrb"><i /></div>
          </div>
          <div className="aboutCopy">
            <p className="sectionIndex">THE PEOPLE BEHIND SUNNYBOX</p>
            <h2>关于晴天盒子</h2>
            <p className="aboutLead">
              晴天盒子 SunnyBox AI 相信，真正高级的科技应该像晴天一样清晰、自然而有力量。我们将前沿智能转化为一个能够理解人、启发人并帮助人行动的产品。
            </p>
            <div className="founders">
              <div><strong>张YQ</strong><span>品牌 · 创意 · 体验</span></div>
              <div><strong>徐XH</strong><span>产品 · 技术 · 实现</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact reveal revealThree" id="contact">
        <p className="sectionIndex">06 / OPEN CHANNEL</p>
        <h2>一起创造点<br />面向未来的东西。</h2>
        <p>有想法、合作或只是想聊聊 AI？我们的通信频道已经开启。</p>
        <a href="mailto:hello@mrxu.ai">hello@mrxu.ai <span>↗</span></a>
      </section>

      <footer>
        <a className="brand footerBrand" href="#top">
          <span className="brandSignal"><i /></span>
          <span>晴天盒子 <b>SUNNYBOX AI</b></span>
        </a>
        <p>© 2026 张YQ × 徐XH. DESIGNED FOR INTELLIGENCE.</p>
        <a href="#top">返回顶部 ↑</a>
      </footer>
    </main>
  );
}
