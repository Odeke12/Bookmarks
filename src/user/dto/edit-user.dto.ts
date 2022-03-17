import { IsEmail, IsOptional, isString, IsString } from "class-validator"

export class EditUserDto{
    @IsEmail()
    email?: string

    @IsString()
    firstName?: string

    @IsOptional()
    @IsString() 
    lastName?:string
}