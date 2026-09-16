/**
 * ============================================================
 * ESTADO
 * ------------------------------------------------------------
 * Guarda a resposta para "o que a tela precisa mostrar agora?".
 * Não conhece o DOM. Mesmo padrão do Mini-Prontuário.
 * ============================================================
 */

const state = {
  medications: [],
  isLoading: true,
  errorMessage: null,

  isSelected: false,
  selectedMedicationData: null,
  isLoadingDetail: false,
  detailErrorMessage: null,
};

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

export function getState() {
  return {
    ...state
  };
}

// ============================================================
// PASSO 2 — implemente setMedications(medications)
//   guarde a lista, encerre o loading, limpe o erro, notify()
// ============================================================
export function setMedications(medications){
  state.medications = medications;
  state.isLoading = false;
  notify()
}

/** Registra uma falha de carregamento da lista. */
export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}

// ============================================================
// PASSO 3 — implemente addMedication(medication)
//   acrescenta ao array de medications (imutável: [...state.medications, medication])
//   notify()
// ============================================================
export function addMedication(medication){
  state.medications.push(medication)
  notify()
}

// ============================================================
// PASSO 4 — implemente selectMedication(id) e clearSelection()
//   selectMedication: guarda o id, zera erro de detalhe, notify()
//   clearSelection: volta selectedId para null, notify()
// ============================================================
// abre o detalhe e limpa o anterior
export function selectMedication(){
  state.isSelected = true;
  state.selectedMedicationData = null
  state.isLoadingDetail = true
  state.detailErrorMessage = null
  notify()
}
export function setDetailMedication(medication){
  state.selectedMedicationData = medication;
  state.isLoadingDetail = false;
  state.detailErrorMessage = null;
  notify()
}

export function clearSelection(){
  state.isSelected = false;
  state.selectedMedicationData = null;
  state.isLoadingDetail = false;
  state.detailErrorMessage = null;
  notify()
}

/** Registra uma falha ao buscar o detalhe. */
export function setDetailError(message) {
  state.detailErrorMessage = message;
  state.isLoadingDetail = false;
  notify();
}

// ============================================================
// PASSO 5 — implemente removeMedicationFromState(id)
//   filtra o array tirando o id removido, limpa a seleção, notify()
// ============================================================

export function removeMedicationFromState(id){
  state.medications = state.medications.filter((med) => med.id != id)
  state.isSelected = false;
  state.selectedMedicationData = null;
  state.isLoadingDetail = false;
  state.detailErrorMessage = null;
  notify()
}