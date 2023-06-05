import { IsOptional , IsString , IsNumber } from "class-validator"

export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly release_date: Date;

    @IsOptional()
    @IsNumber()
    readonly ticket_price : Number;

    @IsOptional()
    @IsString()
    readonly country: string;

    @IsOptional()
    @IsString()
    readonly genre: string;
}
