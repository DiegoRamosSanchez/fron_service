export interface Messages {
    id?: number;
    conversationId: number; // ID de la conversación a la que pertenece
    query: string; // Consulta del mensaje
    response: string; // Respuesta del sistema
    sentAt?: string; // Fecha y hora de envío
    active?: string; // Estado del mensaje
}
  