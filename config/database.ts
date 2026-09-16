import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'pg',

  connections: {
    /**
     * PostgreSQL connection.
     */
    pg: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),

        /**
         * Ligado por `DATABASE_SSL`, e não por `NODE_ENV`: quem decide é onde o
         * banco está, não em que ambiente a aplicação roda. Banco na mesma rede
         * privada da aplicação costuma não falar TLS - e exigir TLS ali derruba
         * a conexão no boot.
         */
        ssl: (function () {
          if (env.get('DATABASE_SSL')) return { rejectUnauthorized: true }

          return false
        })(),
      },
      migrations: {
        /**
         * Ordena os arquivos de migration pelo nome. O timestamp no início do
         * nome é o que decide a ordem, e sem isto a ordenação lexicográfica
         * embaralha arquivos de dígitos diferentes.
         */
        naturalSort: true,
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        /**
         * `database/schema.ts` é regerado a cada `migration:run` a partir da
         * conexão viva, e é dele que os models Lucid herdam as colunas.
         *
         * Estava comentado dentro do bloco `sqlite` desativado, e não na
         * conexão viva: o arquivo que todo model estende parou de regerar, e
         * `database/schema_rules.ts` deixou de ter efeito - inclusive para
         * declarar `serializeAs: null`.
         */
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },

      debug: app.inDev,
    },
  },
})

export default dbConfig
