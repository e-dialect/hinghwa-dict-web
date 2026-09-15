# Asset and Data Boundaries / 资产与数据边界

The root AGPL declaration covers authorized software code, not every file or
piece of content presented by the application.

| Path or material | Boundary |
| --- | --- |
| `src/components/Tools/relative.js` | Embedded Puxian kinship vocabulary and relationship data. Its inclusion is not a representation that all underlying language content is AGPL-licensed; provenance and content permission must be retained separately. |
| `public/certificate.png` | Puxian proficiency-certificate background and seal artwork. Treat as project/media artwork with no code-license or trademark grant. |
| `public/favicon.svg`, `src/assets/blue.svg`, `src/assets/white.svg` | Project/product identity artwork. No trademark right or endorsement is granted by the code license. |
| `src/assets/rewards.svg`, `src/assets/timg.gif` | Rewards illustration and microphone image. No auditable standalone license is recorded; do not assume AGPL reuse rights outside this application. |
| Runtime dictionary, article, quiz, music, account, and recording content | Content returned by the backend or supplied by users requires its own provenance, consent, privacy basis, and license/permission. |

Before adding content, recordings, screenshots, fonts, or design assets, record
the source, rightsholder, license/permission, attribution requirements, and any
privacy constraints. A code CLA does not automatically cover these materials.

---

根目录 AGPL 声明仅覆盖项目有权授权的软件代码。内嵌莆仙亲属称谓数据、证书底图、
印章、Logo、商城插画与麦克风图不因位于代码仓库而自动取得 AGPL 授权；部署中加载
的词典、文章、测验、音乐、账户与录音内容也必须分别保留来源、权利、同意和隐私
依据。代码 CLA 不自动覆盖这些材料。
