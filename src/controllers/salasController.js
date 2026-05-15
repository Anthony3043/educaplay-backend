const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res) => {
  try {
    const salas = await prisma.sala.findMany({ orderBy: { nome: 'asc' } });
    return res.json(salas);
  } catch (err) {
    console.error('Erro em listar salas:', err);
    return res.status(500).json({ error: 'Erro ao buscar salas.' });
  }
};

const criar = async (req, res) => {
  try {
    const { nome, capacidade } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome da sala é obrigatório.' });
    const sala = await prisma.sala.create({ data: { nome, capacidade } });
    return res.status(201).json(sala);
  } catch (err) {
    console.error('Erro em criar sala:', err);
    return res.status(500).json({ error: 'Erro ao criar sala.' });
  }
};

const atualizar = async (req, res) => {
  try {
    const { nome, capacidade } = req.body;
    const existe = await prisma.sala.findUnique({ where: { id: req.params.id } });
    if (!existe) return res.status(404).json({ error: 'Sala não encontrada.' });
    const sala = await prisma.sala.update({ where: { id: req.params.id }, data: { nome, capacidade } });
    return res.json(sala);
  } catch (err) {
    console.error('Erro em atualizar sala:', err);
    return res.status(500).json({ error: 'Erro ao atualizar sala.' });
  }
};

const deletar = async (req, res) => {
  try {
    const existe = await prisma.sala.findUnique({ where: { id: req.params.id } });
    if (!existe) return res.status(404).json({ error: 'Sala não encontrada.' });
    await prisma.sala.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (err) {
    console.error('Erro em deletar sala:', err);
    return res.status(500).json({ error: 'Erro ao deletar sala.' });
  }
};

module.exports = { listar, criar, atualizar, deletar };
