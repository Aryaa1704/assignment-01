/**
 * normalizers.ts
 *
 * Transforms raw API response shapes into the SavedBill / ShippingBillFormValues
 * structures used by the UI.  Extracted from shipping-bill-service.ts so that
 * file stays focused on HTTP / fetch concerns.
 */

import { emptyBill, emptyInvoice, SavedBill, ShippingBillFormValues } from '../model'

function formatIsoString(val: unknown): string {
  if (!val) return new Date().toISOString()
  if (typeof val === 'number') {
    const ms = val < 10_000_000_000 ? val * 1000 : val
    const d = new Date(ms)
    return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
  }
  const d = new Date(val as string)
  return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString()
}

function formatEpochDays(days?: unknown): string {
  if (typeof days === 'number') {
    const d = new Date(days * 86_400_000)
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  }
  return String(days ?? '')
}

export function normalizeApiBill(raw: Record<string, unknown> | null | undefined): SavedBill {
  if (!raw) return { id: 0, created: '', updated: '', values: emptyBill() }

  // Already-normalised SavedBill (e.g. from demo-store)
  if (raw['values'] && raw['id']) {
    return {
      ...raw,
      updated: formatIsoString(raw['updated']),
      created: formatIsoString(raw['created'])
    } as SavedBill
  }

  const id = Number(raw['id'] ?? raw['shippingBillId'] ?? raw['chaId'] ?? Math.floor(Math.random() * 100_000))
  const jobDateStr = formatEpochDays(raw['jobDate'])
  const updated = formatIsoString(raw['updatedAt'] || raw['updated'] || raw['createdAt'])
  const created = formatIsoString(raw['createdAt'] || raw['created'] || updated)

  const values: ShippingBillFormValues = {
    ...emptyBill(),
    jobNumber: raw['jobNumber'] ? String(raw['jobNumber']) : `JOB-${id}`,
    jobDate: jobDateStr || new Date().toISOString().split('T')[0],
    exporterId: String(raw['exporterId'] ?? ''),
    exporterBranchId: String(raw['exporterBranchId'] ?? ''),
    exporterName: String(raw['exporterName'] ?? ''),
    consigneeId: String(raw['consigneeId'] ?? ''),
    consigneeBranchId: String(raw['consigneeAddressId'] ?? raw['consigneeBranchId'] ?? ''),
    consigneeName: String(raw['consigneeName'] ?? ''),
    originStateCode: raw['originStateCode'] ? String(raw['originStateCode']) : '',
    loadingPort: String(raw['loadingPort'] ?? ''),
    finalDestinationPort: String(raw['destinationPort'] ?? raw['finalDestinationPort'] ?? ''),
    dischargePort: String(raw['dischargePort'] ?? raw['destinationPort'] ?? raw['finalDestinationPort'] ?? ''),
    sealType: raw['sealType'] ? String(raw['sealType']) : '3',
    natureOfCargo: raw['natureOfCargo'] ? String(raw['natureOfCargo']) : '1',
    grossWeight: raw['grossWeight'] ? String(raw['grossWeight']) : '',
    netWeight: raw['netWeight'] ? String(raw['netWeight']) : '',
    measurementUnit: String(raw['measurementUnit'] ?? 'KGS'),
    totalPackages: raw['totalPackages'] ? String(raw['totalPackages']) : '',
    marksAndNumbers: String(raw['marksAndNumbers'] ?? ''),
    loosePackets: raw['loosePackets'] ? String(raw['loosePackets']) : '0',
    numberOfContainers: raw['numberOfContainers'] ? String(raw['numberOfContainers']) : '0',
    containers: (raw['containers'] as ShippingBillFormValues['containers']) ?? [],
    invoices:
      Array.isArray(raw['invoices']) && (raw['invoices'] as unknown[]).length > 0
        ? (raw['invoices'] as Record<string, unknown>[]).map((inv, idx) => ({
            invoiceNumber: String(inv['invoiceNumber'] ?? `INV-${idx + 1}`),
            invoiceDate:
              formatEpochDays(inv['date'] ?? inv['invoiceDate']) || new Date().toISOString().split('T')[0],
            currency:
              typeof inv['currency'] === 'number'
                ? inv['currency'] === 840
                  ? 'USD'
                  : inv['currency'] === 356
                  ? 'INR'
                  : String(inv['currency'])
                : String(inv['currency'] ?? 'USD'),
            contractType: String(inv['contractType'] ?? '1'),
            buyerId: String(inv['buyerId'] ?? ''),
            buyerBranchId: String(inv['buyerAddressId'] ?? inv['buyerBranchId'] ?? ''),
            buyerSameAsConsignee:
              inv['buyerId'] == null || String(inv['buyerId']) === String(raw['consigneeId']),
            freightAmount: inv['freightAmount'] ? String(inv['freightAmount']) : '',
            insuranceAmount: inv['insuranceAmount'] ? String(inv['insuranceAmount']) : '',
            items:
              Array.isArray(inv['items']) && (inv['items'] as unknown[]).length > 0
                ? (inv['items'] as Record<string, unknown>[]).map((item) => ({
                    schemeCode: String(item['schemeCode'] ?? ''),
                    ritcCode: String(item['ritcCode'] ?? ''),
                    goodsDescription1: String(item['goodsDescription'] ?? item['goodsDescription1'] ?? ''),
                    quantity: item['quantity'] ? String(item['quantity']) : '',
                    unitOfMeasurement: String(item['unitOfMeasurement'] ?? 'PCS'),
                    unitPrice: item['unitPrice'] ? String(item['unitPrice']) : '',
                    unitOfRate: String(item['unitOfRate'] ?? item['unitOfMeasurement'] ?? 'PCS'),
                    numberOfUnits: item['noOfUnits'] ? String(item['noOfUnits']) : '1',
                    presentMarketValue: item['presentMarketValue'] ? String(item['presentMarketValue']) : '',
                    thirdPartyItem: Boolean(item['thirdParty']),
                    rewardItem: Boolean(item['rewardItem']),
                    totalPackage: item['totalPackage'] ? String(item['totalPackage']) : '',
                    endUseOfItem: String(item['endUseOfItem'] ?? ''),
                    igstPaymentStatus: item['igstPaymentStatus'] ? String(item['igstPaymentStatus']) : '2',
                    originDistrictCode: item['originDistrictCode'] ? String(item['originDistrictCode']) : '',
                    tradeAgreementsCode: String(item['tradeAgreementsCode'] ?? ''),
                    drawbackSerialNumber: String(item['drawbackSerialNumber'] ?? ''),
                    drawbackQuantity: item['drawbackQuantity'] ? String(item['drawbackQuantity']) : ''
                  }))
                : []
          }))
        : [emptyInvoice()],
    packingRanges: Array.isArray(raw['packgingList'] ?? raw['packingRanges'])
      ? ((raw['packgingList'] ?? raw['packingRanges']) as Record<string, unknown>[]).map((p) => ({
          packingNumberFrom: String(p['packingNumberFrom'] ?? ''),
          packingNumberTo: String(p['packingNumberTo'] ?? ''),
          packingCode: String(p['packingCode'] ?? 'CTN')
        }))
      : [],
    documents: Array.isArray(raw['documents'])
      ? (raw['documents'] as Record<string, unknown>[]).map((doc) => ({
          invoiceSerialNumber: String(doc['invoiceSerialNumber'] ?? '1'),
          itemSerialNumber: String(doc['itemSerialNumber'] ?? '1'),
          imageReferenceNumber: String(doc['imageReferenceNumber'] ?? ''),
          documentTypeCode: String(doc['documentTypeCode'] ?? ''),
          documentIssueDate:
            formatEpochDays(doc['documentIssueDate']) || new Date().toISOString().split('T')[0],
          fileType: String(doc['fileType'] ?? '1')
        }))
      : []
  }

  return { id, created, updated, values, payload: raw }
}

export function normalizeApiBills(raw: unknown): SavedBill[] {
  if (!raw) return []
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)['data'])
    ? ((raw as Record<string, unknown>)['data'] as unknown[])
    : Array.isArray((raw as Record<string, unknown>)['bills'])
    ? ((raw as Record<string, unknown>)['bills'] as unknown[])
    : Array.isArray((raw as Record<string, unknown>)['shippingBills'])
    ? ((raw as Record<string, unknown>)['shippingBills'] as unknown[])
    : Array.isArray((raw as Record<string, unknown>)['items'])
    ? ((raw as Record<string, unknown>)['items'] as unknown[])
    : []
  return (list as Record<string, unknown>[]).map(normalizeApiBill)
}
