const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res) => {
  try {
    const professores = await prisma.usuario.findMany({
      where: { papel: 'Professor' },
      select: { id: true, nome: true, email: true, cargo: true, instituicao: true },
      orderBy: { nome: 'asc' },
    });
    return res.json(professores);
  } catch (err) {
    console.error('Erro em listar professores:', err);
    return res.status(500).json({ error: 'Erro ao buscar professores.' });
  }
};

module.exports = { listar };
