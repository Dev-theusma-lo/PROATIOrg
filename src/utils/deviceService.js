import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const devicesRef = collection(db, 'devices')

export function isBroken(device) {
  // Conforme pedido: "funcionando" é uma string. Se tiver qualquer valor
  // (não vazio), o aparelho conta como estragado/com defeito.
  return Boolean(device.funcionando && device.funcionando.trim().length > 0)
}

export function isTipo(device, target) {
  // Compara o tipo sem diferenciar maiúsculas/minúsculas nem espaços extras,
  // já que o campo agora é texto livre (com datalist) e não um select fixo.
  return (device.tipo || '').trim().toLowerCase() === target.trim().toLowerCase()
}

export async function createDevice({ tipo, modelo, numeracao, sala, funcionando }) {
  return addDoc(devicesRef, {
    tipo: tipo.trim(),
    modelo: modelo.trim(),
    numeracao: numeracao.trim(),
    sala: sala.trim(),
    funcionando: (funcionando || '').trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateDevice(id, { tipo, modelo, numeracao, sala, funcionando }) {
  return updateDoc(doc(db, 'devices', id), {
    tipo: tipo.trim(),
    modelo: modelo.trim(),
    numeracao: numeracao.trim(),
    sala: sala.trim(),
    funcionando: (funcionando || '').trim(),
    updatedAt: serverTimestamp(),
  })
}

export async function createDevicesBatch(devices) {
  // devices: array de { tipo, modelo, numeracao, sala, funcionando }
  const batch = writeBatch(db)
  devices.forEach((device) => {
    const ref = doc(devicesRef)
    batch.set(ref, {
      tipo: device.tipo.trim(),
      modelo: device.modelo.trim(),
      numeracao: device.numeracao.trim(),
      sala: device.sala.trim(),
      funcionando: (device.funcionando || '').trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
  return batch.commit()
}

export async function deleteDevice(id) {
  return deleteDoc(doc(db, 'devices', id))
}
