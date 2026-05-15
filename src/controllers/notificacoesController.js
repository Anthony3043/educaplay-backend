const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const listar = async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { usuarioId: req.usuario.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(notificacoes);
  } catch (err) {
    console.error('Erro em listar notificacoes:', err);
    return res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
};

const marcarLida = async (req, res) => {
  try {
    const notif = await prisma.notificacao.findUnique({ where: { id: req.params.id } });
    if (!notif || notif.usuarioId !== req.usuario.id) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }
    const atualizada = await prisma.notificacao.update({ where: { id: req.params.id }, data: { lida: true } });
    return res.json(atualizada);
  } catch (err) {
    console.error('Erro em marcarLida:', err);
    return res.status(500).json({ error: 'Erro ao marcar notificação.' });
  }
};

const marcarTodasLidas = async (req, res) => {
  try {
    await prisma.notificacao.updateMany({ where: { usuarioId: req.usuario.id, lida: false }, data: { lida: true } });
    return res.json({ message: 'Todas as notificações foram marcadas como lidas.' });
  } catch (err) {
    console.error('Erro em marcarTodasLidas:', err);
    return res.status(500).json({ error: 'Erro ao marcar notificações.' });
  }
};

const deletar = async (req, res) => {
  try {
    const notif = await prisma.notificacao.findUnique({ where: { id: req.params.id } });
    if (!notif || notif.usuarioId !== req.usuario.id) {
      return res.status(404).json({ error: 'Notificação não encontrada.' });
    }
    await prisma.notificacao.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  } catch (err) {
    console.error('Erro em deletar notificacao:', err);
    return res.status(500).json({ error: 'Erro ao deletar notificação.' });
  }
};

const limparTodas = async (req, res) => {
  try {
    await prisma.notificacao.deleteMany({ where: { usuarioId: req.usuario.id } });
    return res.status(204).send();
  } catch (err) {
    console.error('Erro em limparTodas:', err);
    return res.status(500).json({ error: 'Erro ao limpar notificações.' });
  }
};

module.exports = { listar, marcarLida, marcarTodasLidas, deletar, limparTodas };
