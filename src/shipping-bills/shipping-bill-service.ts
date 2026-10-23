import { emptyBill, SavedBill, ShippingBillFormValues } from './model'
import { toHttpPayload } from './api/payload'
import { normalizeApiBill, normalizeApiBills } from './api/normalizers'
import { generateFlatFileContent } from './api/flat-file'

export { normalizeApiBill, normalizeApiBills } from './api/normalizers'

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  import.meta.env.PUBLIC_API_URL ||
  'http://192.168.1.123:3408'

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: 'tenantId=1000&user=1000&role=1'
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

export const API_SEED_SHIPPING_BILLS = [
  { id: 1000, jobNumber: 150011, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1790967817 },
  { id: 1001, jobNumber: 150012, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1790968385 },
  { id: 1002, jobNumber: 150013, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1790969061 },
  { id: 1003, jobNumber: 150014, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1790969592 },
  { id: 1004, jobNumber: 150015, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791003787 },
  { id: 1005, jobNumber: 150016, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791010527 },
  { id: 1006, jobNumber: 150017, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791138507 },
  { id: 1007, jobNumber: 150018, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791139137 },
  { id: 1008, jobNumber: 150019, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791139150 },
  { id: 1009, jobNumber: 150020, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791139885 },
  { id: 1010, jobNumber: 150021, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791140799 },
  { id: 1011, jobNumber: 150022, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791140811 },
  { id: 1012, jobNumber: 150023, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791141353 },
  { id: 1013, jobNumber: 150024, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791141776 },
  { id: 1014, jobNumber: 150025, jobDate: 20728, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "KRBUS", destinationPort: "KRBUS", updated: 1791143087 },
  { id: 1021, jobNumber: 150026, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791183194 },
  { id: 1023, jobNumber: 150028, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791449123 },
  { id: 1024, jobNumber: 150029, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791449142 },
  { id: 1025, jobNumber: 150030, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791449171 },
  { id: 1026, jobNumber: 150031, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791449252 },
  { id: 1027, jobNumber: 150032, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791449308 },
  { id: 1028, jobNumber: 150033, jobDate: 20714, exporterName: "Amit Exports", consigneeName: "H&M HENNES & MAURITZ LTD", loadingPort: "INMUN1", dischargePort: "INMUN1", destinationPort: "USMSY", updated: 1791452556 }
]

let internalBills: SavedBill[] = normalizeApiBills(API_SEED_SHIPPING_BILLS)

export const shippingBillService = {
  getInitialBills(): SavedBill[] {
    return internalBills
  },

  getById(id: string | number): SavedBill | undefined {
    return internalBills.find((b) => String(b.id) === String(id))
  },

  /** GET /api/shipping-bills */
  async list(): Promise<SavedBill[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/shipping-bills`, { method: 'GET', headers: DEFAULT_HEADERS })
      if (response.ok) {
        const data = await response.json()
        const normalized = normalizeApiBills(data)
        if (normalized && normalized.length > 0) {
          internalBills = normalized
          return normalized
        }
      }
    } catch {
      // Fallback to internal seed records
    }
    return internalBills
  },

  /** GET /api/shipping-bills/:id/flat-file */
  async getFlatFile(id: string | number) {
    const response = await fetch(`${BASE_URL}/api/shipping-bills/${id}/flat-file`, { method: 'GET', headers: DEFAULT_HEADERS })
    if (!response.ok) throw new Error(`Failed to get flat file: ${response.status} ${response.statusText}`)
    const contentType = response.headers.get('content-type') || ''
    return contentType.includes('application/json') ? response.json() : response.text()
  },

  /** Download .sb flat file — API first, local generation fallback. */
  async downloadFlatFile(id: string | number, billData?: SavedBill, fallbackFilename?: string): Promise<{ source: 'api' | 'local' }> {
    let filename = fallbackFilename || `shipping_bill_${id}.sb`
    try {
      const response = await fetch(`${BASE_URL}/api/shipping-bills/${id}/flat-file`, {
        method: 'GET',
        headers: { Accept: '*/*', Authorization: DEFAULT_HEADERS.Authorization }
      })
      if (response.ok) {
        const contentType = response.headers.get('content-type') || ''
        const disposition = response.headers.get('content-disposition')
        if (disposition?.includes('filename=')) {
          const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (match?.[1]) filename = match[1].replace(/['"]/g, '')
        }
        let blob: Blob
        if (contentType.includes('application/json')) {
          const json = await response.json()
          const content = typeof json === 'string' ? json : json.file || json.content || json.data || JSON.stringify(json, null, 2)
          blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        } else {
          blob = await response.blob()
        }
        triggerBlobDownload(blob, filename)
        return { source: 'api' }
      }
    } catch {
      // Backend offline — fall back to local generation
    }
    if (billData) {
      const flatFileContent = generateFlatFileContent(billData)
      triggerBlobDownload(new Blob([flatFileContent], { type: 'text/plain;charset=utf-8' }), `shipping_bill_${billData.values.jobNumber || billData.id}.sb`)
      return { source: 'local' }
    }
    throw new Error(`Backend server (${BASE_URL}) is offline and no local bill data was found.`)
  },

  /** POST /api/shipping-bills */
  async upsert(values: ShippingBillFormValues) {
    const payload = toHttpPayload(values)
    const response = await fetch(`${BASE_URL}/api/shipping-bills`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error(`Failed to save shipping bill: ${response.status} ${response.statusText}`)
    return response.json()
  }
}

// Re-export for backwards compatibility
export { emptyBill }
