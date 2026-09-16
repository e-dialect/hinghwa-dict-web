# Third-Party Notices / 第三方声明

The root AGPL declaration applies only to code the project is authorized to
license. It does not replace the following file-level terms or resolve an
unrecorded upstream grant. Packages installed through `package.json` and
`yarn.lock` retain their own published licenses.

## Incremental deployment helper

- Local path: `scripts/incremental-diff.sh`.
- Copyright: 2022 Charlie Chiang.
- License: Apache License 2.0, as declared in the file header. The standard
  license text is preserved in [`LICENSES/Apache-2.0.txt`](LICENSES/Apache-2.0.txt).

## Historical speech-recognition WebAPI demo-derived files (removed)

- Historical paths: `src/assets/IatRecorder.js` and
  `src/assets/transcode.worker.js`.
- Provenance: the structure, comments, endpoint, and helper names identify the
  files as copied or adapted from the iFLYTEK streaming voice-dictation WebAPI
  browser demo. The official API documentation links a JavaScript demo:
  <https://www.xfyun.cn/doc/asr/voicedictation/API.html>.
- No auditable open-source grant was established for the historical files.
  Public availability or a vendor documentation download is not itself
  permission to redistribute or relicense code.
- Current status: both files and their browser-side signing dependencies were
  removed from the current tree on 2026-09-16. The remaining translation route
  accepts text input and no longer connects directly to the external WebAPI.
- Security: the historical client contained a provider credential. Its value
  is intentionally omitted from this record and must be revoked at the
  provider. Deleting it from the current tree does not make the historical
  credential safe.
- Earlier Git revisions retain their original rights status; this removal is
  not a retroactive license grant.

## Purchased illustration assets

- The maintainer confirmed during the 2026-09-16 governance review that the
  repository's illustration assets were purchased for project use.
- `src/assets/rewards.svg`, first added in `d4ac139`, remains in use under that
  purchased authorization. It is a media asset, not AGPL-covered software; its
  presence grants no standalone redistribution or alternative-commercial-
  relicensing right beyond the applicable purchase terms.
- `src/assets/timg.gif`, first added in `628a493`, had no current code reference
  and was removed on 2026-09-16 as unused media, not because its purchase was
  disputed.
- The private purchase record and applicable license terms should be retained
  for audit; this notice does not publish confidential transaction details.

**Current-tree unresolved redistributed files: 0.**

The WebAPI service itself is external and remains governed by the provider's
service terms. API credentials and user recordings are not licensed by this
repository.

---

根目录 AGPL 声明仅覆盖项目有权授权的代码。`scripts/incremental-diff.sh` 继续适用
其文件头声明的 Apache-2.0。历史语音识别 WebAPI 示例派生文件没有可核验的开源授权，
已连同浏览器端签名依赖从当前代码树删除；旧版本中曾公开的服务商凭据仍须在服务商
侧撤销。维护者确认仓库插画系为项目使用而购买；仍在使用的积分插画继续适用购买
条款且不纳入代码许可证，未使用的麦克风 GIF 已作为无用媒体删除。当前代码树中继续
分发的未解决路径为 0；删除不构成对历史文件的追溯授权。讯飞 WebAPI 服务、API
凭据与用户录音也不由本仓库授权。
