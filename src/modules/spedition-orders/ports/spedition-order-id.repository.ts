export interface SpeditionOrderIdRepository {
  getNextOrderIdForDate(companyId: string, forDate: Date): Promise<number>;
}
