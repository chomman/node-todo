import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordChangeDTO {
    @ApiModelProperty({ description: 'Current password' })
    @IsString()
    @IsNotEmpty()
    readonly currentPassword: string;

    @ApiModelProperty({ description: 'New password' })
    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;
}
