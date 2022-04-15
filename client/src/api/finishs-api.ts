import { apiEndpoint } from '../config'
import { Finish } from '../types/Finish';
import { CreateFinishRequest } from '../types/CreateFinishRequest';
import Axios from 'axios'
import { UpdateFinishRequest } from '../types/UpdateFinishRequest';

export async function getFinishs(idToken: string): Promise<Finish[]> {
  console.log('Fetching finishs')

  const response = await Axios.get(`${apiEndpoint}/finishs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Finishs:', response.data)
  return response.data.items
}

export async function getFinishById(idToken: string, finishId: string): Promise<Finish> {
  console.log('Fetching finishs by id')

  const response = await Axios.get(`${apiEndpoint}/finishs/${finishId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Finishs:', response.data)
  return response.data.items
}

export async function createFinish(
  idToken: string,
  newFinish: CreateFinishRequest
): Promise<Finish> {
  const response = await Axios.post(`${apiEndpoint}/finishs`,  JSON.stringify(newFinish), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchFinish(
  idToken: string,
  finishId: string,
  updatedFinish: UpdateFinishRequest
): Promise<void> {
  console.log('Finishs idToken:', idToken)
  await Axios.patch(`${apiEndpoint}/finishs/${finishId}`, JSON.stringify(updatedFinish), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFinish(
  idToken: string,
  finishId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/finishs/${finishId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  finishId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/finishs/${finishId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
