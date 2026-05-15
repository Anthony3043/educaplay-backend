const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res) => {
  try {
    const cronogramas = await prisma.cronograma.findMany({
      include: { aulas: { include: { professor: true }, orderBy: { timeStart: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(cronogramas.map(c => ({
      ...c,
      aulas: c.aulas.map(a => ({
        ...a,
        professor: a.professor ? {
          ...a.professor,
          // materias pode ser JSON ou string simples — parseia com segurança
          materias: (() => { try { return JSON.parse(a.professor.materias); } catch { return a.professor.materias; } })(),
        } : null,
      })),
    })));
  } catch (err) {
    console.error('Erro em listar cronogramas:', err);
    return res.status(500).json({ error: 'Erro ao buscar cronogramas.' });
  }
};

const buscarPorTurno = async (req, res) => {
  try {
    const { turno } = req.params;
    const cronograma = await prisma.cronograma.findFirst({
      where: { turno },
      include: { aulas: { include: { professor: true }, orderBy: { timeStart: 'asc' } } },
    });
    if (!cronograma) return res.status(404).json({ error: 'Cronograma não encontrado.' });
    return res.json({
      ...cronograma,
      aulas: cronograma.aulas.map(a => ({
        ...a,
        professor: a.professor ? {
          ...a.professor,
          materias: (() => { try { return JSON.parse(a.professor.materias); } catch { return a.professor.materias; } })(),
        } : null,
      })),
    });
  } catch (err) {
    console.error('Erro em buscarPorTurno:', err);
    return res.status(500).json({ error: 'Erro ao buscar cronograma.' });
  }
};

const criar = async (req, res) => {
  try {
    const { turno } = req.body;
    if (!turno) return res.status(400).json({ error: 'Turno é obrigatório.' });
    const cronograma = await prisma.cronograma.create({ data: { turno } });
    return res.status(201).json(cronograma);
  } catch (err) {
    console.error('Erro em criar cronograma:', err);
    return res.status(500).json({ error: 'Erro ao criar cronograma.' });
  }
};

const atualizarAula = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, timeStart, timeEnd, isInterval, professorId } = req.body;
    const existe = await prisma.aula.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ error: 'Aula não encontrada.' });
    const aula = await prisma.aula.update({
      where: { id },
      // professorId: null desvincula o professor, undefined mantém o atual
      data: {
        ...(subject !== undefined && { subject }),
        ...(timeStart !== undefined && { timeStart }),
        ...(timeEnd !== undefined && { timeEnd }),
        ...(isInterval !== undefined && { isInterval }),
        ...(professorId !== undefined && { professorId: professorId || null }),
      },
      include: { professor: true },
    });
    return res.json({
      ...aula,
      professor: aula.professor ? {
        ...aula.professor,
        materias: (() => { try { return JSON.parse(aula.professor.materias); } catch { return aula.professor.materias; } })(),
      } : null,
    });
  } catch (err) {
    console.error('Erro em atualizarAula:', err);
    return res.status(500).json({ error: 'Erro ao atualizar aula.' });
  }
};

const deletar = async (req, res) => {
  try {
    const existe = await prisma.cronograma.findUnique({ where: { id: req.params.id } });
    if (!existe) return res.status(404).json({ error: 'Cronograma não encontrado.' });
    await prisma.cronograma.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (err) {
    console.error('Erro em deletar cronograma:', err);
    return res.status(500).json({ error: 'Erro ao deletar cronograma.' });
  }
};

module.exports = { listar, buscarPorTurno, criar, atualizarAula, deletar };
