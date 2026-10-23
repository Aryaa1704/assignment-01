/**
 * payload.ts — canonical API payload transform
 *
 * Single source of truth for converting ShippingBillFormValues into the
 * structure expected by POST /api/shipping-bills.
 *
 * Previously this logic was duplicated:
 *   - toShippingBillPayload() in model.ts  (snake_case, internal format)
 *   - toHttpShippingBillPayload() in shipping-bill-service.ts  (camelCase, HTTP format)
 *
 * This file keeps the HTTP-ready version with numeric ISO 4217 currency codes.
 */

import { ShippingBillFormValues } from '../model'

const CURRENCY_MAP: Record<string, number> = {
  USD: 840,
  INR: 356,
  EUR: 978,
  AED: 784,
  GBP: 826,
  SGD: 702
}

const parseNum = (val: unknown) => (val != null && val !== '' ? Number(val) : undefined)

const parseDate = (dateStr?: string) => {
  if (!dateStr) return undefined
  return Math.floor(new Date(dateStr).getTime() / 86400000)
}

const parseCurrency = (c?: string) => (c ? CURRENCY_MAP[c] || parseNum(c) || 840 : 840)

export function toHttpPayload(values: ShippingBillFormValues) {
  return {
    chaId: 1000,
    jobDate: parseDate(values.jobDate),
    exporterId: parseNum(values.exporterId),
    exporterBranchId: parseNum(values.exporterBranchId),
    consigneeId: parseNum(values.consigneeId),
    consigneeAddressId: parseNum(values.consigneeBranchId),
    originStateCode: parseNum(values.originStateCode),
    loadingPort: values.loadingPort,
    finalDestinationPort: values.finalDestinationPort,
    dischargePort: values.dischargePort || values.finalDestinationPort,
    sealType: parseNum(values.sealType),
    natureOfCargo: parseNum(values.natureOfCargo),
    grossWeight: parseNum(values.grossWeight),
    netWeight: parseNum(values.netWeight),
    measurementUnit: values.measurementUnit === 'KG' ? 'KGS' : values.measurementUnit,
    totalPackages: parseNum(values.totalPackages),
    marksAndNumbers: values.marksAndNumbers,
    loosePackets: parseNum(values.loosePackets),
    numberOfContainers: values.containers.length || parseNum(values.numberOfContainers) || 0,
    invoices: (values.invoices ?? []).map((inv, index) => ({
      serialNumber: index + 1,
      invoiceNumber: inv.invoiceNumber,
      date: parseDate(inv.invoiceDate),
      currency: parseCurrency(inv.currency),
      contractType: parseNum(inv.contractType),
      buyerId: parseNum(inv.buyerSameAsConsignee ? values.consigneeId : inv.buyerId),
      buyerAddressId: parseNum(inv.buyerSameAsConsignee ? values.consigneeBranchId : inv.buyerBranchId),
      freightCurrency: parseCurrency(inv.freightCurrency || inv.currency),
      freightAmount: parseNum(inv.freightAmount) ?? 0,
      insuranceCurrency: parseCurrency(inv.insuranceCurrency || inv.currency),
      insuranceAmount: parseNum(inv.insuranceAmount) ?? 0,
      commissionCurrency: parseCurrency(inv.commissionCurrency || inv.currency),
      commissionAmount: parseNum(inv.commissionAmount) ?? 0,
      discountCurrency: parseCurrency(inv.discountCurrency || inv.currency),
      discountAmount: parseNum(inv.discountAmount) ?? 0,
      otherDeductionsCurrency: parseCurrency(inv.otherDeductionsCurrency || inv.currency),
      otherDeductionsAmount: parseNum(inv.otherDeductionsAmount) ?? 0,
      freightInsauranceIncluded: parseNum(inv.freightInsuranceIncluded),
      packingCharges: parseNum(inv.packingCharges) ?? 0,
      natureOfPayment: parseNum(inv.natureOfPayment),
      periodOfPayment: parseNum(inv.periodOfPayment),
      items: (inv.items ?? []).map((item, itemIdx) => ({
        itemSerialNumber: itemIdx + 1,
        schemeCode: item.schemeCode,
        ritcCode: item.ritcCode,
        goodsDescription: item.goodsDescription1,
        unitOfMeasurement: item.unitOfMeasurement,
        quantity: parseNum(item.quantity),
        unitPrice: parseNum(item.unitPrice),
        unitOfRate: item.unitOfRate || item.unitOfMeasurement,
        noOfUnits: parseNum(item.numberOfUnits) ?? 1,
        presentMarketValue: parseNum(item.presentMarketValue),
        thirdParty: Boolean(item.thirdPartyItem),
        rewardItem: Boolean(item.rewardItem),
        totalPackage: parseNum(item.totalPackage),
        endUseOfItem: item.endUseOfItem,
        igstPaymentStatus: parseNum(item.igstPaymentStatus),
        originDistrictCode: parseNum(item.originDistrictCode),
        tradeAgreementsCode: item.tradeAgreementsCode,
        drawbackSerialNumber: item.drawbackSerialNumber,
        drawbackQuantity: parseNum(item.drawbackQuantity)
      }))
    })),
    packgingList: (values.packingRanges ?? []).map((range) => ({
      packingNumberFrom: parseNum(range.packingNumberFrom),
      packingNumberTo: parseNum(range.packingNumberTo),
      packingCode: range.packingCode
    })),
    documents: (values.documents ?? []).map((doc, docIdx) => ({
      invoiceSerialNumber: parseNum(doc.invoiceSerialNumber) ?? 1,
      itemSerialNumber: parseNum(doc.itemSerialNumber) ?? 1,
      serialNumber: docIdx + 1,
      imageReferenceNumber: doc.imageReferenceNumber,
      documentTypeCode: doc.documentTypeCode,
      documentIssueDate: parseDate(doc.documentIssueDate),
      useDefault: true,
      fileType: parseNum(doc.fileType) ?? 1
    }))
  }
                                          }
