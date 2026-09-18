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
    pgm.createTable('sections', {
        id: 'id',
        specification_id: {
            type: 'integer',
            notNull: true,
            references: 'specifications',
            onDelete: 'CASCADE',
        },
        slug: { type: 'varchar(100)', notNull: true },
        content: { type: 'text', notNull: true },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.addConstraint('sections', 'sections_specification_id_slug_key', {
        unique: ['specification_id', 'slug'],
    });

    pgm.createFunction(
        'set_updated_at',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `
        BEGIN
            NEW.updated_at = current_timestamp;
            RETURN NEW;
        END;
        `,
    );

    pgm.createTrigger('sections', 'set_sections_updated_at', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'set_updated_at',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('sections');
    pgm.dropFunction('set_updated_at', []);
};
