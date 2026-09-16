function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDateTime(isoDateTime) {
  const [datePart, timePart] = isoDateTime.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year} às ${timePart}`;
}

function medicationCardTemplate(med) {
  return `
    <li class="medication-card" data-medication-id="${med.id}" role="button" tabindex="0">
      <h2 class="medication-card__name">${escapeHtml(med.medicationName)} — ${escapeHtml(med.dosage)}</h2>
      <p class="medication-card__meta">${escapeHtml(med.patientName)}</p>
      <p class="medication-card__meta">${escapeHtml(med.route)} · ${formatDateTime(med.scheduledAt)}</p>
    </li>
  `;
}

function emptyStateTemplate() {
  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nada por aqui</p>
        <p class="m-0">Nenhuma prescrição cadastrada ainda.</p>
      </div>
    </li>
  `;
}

export function renderMedicationList(medication, container){
  if(medication.length === 0){
    return container.innerHTML = emptyStateTemplate()
  }
  return container.innerHTML = medication.map(medicationCardTemplate).join('')
}


export function renderCounter(count, container) {
  container.textContent = `${count} prescrição(ões) no painel`;
}

export function renderLoading(container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Carregando…</p></div></li>`;
}

export function renderError(message, container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(message)}</p></div></li>`;
}

export function renderDetail(state, container){
  
  if(!state.isSelected){
    container.hidden = true
    container.innerHTML = ""
    return 
  }

  const medication = state.selectedMedicationData

  container.hidden = false
  const body = state.isLoadingDetail ? `<div class="empty-state"><p class="m-0">Carregando Prontuário</p></div>`
                : `<h2 class="detail-panel__title">${escapeHtml(medication.patientName)}</h2>
    
                    <table class="table table-bordered mt-3"">
                      <tr>
                        <th>Medicamento</th>
                        <th>Dose</th>
                        <th>Via</th>
                        <th>Data</th>
                        
                      </tr>

                      <tr>
                        <td>${escapeHtml(medication.medicationName)}</td>
                        <td>${escapeHtml(medication.dosage)}</td>
                        <td>${escapeHtml(medication.route)}</td>
                        <td>${formatDateTime(medication.scheduledAt)}</td>
                      </tr>
                    </table>
                    <p class="detail-notes">${escapeHtml(medication.notes ?? "Sem observação")}</p>
                    
                  `
  if(state.isLoadingDetail === false){
    container.dataset.medicationId = medication.id
  }
  container.innerHTML = `
      <div class="detail-panel__header">
   
       ${body}
     <button id="remove-button" class="btn btn-outline-danger btn-sm" type="button">
        Suspender
      </button>

      <button id="close-detail-button" class="btn btn-outline-secondary btn-sm" type="button">
        Fechar
      </button>
    </div>`

}