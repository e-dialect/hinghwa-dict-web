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

## Speech-recognition WebAPI demo-derived files

- Local paths: `src/assets/IatRecorder.js` and
  `src/assets/transcode.worker.js`.
- Provenance: the structure, comments, endpoint, and helper names identify the
  files as copied or adapted from the iFLYTEK streaming voice-dictation WebAPI
  browser demo. The official API documentation links a JavaScript demo:
  <https://www.xfyun.cn/doc/asr/voicedictation/API.html>.
- License status: **`UNRESOLVED`**. Neither local file contains a copyright or
  license notice, and this audit did not locate an auditable open-source grant
  for the demo source. Public availability or a vendor documentation download
  is not itself permission to redistribute or relicense the code.
- Required follow-up: replace the files with independently implemented code or
  retain a written/vendor license record that permits the intended
  distribution. Until then, do not treat these paths as AGPL-licensed or as
  eligible for an alternative commercial license.

The WebAPI service itself is external and remains governed by the provider's
service terms. API credentials and user recordings are not licensed by this
repository.

---

根目录 AGPL 声明仅覆盖项目有权授权的代码。`scripts/incremental-diff.sh` 继续适用
其文件头声明的 Apache-2.0；两份语音识别 WebAPI 示例派生文件没有随附许可证，且
本次审计未找到可核验的开源授权，故状态为 **`UNRESOLVED`**。在取得可审计授权或以
独立实现替换前，不得把这两条路径视为 AGPL 代码或替代商业许可的授权内容。讯飞
WebAPI 服务、API 凭据与用户录音也不由本仓库授权。
