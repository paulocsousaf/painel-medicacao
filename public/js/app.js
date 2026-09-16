/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * evento -> ação -> estado -> render -> tela.
 * ============================================================
 */
import {listMedications, createMedication, getMedication, removeMedication} from "./api.js";
import { subscribe, getState, setMedications, setError, addMedication, selectMedication, clearSelection, setDetailMedication, removeMedicationFromState} from "./state.js";
import { renderCounter, renderLoading, renderError, renderMedicationList, renderDetail} from "./render.js";

const medicationListElement = document.querySelector("#medication-list");
const resultCounterElement = document.querySelector("#result-counter");
const detailPanelElement = document.querySelector("#detail-panel");

const patientNameInput = document.querySelector("#patient-name-input");
const medicationNameInput = document.querySelector("#medication-name-input");
const dosageInput = document.querySelector("#dosage-input");
const routeInput = document.querySelector("#route-input");
const scheduledAtInput = document.querySelector("#scheduled-at-input");
const notesInput = document.querySelector("#notes-input");
const saveButton = document.querySelector("#save-button");
const formFeedbackElement = document.querySelector("#form-feedback");

/** A única função que desenha a tela inteira. */
function renderApp(state) {
  if (state.errorMessage) {
    renderError(state.errorMessage, medicationListElement);
    resultCounterElement.textContent = "";
    return;
  }
  if (state.isLoading) {
    renderLoading(medicationListElement);
    resultCounterElement.textContent = "";
    return;
  }

  // PASSO 4: chame renderDeta il(state, detailPanelElement) aqui
  renderDetail(state, detailPanelElement)
  renderMedicationList(state.medications, medicationListElement)
  renderCounter(state.medications.length, resultCounterElement);
}

subscribe(renderApp);

saveButton.addEventListener("click", async () =>{
  // disabilita o botão temporariamente
  saveButton.disabled = true
  // objeto a ser enviado
  const medication = {
    patientName: patientNameInput.value,
    medicationName: medicationNameInput.value,
    dosage: dosageInput.value,
    route: routeInput.value,
    scheduledAt: scheduledAtInput.value,
    notes: notesInput.value
  }

  try{
    const created = await createMedication(medication)
    addMedication(created) // atualiza o estado da aplicação em state:
    setFeedback(`Prescrição cadastrada: #${created.id}`, "success")
    // limpa campos do formulário
    patientNameInput.value = "";  
    medicationNameInput.value = "";
    dosageInput.value = "";
    scheduledAtInput.value = ""
    notesInput.value = ""

  }catch(erro){
    setFeedback(`Erro: ${erro.message}`, "error")
  }
  // habilita o botão novamente
  saveButton.disabled = false
})

function setFeedback(mensage, label){
  formFeedbackElement.textContent = mensage
  formFeedbackElement.className = `med-form__feedback--${label}`
}

medicationListElement.addEventListener("click", async (event)=>{
  try{
    const cardId = event.target.closest('.medication-card').dataset.medicationId
    await openDetail(Number(cardId))
  }catch{}
})

async function openDetail(id){
 selectMedication()
  try{
    const response = await getMedication(id)
    setDetailMedication(response)
   
  }catch(error){
    setError(error.message)
    console.error(error.message)
  }

}

detailPanelElement.addEventListener("click", (event)=>{
  if(event.target.closest("#close-detail-button")){
    clearSelection()
  }
})

detailPanelElement.addEventListener("click", async (event) =>{
  if(event.target.id === 'remove-button'){
    // confirmar suspensão
    if(confirm("Tem certeza que deseja suspender esta medicação?"))
      await removeMedication(detailPanelElement.dataset.medicationId)
      removeMedicationFromState(detailPanelElement.dataset.medicationId)
  }
})

async function start() {
  renderApp(getState())
  try{
    const medications = await listMedications()
    setMedications(medications)
  }catch(error){
    setError(error.message)
  }
}
start()