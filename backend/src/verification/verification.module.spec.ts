import { Test } from '@nestjs/testing';
import { VerificationModule } from './verification.module';

describe('VerificationModule', () => {
  it('compiles on its own', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [VerificationModule],
    }).compile();

    expect(moduleRef.get(VerificationModule)).toBeInstanceOf(
      VerificationModule,
    );
  });
});
