import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  jest.setTimeout(20000);
  beforeAll(async () => {
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
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth tests', () => {
    const dto: AuthDto = {
      email: 'test@email.com',
      password: 'test123',
    };

    // sign up tests =======================>
    it('should throw error if no email provided', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400).withBody({
        password: dto.password,
      });
    });
    it('should throw error if no password provided', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400).withBody({
        email: dto.email,
      });
    });
    it('should throw error if no body provided', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400);
    });
    it('should signUp', () => {
      return pactum.spec().post('/auth/signup').expectStatus(201).withBody(dto);
    });
    // sign in tests ==============>
    it('should throw error if no email provided', () => {
      return pactum.spec().post('/auth/signin').expectStatus(400).withBody({
        password: dto.password,
      });
    });
    it('should throw error if no password provided', () => {
      return pactum.spec().post('/auth/signin').expectStatus(400).withBody({
        email: dto.email,
      });
    });
    it('should throw error if body provided', () => {
      return pactum.spec().post('/auth/signin').expectStatus(400);
    });
    it('should signIn', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .expectStatus(200)
        .withBody(dto)
        .stores('userToken', 'access_token');
    });
  });
  // users tests ==========================>
  describe('Users tests', () => {
    const dto = {
      firstName: 'medo',
      lastName: 'ali',
    };
    it('should get current user', () => {
      return pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(200);
    });
    it('should edit user', () => {
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.lastName);
    });
    // it.todo('Delete user');
  });
  // bookmarks tests ==========================>
  describe('Bookmarks tests', () => {
    it('should get no bookmarks === []', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(200)
        .expectBody([]);
    });

    it('should Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'facebook',
        description: 'social',
        link: 'https://facebooc.com',
      };
      return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .withBody(dto)
        .stores('bookmarkId', 'id')
        .expectStatus(201);
    });

    it('should get bookmarks', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('should get bookmark by id', () => {
      return pactum
        .spec()
        .get('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(200)
        .expectBodyContains('$S{bookmarkId}');
    });

    it('should Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Meta',
        description: 'social media',
        link: 'https://www.facebook.com',
      };
      return pactum
        .spec()
        .patch('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.title)
        .expectBodyContains(dto.description)
        .expectBodyContains(dto.link)
        .inspect();
    });

    it('should Delete bookmark by id', () => {
      return pactum
        .spec()
        .delete('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(204)
        .inspect();
    });

    it('should get no bookmarks after deleting', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userToken}',
        })
        .expectStatus(200)
        .expectJsonLength(0);
    });
  });
});
