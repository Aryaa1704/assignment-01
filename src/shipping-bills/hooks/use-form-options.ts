/**
 * use-form-options.ts
 *
 * Single hook that fetches all static reference data consumed by the
 * Shipping Bill form via React Query (staleTime: Infinity = fetch once,
 * cache forever).  Returns typed option arrays — empty while loading —
 * so every consumer can spread them into `options={...}` without guards.
 */

import { useQuery } from '@tanstack/react-query'
import { referenceService } from '../services/reference.service'

const QUERY_CONFIG = { staleTime: Infinity } as const

export function useFormOptions() {
  const cargoOptions = useQuery({ queryKey: ['ref', 'cargoOptions'], queryFn: () => referenceService.fetchCargoOptions(), ...QUERY_CONFIG })
  const sealTypes = useQuery({ queryKey: ['ref', 'sealTypes'], queryFn: () => referenceService.fetchSealTypes(), ...QUERY_CONFIG })
  const weightUnits = useQuery({ queryKey: ['ref', 'weightUnits'], queryFn: () => referenceService.fetchWeightUnits(), ...QUERY_CONFIG })
  const contractTypes = useQuery({ queryKey: ['ref', 'contractTypes'], queryFn: () => referenceService.fetchContractTypes(), ...QUERY_CONFIG })
  const paymentTypes = useQuery({ queryKey: ['ref', 'paymentTypes'], queryFn: () => referenceService.fetchPaymentTypes(), ...QUERY_CONFIG })
  const priceInclusionTypes = useQuery({ queryKey: ['ref', 'priceInclusionTypes'], queryFn: () => referenceService.fetchPriceInclusionTypes(), ...QUERY_CONFIG })
  const stateOptions = useQuery({ queryKey: ['ref', 'stateOptions'], queryFn: () => referenceService.fetchStateOptions(), ...QUERY_CONFIG })
  const schemeCodes = useQuery({ queryKey: ['ref', 'schemeCodes'], queryFn: () => referenceService.fetchSchemeCodes(), ...QUERY_CONFIG })
  const quantityCodes = useQuery({ queryKey: ['ref', 'quantityCodes'], queryFn: () => referenceService.fetchQuantityCodes(), ...QUERY_CONFIG })
  const trades = useQuery({ queryKey: ['ref', 'trades'], queryFn: () => referenceService.fetchTrades(), ...QUERY_CONFIG })
  const dischargePorts = useQuery({ queryKey: ['ref', 'dischargePorts'], queryFn: () => referenceService.fetchDischargePorts(), ...QUERY_CONFIG })
  const currencyOptions = useQuery({ queryKey: ['ref', 'currencyOptions'], queryFn: () => referenceService.fetchCurrencies(), ...QUERY_CONFIG })

  return {
    cargoOptions: cargoOptions.data ?? [],
    sealTypes: sealTypes.data ?? [],
    weightUnits: weightUnits.data ?? [],
    contractTypes: contractTypes.data ?? [],
    paymentTypes: paymentTypes.data ?? [],
    priceInclusionTypes: priceInclusionTypes.data ?? [],
    stateOptions: stateOptions.data ?? [],
    schemeCodes: schemeCodes.data ?? [],
    quantityCodes: quantityCodes.data ?? [],
    trades: trades.data ?? [],
    dischargePorts: dischargePorts.data ?? [],
    currencyOptions: currencyOptions.data ?? [],
    isLoading: cargoOptions.isLoading || sealTypes.isLoading || weightUnits.isLoading || contractTypes.isLoading,
  }
}
