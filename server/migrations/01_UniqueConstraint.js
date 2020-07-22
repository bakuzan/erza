module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint('animes', ['id'], {
      type: 'unique',
      name: 'animes_id_unqiue'
    });

    await queryInterface.addConstraint('mangas', ['id'], {
      type: 'unique',
      name: 'mangas_id_unqiue'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeConstraint('animes', 'animes_id_unqiue');
    await queryInterface.removeConstraint('mangas', 'mangas_id_unqiue');
  }
};
