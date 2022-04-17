import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PayPalPaymentResult } from './PayPalPaymentResult';

class PayPalPayerEntity {
  @Expose()
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email_address?: string;
}

export class PayPalPaymentResultEntity implements PayPalPaymentResult {
  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  update_time?: string;

  @Expose()
  @Type(() => PayPalPayerEntity)
  @IsOptional()
  @ValidateNested()
  payer?: PayPalPayerEntity;
}
