/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('session', {
        sid: { type: 'varchar', notNull: true },
        sess: { type: 'json', notNull: true },
        expire: { type: 'timestamp(6)', notNull: true },
    });

    pgm.addConstraint('session', 'session_pkey', {
        primaryKey: 'sid',
    });

    pgm.createIndex('session', 'expire', {
        name: 'IDX_session_expire'
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('session');
};
