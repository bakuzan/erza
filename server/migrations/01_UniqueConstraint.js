module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('animes', {
      type: 'unique',
      name: 'animes_id_unqiue',
      fields: ['id']
    });

    await queryInterface.addConstraint('mangas', {
      type: 'unique',
      name: 'mangas_id_unqiue',
      fields: ['id']
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('animes', 'animes_id_unqiue');
    await queryInterface.removeConstraint('mangas', 'mangas_id_unqiue');
  }
};
