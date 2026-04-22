const EVOLUTION_URL = process.env.EVOLUTION_API_URL!
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY!
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE!

export async function enviarMensagem(telefone: string, mensagem: string) {
  const numero = telefone.replace(/\D/g, '')
  const numeroFormatado = numero.startsWith('55') ? numero : `55${numero}`

  const response = await fetch(
    `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_KEY,
      },
      body: JSON.stringify({
        number: numeroFormatado,
        text: mensagem,
      }),
    }
  )

  if (!response.ok) {
    const erro = await response.text()
    throw new Error(`Evolution API erro: ${erro}`)
  }

  return response.json()
}
