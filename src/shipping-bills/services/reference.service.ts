/**
 * reference.service.ts
 *
 * Async mock service for all static reference / lookup data used in the
 * Shipping Bill form.  Every method returns a Promise so the calling layer
 * (useFormOptions hook) can treat it exactly like a real REST endpoint —
 * with loading, success, empty and error states — without any real network
 * dependency.
 *
 * Pattern mirrors party-mock-service.ts: fixed 150 ms delay, optional
 * query-string filter where it makes sense for UX.
 */

import { documentCodes } from '@/data/e-sanchit-codes'
import { quantityCodes } from '@/data/quantity-code'
import schemeCodes from '@/data/scheme-codes'
import { stateOptions } from '@/data/states'
import { Trades } from '@/data/trade-agrements'
import { cargoOptions, contractTypes, paymentTypes, priceInclusionTypes, sealTypes, weightUnits } from '@/data/types'
import { ports } from '../model'

const MOCK_DELAY_MS = 150

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS))
}

function filterByQuery<T extends { label: string; value: unknown }>(items: T[], query?: string): T[] {
  if (!query || !query.trim()) return items
  const q = query.toLowerCase().trim()
  return items.filter((item) => String(item.value).toLowerCase().includes(q) || item.label.toLowerCase().includes(q))
}

export const referenceService = {
  fetchCargoOptions() {
    return delay(cargoOptions)
  },

  fetchSealTypes() {
    return delay(sealTypes)
  },

  fetchWeightUnits() {
    return delay(weightUnits)
  },

  fetchContractTypes() {
    return delay(contractTypes)
  },

  fetchPaymentTypes() {
    return delay(paymentTypes)
  },

  fetchPriceInclusionTypes() {
    return delay(priceInclusionTypes)
  },

  fetchStateOptions() {
    return delay(stateOptions)
  },

  fetchSchemeCodes() {
    return delay(schemeCodes)
  },

  fetchQuantityCodes(query?: string) {
    return delay(filterByQuery(quantityCodes, query))
  },

  fetchDocumentCodes(query?: string) {
    return delay(filterByQuery(documentCodes, query))
  },

  fetchTrades() {
    return delay(Trades)
  },

  fetchDischargePorts(query?: string) {
    const options = ports.map((p) => ({ value: p.code, label: `${p.name} · ${p.code}` }))
    return delay(filterByQuery(options, query))
  },

  fetchCurrencies() {
    const currencies = ['USD', 'EUR', 'INR', 'AED', 'GBP', 'SGD'].map((c) => ({ value: c, label: c }))
    return delay(currencies)
  }
}
