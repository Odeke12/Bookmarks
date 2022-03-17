import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post } from "@nestjs/common";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
    
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() dto:AuthDto){

        return this.authService.signup(dto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto:AuthDto){
       return this.authService.signin(dto)
    }
}