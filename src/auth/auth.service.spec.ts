import { AppModule } from './../app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getPrismaClient } from '@prisma/client/runtime';

describe('Auth service', () => {
    let app: INestApplication
    let service: AuthService
    let prisma: PrismaService
    let jwt: JwtService
    let config: ConfigService
    class AuthServiceMock{

    }
    jest.setTimeout(10000)
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true
          }));

          await app.init()
          prisma = app.get(PrismaService)
          jwt = app.get(JwtService)
          config = app.get(ConfigService)
        service = new AuthService(prisma, jwt, config)
      });
      it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('Check connection',() => {
        it('Should sign up a new user',async() => {
           const dto:AuthDto = {
               email: 'anguloodeke@gmail.com',
               password: 'angulo'
           }
           const token = await service.signup(dto)

          expect(token).toEqual({
            access_token: expect.any(String),
        })
        })
    })
})

