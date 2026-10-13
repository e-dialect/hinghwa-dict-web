<template>
  <div class="kinship-calculator">
    <div class="kinship-toolbar">
      <span class="sex-label">我的性别</span>
      <a-radio-group
        size="small"
        button-style="solid"
        :value="calculatorView.explicitSex"
        @change="setSex($event.target.value)"
      >
        <a-radio-button v-for="option in sexOptions" :key="option.value" :value="option.value">
          {{ option.value === 'male' ? '男' : option.value === 'female' ? '女' : '未指定' }}
        </a-radio-button>
      </a-radio-group>
      <button
        type="button"
        class="kinship-help"
        aria-label="计算说明"
        :aria-expanded="helpOpen"
        @click="helpOpen = !helpOpen"
      >?</button>
    </div>

    <div v-if="helpOpen" class="kinship-help-panel">
      <p>{{ modelNotice }}</p>
      <p>改变性别会清空路径；分支中的推断不会改变性别设置。灰色按钮表示当前人物或条件暂不支持该操作，最多计算 {{ calculatorView.maxDepth }} 步。</p>
      <p v-if="calculatorView.roleNote">{{ calculatorView.roleNote }}</p>
      <p v-if="words.some(item => item.status === 'rolePending')">待核状态只确认关系角色，不代表已确认的方言词形。</p>
    </div>

    <div class="kinship-path" aria-label="关系路径">
      <div class="kinship-trail">
        <span>我</span>
        <span v-for="step in calculatorView.path" :key="step.index" class="kinship-step">
          <span class="path-arrow">→</span>
          {{ pathLabel(step.field) }}
          <span v-if="step.partial" class="path-partial" title="该步仅列出已知人物">*</span>
        </span>
      </div>
      <span class="path-count">{{ calculatorView.path.length }}/{{ calculatorView.maxDepth }}</span>
    </div>

    <div class="kinship-controls">
      <a-button
        v-for="item in calculatorView.buttons"
        :key="item.field"
        :disabled="!item.enabled"
        :title="item.hint"
        class="kinship-relation"
        @click="advance(item.field)"
      >{{ item.label }}</a-button>
    </div>
    <div class="kinship-actions">
      <a-button type="link" size="small" :disabled="!calculatorView.path.length" @click="goBack">撤销</a-button>
      <a-button type="link" size="small" @click="clearCalculator">清空</a-button>
    </div>

    <p v-if="calculatorView.diagnostic" class="kinship-warning">{{ calculatorView.diagnostic }}</p>
    <p v-else-if="calculatorView.atLimit" class="kinship-note">已到 {{ calculatorView.maxDepth }} 步上限。</p>
    <p v-if="calculatorView.coverageNotice" class="kinship-note">仅列出已知人物，可能还有未收录关系。</p>
    <p v-if="calculatorView.inferenceNotice" class="kinship-note">
      按当前选择，我为{{ calculatorView.inferredSex === 'male' ? '男' : '女' }}。
    </p>

    <section class="kinship-result">
      <div v-if="calculatorView.pendingChoice">
        <div class="result-label">选择具体人物</div>
        <div class="kinship-candidates">
          <button
            v-for="item in calculatorView.candidates"
            :key="item.candidateId"
            type="button"
            class="kinship-candidate"
            @click="chooseCandidate(item.candidateId)"
          >
            <strong>{{ item.label }}</strong>
            <span>{{ candidateHint(item) }}</span>
            <span v-if="item.condition">{{ item.condition.replace('此分支要求己身为', '我为') }}</span>
          </button>
        </div>
      </div>
      <div v-else>
        <div class="result-heading">
          <span class="result-label">{{ calculatorView.roleLabel }}</span>
          <span v-if="identityNote" class="kinship-note" :title="calculatorView.selectedIdentityHint">{{ identityNote }}</span>
        </div>
        <a-spin v-if="wordLoading" size="small"/>
        <div v-for="item in words" :key="item.termId" class="kinship-word">
          <div class="word-heading">
            <router-link
              v-if="item.status === 'bound' && !item.loadError"
              class="word-title"
              :to="{ name: 'WordDetails', params: { id: item.id.toString() } }"
            >{{ item.word }}</router-link>
            <span v-else class="word-title">{{ item.status === 'rolePending' ? '称谓待核' : item.word }}</span>
            <span v-if="item.status === 'missingWord'" class="word-status">词库待补</span>
            <PlaySoundButton
              v-if="item.status === 'bound' && !item.loadError"
              :ipa="item.standard_ipa"
              :pinyin="item.standard_pinyin"
              :url="item.source"
              :word-id="item.id"
            />
          </div>
          <p v-if="item.standard_pinyin || item.standard_ipa" class="word-pronunciation">
            {{ item.standard_pinyin }}<span v-if="item.standard_ipa"> / {{ item.standard_ipa }} /</span>
          </p>
          <p v-if="item.status === 'bound' && !item.loadError && item.definition" class="word-definition">{{ item.definition.slice(0, 120) }}</p>
          <div v-if="item.loadError" class="word-error">
            <span>加载失败</span>
            <a-button type="link" size="small" @click="retryWords">重试</a-button>
          </div>
        </div>
      </div>
    </section>

    <footer class="kinship-contribution">
      <span>有更多说法？</span>
      <router-link :to="{ name: 'WordCreate' }">补充词条</router-link>
      <button
        type="button"
        class="kinship-help"
        aria-label="补充词条说明"
        :aria-expanded="contributionHelpOpen"
        @click="contributionHelpOpen = !contributionHelpOpen"
      >?</button>
    </footer>
    <div v-if="contributionHelpOpen" class="kinship-help-panel">
      <p>欢迎提供有来源的实际说法，或把纸面说法整理成正式词条，请勿把普通话角色占位直接当作方言词形。</p>
      <p>投稿目前仅进入词库，审核后还需维护者手动关联亲戚计算器，不会自动更新计算结果。</p>
    </div>
  </div>
