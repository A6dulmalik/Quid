import { IsString, Matches } from 'class-validator';

export class AttachMissionDto {
  @IsString()
  @Matches(/^(0|[1-9]\d{0,19})$/)
  onChainId: string = '';
}
