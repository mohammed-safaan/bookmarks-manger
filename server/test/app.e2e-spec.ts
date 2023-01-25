import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    jest.setTimeout(10000);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    it('should signup', () => {
      const dto: AuthDto = {
        email: 'test@email.com',
        password: 'test123',
      };
      return pactum
        .spec()
        .post('http://localhost:3333/auth/signup')
        .expectStatus(201)
        .withBody(dto)
        .inspect();
    });
    // it.todo('signin');
  });
  describe('User', () => {
    // it.todo('Getme');
    // it.todo('Edit user');
    // it.todo('Delete user');
  });
  describe('Bookmark', () => {
    // it.todo('Get bookmark by id');
    // it.todo('Get bookmarks');
    // it.todo('Create bookmark');
    // it.todo('Edit bookmark');
    // it.todo('Delete bookmark');
  });
});
