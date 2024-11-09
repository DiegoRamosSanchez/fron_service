export interface Conversation {
  id: number;
  userId: number; // ID del usuario que creó la conversación
  startTime?: string; // Fecha y hora de inicio
  endTime?: string; // Fecha y hora de fin
  active?: string; // Estado de la conversación
}
