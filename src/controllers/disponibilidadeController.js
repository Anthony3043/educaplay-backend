const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res) => {
  try {
    const { professorId } = req.params;
    const disponibilidades = await prisma.disponibilidade.findMany({
      where: { professorId },
      orderBy: { diaSemana: 'asc' },
    });
    return res.json(disponibilidades);
  } catch (err) {
    console.error('Erro em listar disponibilidade:', err);
    return res.status(500).json({ error: 'Erro ao buscar disponibilidade.' });
  }
};

const salvar = async (req, res) => {
  try {
    const { professorId, slots } = req.body;
    if (!professorId || !slots?.length) {
      return res.status(400).json({ error: 'professorId e slots são obrigatórios.' });
    }

    await prisma.disponibilidade.deleteMany({ where: { professorId } });
    const criadas = await prisma.disponibilidade.createMany({
      data: slots.map(s => ({ professorId, diaSemana: s.diaSemana, turno: s.turno, usuarioId: req.usuario.id })),
    });

    return res.status(201).json({ count: criadas.count });
  } catch (err) {
    console.error('Erro em salvar disponibilidade:', err);
    return res.status(500).json({ error: 'Erro ao salvar disponibilidade.' });
  }
};

module.exports = { listar, salvar };
