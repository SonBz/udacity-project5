/**
 * Fields in a request to update a single FINISH item.
 */
export interface UpdateFinishRequest {
  name: string
  dueDate: string
  done: boolean
}