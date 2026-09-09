import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const usageRef = collection(db, 'usageLogs')

export async function createUsageLog({ data, hora, professor, disciplina, quantidade, tipo, modelo, observacao }) {
  return addDoc(usageRef, {
    data,
    hora,
    professor: professor.trim(),
    disciplina: disciplina.trim(),
    quantidade: Number(quantidade) || 0,
    tipo: tipo.trim(),
    modelo: modelo.trim(),
    observacao: (observacao || '').trim(),
    devolvido: false,
    devolvidoEm: null,
    createdAt: serverTimestamp(),
  })
}

export async function markUsageReturned(id) {
  return updateDoc(doc(db, 'usageLogs', id), {
    devolvido: true,
    devolvidoEm: serverTimestamp(),
  })
}

export async function deleteUsageLog(id) {
  return deleteDoc(doc(db, 'usageLogs', id))
}
