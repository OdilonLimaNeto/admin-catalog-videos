import Joi from 'joi';
import {
  CONFIG_DATABASE_SCHEMA,
  ConfigurationModule,
} from '../configuration.module';
import { Test } from '@nestjs/testing';
import { join } from 'node:path';

function expectValidate(schema: Joi.Schema, value: any) {
  return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit Tests', () => {
  describe('Database Schema', () => {
    const schema = Joi.object({ ...CONFIG_DATABASE_SCHEMA });
    describe('DB_VENDOR', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
        expectValidate(schema, { DB_VENDOR: 5 }).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      });
      test('valid cases', () => {
        const arrange = ['mysql', 'sqlite'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_VENDOR: value }).not.toContain(
            'DB_VENDOR',
          );
        });
      });
    });

    describe('DB_HOST', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_HOST" is required');
        expectValidate(schema, { DB_HOST: 5 }).toContain(
          '"DB_HOST" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = ['localhost', '127.0.0.1'];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_HOST: value }).not.toContain('DB_HOST');
        });
      });
    });

    describe('DB_DATABASE', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          'DB_DATABASE is required',
        );
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_DATABASE" is required',
        );
        expectValidate(schema, { DB_DATABASE: 5 }).toContain(
          '"DB_DATABASE" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_DATABASE: 'test.db' },
          { DB_VENDOR: 'mysql', DB_DATABASE: 'test_db' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_DATABASE');
        });
      });
    });

    describe('DB_USERNAME', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_USERNAME" is required',
        );
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_USERNAME" is required',
        );
        expectValidate(schema, { DB_USERNAME: 1 }).toContain(
          '"DB_USERNAME" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_USERNAME: 'test_user' },
          { DB_VENDOR: 'mysql', DB_USERNAME: 'test_user' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_USERNAME');
        });
      });
    });
    describe('DB_PASSWORD', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_PASSWORD" is required',
        );
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PASSWORD" is required',
        );
        expectValidate(schema, { DB_PASSWORD: 1 }).toContain(
          '"DB_PASSWORD" must be a string',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_PASSWORD: 'test_pass' },
          { DB_VENDOR: 'mysql', DB_PASSWORD: 'test_pass' },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PASSWORD');
        });
      });
    });
    describe('DB_PORT', () => {
      test('invalid cases', () => {
        expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
          '"DB_PORT" is required',
        );
        expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
          '"DB_PORT" is required',
        );
        expectValidate(schema, { DB_PORT: 'not_a_number' }).toContain(
          '"DB_PORT" must be a number',
        );
        expectValidate(schema, { DB_PORT: '1.2' }).toContain(
          '"DB_PORT" must be an integer',
        );
      });

      test('valid cases', () => {
        const arrange = [
          { DB_VENDOR: 'sqlite' },
          { DB_VENDOR: 'sqlite', DB_PORT: 5432 },
          { DB_VENDOR: 'mysql', DB_PORT: 3306 },
        ];

        arrange.forEach((value) => {
          expectValidate(schema, value).not.toContain('DB_PORT');
        });
      });
    });

    describe('DB_LOGGING', () => {
      test('invalid cases', () => {
        expectValidate(schema, {}).toContain('"DB_LOGGING" is required');
        expectValidate(schema, {
          DB_VENDOR: 'sqlite',
          DB_HOST: 'localhost',
          DB_LOGGING: 'not_a_boolean',
          DB_AUTO_LOAD_MODELS: true,
        }).toContain('"DB_LOGGING" must be a boolean');
      });

      test('valid cases', () => {
        const arrange = [true, false];
        arrange.forEach((value) => {
          expectValidate(schema, { DB_LOGGING: value }).not.toContain(
            'DB_LOGGING',
          );
        });
      });
    });
  });

  describe('ConfigurationModule Unit Tests', () => {
    test('should throw an error when env vars are invalid', async () => {
      try {
        await Test.createTestingModule({
          imports: [
            ConfigurationModule.forRoot({
              envFilePath: join(__dirname, '.environment.fake'),
            }),
          ],
        }).compile();
        fail(
          'ConfigurationModule should throw an error when env vars are invalid',
        );
      } catch (error) {
        expect(error.message).toContain(
          '"DB_VENDOR" must be one of [mysql, sqlite]',
        );
      }
    });

    test('should be valid', () => {
      const module = Test.createTestingModule({
        imports: [ConfigurationModule.forRoot()],
      });
      expect(module).toBeDefined();
    });
  });
});
