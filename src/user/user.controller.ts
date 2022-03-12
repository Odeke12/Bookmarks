import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getMetadataStorage } from 'class-validator';

@Controller('user')
export class UserController 
{
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(){
        return 'User info'
    }
}

