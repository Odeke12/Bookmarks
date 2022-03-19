import { createBookmarkDto } from './../src/bookmark/dto/create-bookmark.dto';
import { PrismaService } from './../src/prisma/prisma.service';
import { Body } from '@nestjs/common';
import { AuthModule } from './../src/auth/auth.module';
import { AppModule } from './../src/app.module';
import {Test, TestingModule} from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest'
import { AuthDto } from 'src/auth/dto';
import { AxiosResponse } from 'axios';

describe('UserController (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let access_token: string
    beforeAll(async() => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true
          }));
          
        await app.init();
        // await app.listen(4000);
        prisma = app.get(PrismaService)
        

        await prisma.cleanDb()
    })
    afterAll(() => {
        app.close()
    })
    const dto:AuthDto = {
        email: 'trevodex@gmail.com',
        password: 'timothy'
      };
    describe('Sign up', () => {
    it('Should sign up a new user', () => {

        return request(app.getHttpServer())
        .post('/auth/signup')
        .expect(201)
        .send(dto)
    })
    it('Should not sign up an already existing user', () => {

        return request(app.getHttpServer())
        .post('/auth/signup')
        .expect(403, {
            statusCode: 403,
            message: 'Credentials taken',
            error: 'Forbidden'
        })
        .send(dto)
        })
    })

    describe('Sign in', () => {

        it('User should be able to sign in', () => {
        return request(app.getHttpServer())
        .post('/auth/signin')
        .expect(200)
        .send(dto)
        .then(res => {
            console.log(res)
            access_token = res.body.access_token
        })
        })
    })

    describe('Bookmarks', () => {
       const bookmark: createBookmarkDto = {
           title: 'My first bookmark',
           link: 'localhost:3000/bookmarks/2'
       }
        it('Logged in user should be able to create bookmark', () => {
        return request(app.getHttpServer())
        .post('/bookmarks')
        .set('Authorization',`Bearer ${access_token}`)
        .expect(201)
        .send(bookmark)  
        })
    })
})

