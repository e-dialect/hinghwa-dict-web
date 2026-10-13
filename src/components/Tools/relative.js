import kinshipData from '../../data/kinship/v1/kinship.json'
import roleIds from '../../data/kinship/v1/role-ids.json'
// eslint-disable-next-line import/extensions -- The shared ES module also runs directly in Node.
import { createLegacyApi, toEngineDataset } from '../../data/kinship/v1/adapter.mjs'

const api = createLegacyApi(kinshipData)

// Preserve the Phase 1 API while the data layer uses frozen semantic IDs.
export const { buttons, fieldName, relative, find } = api
export const dataset = kinshipData
export const engineDataset = toEngineDataset(kinshipData)
export const roleIdByName = roleIds.idByLegacyName
