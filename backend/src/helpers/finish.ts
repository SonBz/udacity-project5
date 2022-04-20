import { FinishItem } from './../models/FinishItem';
import { FinishsAccess } from './finishAcess'
import { AttachmentUtils } from './attachmentUtils';
import { CreateFinishRequest } from '../requests/CreateFinishRequest'
import { UpdateFinishRequest } from '../requests/UpdateFinishRequest'

// FINISH: Implement businessLogic
const finishAccess = new FinishsAccess();
const attachmentUtils = new AttachmentUtils();

export async function getFinishsForUser(userId:string): Promise<FinishItem[]>{
    return await finishAccess.getFinishsForUser(userId);
}

export async function getFinishById(userId:string, finishId:string): Promise<FinishItem>{
    return await finishAccess.getFinishById(userId, finishId);
}

export async function createFinishForUser(userId: string, newFinish: CreateFinishRequest): Promise<string>{
    return await finishAccess.createFinishForUser(userId, newFinish);
}

export async function deleteFinish(finishId: string, userId: string){
    return await finishAccess.deleteFinish(finishId, userId);
}

export async function updateFinish(userId: String, finishId: string, updatedFinish: UpdateFinishRequest){
    return await finishAccess.updateFinish(userId, finishId, updatedFinish);
}

export async function createAttachmentPresignedUrl (finishId: string): Promise<string> {
    return await attachmentUtils.createAttachmentPresignedUrl(finishId);
}

export async function updateFinishAttachmentUrl(finishId: string, attachmentUrl: string, userId: string){
    return await attachmentUtils.updateFinishAttachmentUrl(finishId, attachmentUrl, userId);
}