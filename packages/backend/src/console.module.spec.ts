import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConsoleModule } from './console.module';

describe('Console Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConsoleModule],
    })
      .overrideProvider(PrismaMainClient)
      .useValue({ $connect: jest.fn() })
      .overrideProvider(PrismaStoreClient)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`should run`, () => {
    expect(true).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
