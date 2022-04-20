export interface FinishItem {
  userId: string
  finishId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
