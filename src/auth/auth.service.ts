import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsEmail } from 'class-validator';
import { AuthDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from 'argon2'; 
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable({})
export class AuthService{
    constructor(private prisma:PrismaService, private jwt:JwtService, private config:ConfigService){}

   async signup(dto: AuthDto){
        //generate the password hash
        const hash = await argon.hash(dto.password)
        try{
        //save the new user to the db
        const user = await this.prisma.user.create({
            data:{
                email: dto.email,
                hash,
            },
        })
        //return the saved user
        delete user.hash;
        return this.signToken(user.id, user.email)
    }catch(error){
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                throw new ForbiddenException('Credentials taken');
            }
        }
        throw error;
    }
    } 


   async signin(dto: AuthDto){
        //find user by email
         const user = await this.prisma.user.findUnique({
             where: {
                email: dto.email
             }
         })

         if(!(user)){
             throw new ForbiddenException('Credentials incorrect');
         }
        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password
        )
        //If password is incorrect, throw exception
        if(!pwMatches)
        throw new ForbiddenException(
            'Credentials incorrect'
        )

        // delete user.hash
        return this.signToken(user.id, user.email)
    }

    async signToken(userId:number, email:string): Promise <{access_token :string}>{
    const payload = {
            sub: userId,
            email
        }
    const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET')
    },
    );

    return {
        access_token : token
    };
    }

}
