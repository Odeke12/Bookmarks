import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';
import { User } from '.prisma/client';
import { 
    Body,
    Controller, 
    Get, 
    Patch, 
    Req, 
    UseGuards } from '@nestjs/common';
    
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController 
{
    constructor(private userService: UserService){}
    @Get('me')
    getMe(@GetUser() user: User){ //Request object is error prone
        console.log({
            user: user
        })
        return user 
    }

    @Patch('')
    editUser(@GetUser('id') userId: number,
    @Body() dto: EditUserDto,){
        return this.userService.editUser(userId, dto);
    }
} 

