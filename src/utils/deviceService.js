import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const devicesRef = collection(db, 'devices')

export function isBroken(device) {
  // Conforme pedido: "funcionando" é uma string. Se tiver qualquer valor
  // (não vazio), o aparelho conta como estragado/com defeito.
  return Boolean(device.funcionando && device.funcionando.trim().length > 0)
}

export async function createDevice({ tipo, modelo, numeracao, funcionando }) {
  return addDoc(devicesRef, {
    tipo,
    modelo: modelo.trim(),
    numeracao: numeracao.trim(),
    funcionando: (funcionando || '').trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateDevice(id, { tipo, modelo, numeracao, funcionando }) {
  return updateDoc(doc(db, 'devices', id), {
    tipo,
    modelo: modelo.trim(),
    numeracao: numeracao.trim(),
    funcionando: (funcionando || '').trim(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDevice(id) {
  return deleteDoc(doc(db, 'devices', id))
}
