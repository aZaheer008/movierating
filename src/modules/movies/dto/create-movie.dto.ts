import { IsNotEmpty , IsString , IsNumber } from "class-validator"

export class CreateMovieDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly release_date: Date;

    @IsNotEmpty()
    @IsNumber()
    readonly ticket_price : Number

    @IsNotEmpty()
    @IsString()
    readonly country: string

    @IsNotEmpty()
    @IsString()
    readonly genre: string
}
