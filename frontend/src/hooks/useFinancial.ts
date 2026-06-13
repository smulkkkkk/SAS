import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financialService } from '@/services'
import type { Payable, Category } from '@/types'

export function useFinancialSummary() {
  return useQuery({ queryKey: ['financial', 'summary'], queryFn: financialService.getSummary, staleTime: 60_000 })
}

export function useTransactions() {
  return useQuery({ queryKey: ['financial', 'transactions'], queryFn: financialService.getTransactions, staleTime: 30_000 })
}

export function usePayables() {
  return useQuery({ queryKey: ['financial', 'payables'], queryFn: financialService.getPayables, staleTime: 30_000 })
}

export function useCreatePayable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Omit<Payable, 'id'>) => financialService.createPayable(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['financial', 'payables'] }),
  })
}

export function useUpdatePayableStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Payable['status'] }) =>
      financialService.updatePayableStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['financial', 'payables'] }),
  })
}

export function useDeletePayable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financialService.deletePayable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['financial', 'payables'] }),
  })
}

export function useCategories() {
  return useQuery({ queryKey: ['financial', 'categories'], queryFn: financialService.getCategories, staleTime: 60_000 })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Omit<Category, 'id' | 'gasto'>) => financialService.createCategory(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['financial', 'categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => financialService.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['financial', 'categories'] }),
  })
}

export function useMonthlyData() {
  return useQuery({ queryKey: ['financial', 'monthly'], queryFn: financialService.getMonthlyData, staleTime: 5 * 60_000 })
}

export function useFinancialHealth() {
  return useQuery({ queryKey: ['financial', 'health'], queryFn: financialService.getHealth, staleTime: 5 * 60_000 })
}
