/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Único arquivo autorizado a chamar `fetch`.
 * ============================================================
 */

const MEDICATIONS_URL = "/api/medications";

export async function listMedications(){
  const response = await fetch(MEDICATIONS_URL)

  if(!response.ok){
    throw new Error("Error ao buscar medicamentos")
  }
  return response.json()
}

export async function createMedication(medication){

    const response = await fetch("/api/medications", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medication)
    })
    
    if(!response.ok){
      const problem = await response.json()
      throw new Error(problem.error)
    }
    return await response.json()
  }

export async function getMedication(id){
  
    const response = await fetch(`/api/medications/${id}`)
    
    if(!response.ok){
      const problem = await response.json().catch(() => null)
      throw new Error(problem?.error ?? `Erro ${response.status}: Falha ao buscar medicamento`)
    }
    return await response.json()

}

export async function removeMedication(id){
  const response = await fetch(`/api/medications/${id}`, {
    method: 'DELETE'
  })

  if(!response.ok){
    throw new Error(response.json())
  }

}