</template>

<script>
import { dataset } from './relative'
import axios from 'axios'
import PlaySoundButton from './PlaySoundButton'
// eslint-disable-next-line import/extensions -- One ES module is shared with uni-app and Node tests.
import { createKinshipMixin } from '../../data/kinship/v1/vue-mixin.mjs'

export default {
  name: 'RelationSelect',
  components: { PlaySoundButton },
  mixins: [createKinshipMixin(dataset, async id => {
    const res = await axios.get(`/words/${id}`)
    return res.data.word
  })],
  data () {
    return { helpOpen: false, contributionHelpOpen: false }
  },
  computed: {
    identityNote () {
      const current = this.calculatorView.current
      if (!current) return ''
      const item = this.calculatorView.candidates.find(candidate => candidate.candidateId === current.candidateId)
      return item && item.firstSeenStep !== null && item.firstSeenStep < this.calculatorView.path.length
        ? this.candidateHint(item) : ''
    }
  },
  methods: {
    pathLabel (field) {
      const button = this.calculatorView.buttons.find(item => item.field === field)
      return button ? button.label : field
    },
    candidateHint (item) {
      if (item.firstSeenStep === 0) return '起点的我'
      if (item.firstSeenStep !== null) return '第 ' + item.firstSeenStep + ' 步出现的人物'
      return item.identityHint && item.identityHint.includes('其他可能') ? '另一位同称人物' : '另一种可能'
    }
  }
}
</script>

<style scoped>
.kinship-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.sex-label { font-size: 14px; color: #53657a; }
.kinship-help { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; border: 1px solid #d7e0e9; border-radius: 50%; background: transparent; color: #8493a3; font-size: 13px; cursor: pointer; }
.kinship-toolbar > .kinship-help { margin-left: auto; }
.kinship-help:hover { color: #3274b7; border-color: #3274b7; }
.kinship-help:focus-visible { outline: 2px solid #87b4df; outline-offset: 2px; }
.kinship-help-panel { margin: 12px 0; padding: 12px 14px; border-radius: 8px; background: #f6f8fb; color: #748294; font-size: 12px; line-height: 1.7; }
.kinship-help-panel p { margin: 0 0 6px; }
.kinship-help-panel p:last-child { margin-bottom: 0; }
.kinship-path { display: flex; align-items: center; gap: 12px; min-height: 46px; padding: 12px 14px; margin-bottom: 18px; border-radius: 8px; background: #f3f6fa; }
.kinship-trail { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; flex: 1; color: #455c76; font-size: 14px; }
.kinship-step { display: inline-flex; gap: 8px; align-items: center; }
.path-arrow { color: #a4b2c2; }
.path-partial { color: #a98950; font-size: 11px; }
.path-count { color: #a4b2c2; font-size: 11px; white-space: nowrap; }
.kinship-controls { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
.kinship-relation { width: 100%; height: 44px; padding: 0; border-radius: 8px; color: #3d5d82; border-color: #dce5ef; font-size: 18px; background: #fbfcfe; }
.kinship-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
.kinship-actions .ant-btn { color: #8090a2; }
.kinship-note { margin: 6px 0; color: #8b97a5; font-size: 12px; line-height: 1.5; }
.kinship-warning { margin: 8px 0; color: #a77a3c; font-size: 12px; }
.kinship-result { min-height: 100px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #edf1f5; }
.result-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 4px; }
.result-label { color: #8392a4; font-size: 13px; }
.kinship-word { padding: 10px 0; }
.kinship-word + .kinship-word { border-top: 1px solid #f2f4f7; }
.word-heading { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.word-title { color: #273e58; font-size: 23px; font-weight: 600; line-height: 1.5; }
a.word-title:hover { color: #3075bb; }
.word-status { color: #9eacba; font-size: 11px; }
.word-pronunciation { margin: 4px 0; color: #8191a4; font-size: 12px; }
.word-definition { margin: 6px 0 0; color: #68798d; font-size: 13px; line-height: 1.7; }
.word-error { color: #8b97a5; font-size: 12px; }
.kinship-candidates { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.kinship-candidate { display: flex; flex-direction: column; gap: 5px; padding: 14px; border: 1px solid #dce5ef; border-radius: 8px; background: #fbfcfe; color: #73849a; text-align: left; font-size: 12px; cursor: pointer; }
.kinship-candidate strong { color: #3a5576; font-size: 16px; font-weight: 600; }
.kinship-candidate:hover { border-color: #8eb4dd; background: #f7faff; }
.kinship-contribution { display: flex; align-items: center; gap: 7px; margin-top: 24px; padding-top: 14px; border-top: 1px solid #edf1f5; color: #94a1af; font-size: 12px; }
.kinship-contribution .kinship-help { width: 18px; height: 18px; font-size: 11px; }
@media (max-width: 480px) {
  .kinship-toolbar { gap: 8px; }
  .kinship-controls { gap: 8px; }
  .kinship-relation { height: 42px; }
}
</style>
