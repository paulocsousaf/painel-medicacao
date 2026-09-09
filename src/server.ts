/**
 * ============================================================
 * Painel de Medicacao - Servidor HTTP
 * ============================================================
 * Isto e um "Hello World": so a rota de saude e o servidor
 * estatico. As quatro rotas da atividade (listar, criar, obter
 * um, remover) ainda nao existem — sao o que voce vai construir.
 */
import express from "express";
import { db } from "./database";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

type medicationRow = {
  id: number,
  patient_name: string
  medication_name: string,
  dosage: string,
  route: string,
  scheduled_at: string,
  notes: string
}

function toMedicationJson(row: medicationRow){
  return {
   id: row.id,
   patientName: row.patient_name,
   medicationName: row.medication_name,
   dosage: row.dosage,
   route: row.route,
   scheduledAt: row.scheduled_at,
   notes: row.notes
  }
}

// ============================================================
// PASSO 1 — GET /api/medications
//   db.prepare("SELECT ... FROM medication_orders").all()
//   Nao esqueca de traduzir snake_case -> camelCase antes de responder.
// ============================================================
app.get('/api/medications', (req, res) => {
  const rows = db.prepare('SELECT * FROM medication_orders').all() as medicationRow[]
  res.send(rows.map(toMedicationJson))
})
// ============================================================
// PASSO 3 — POST /api/medications
//   valide patientName, medicationName, dosage, route, scheduledAt
//   INSERT parametrizado -> responda 201 com o registro criado
// ============================================================
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isBlank(value: string): boolean{
  return value.trim() === ""
}

function validateInput(body: any){

  if(isBlank(body?.patientName)){
    return "O campo 'Paciente' não pode ser vazio"
  }
  if(isBlank(body?.medicationName)){
    return "O campo 'Medicamento' não pode ser vazio"
  }
  if(isBlank(body?.dosage)){
    return "O campo 'Dosagem' não pode ser vazio"
  }
  if(isBlank(body?.route)){
    return "O campo 'Via' não pode ser vazio"
  }
  if(isBlank(body?.scheduledAt) || !ISO_DATE_TIME.test(body?.scheduledAt)){
    return "O horário deve seguir o formato: AAAA-MM-DDTHH:MM"
  }
  return null
}
app.post('/api/medications/', (req, res) =>{
  const medication = req.body
  const problem = validateInput(medication)
  if(problem){
    res.status(400).json({error: problem});
    return;
  }
  // desestruturar objeto vindo do body da requisição
  const {patientName, medicationName, dosage, route, scheduledAt, notes} = medication
  
  // adicionar ao banco
  const result = db.prepare(`INSERT INTO medication_orders (patient_name, medication_name, dosage, route, scheduled_at, notes) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(patientName.trim(), medicationName.trim(), dosage.trim(), route.trim(), scheduledAt, isBlank(notes ?? "")? null: notes.trim())
  
  // resgatar registro criado
  const created = db.prepare(`SELECT * FROM medication_orders WHERE id = ?`).get(result.lastInsertRowid)

  // devolver a resposta com o medicamento criado
  res.status(201).json(toMedicationJson(created as medicationRow))
})
// ============================================================
// PASSO 4 — GET /api/medications/:id
//   db.prepare("SELECT ... WHERE id = ?").get(id)
//   undefined -> 404
// ============================================================
app.get('/api/medications/:id', (req, res) =>{

try{
  const id = req.params.id
  const medicationOrder = db.prepare(`SELECT * FROM medication_orders WHERE id = ?`).get(id)

  if(!medicationOrder){
    return res.status(404).json({error: "Receita não encotrada"})
  }
  return res.status(200).json(toMedicationJson(medicationOrder as medicationRow))
  
}catch(error){
  console.error(error)
  return res.status(500).json({error: "Error interno do Servidor"})
}
})
// ============================================================
// PASSO 5 — DELETE /api/medications/:id
//   db.prepare("DELETE FROM medication_orders WHERE id = ?").run(id)
//   responda 204, sem corpo
// ============================================================

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});
