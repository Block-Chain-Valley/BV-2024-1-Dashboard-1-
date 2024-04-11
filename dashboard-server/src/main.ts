/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { AppModule } from './app.module';
import { NestConfig } from './common/config/config.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors({ origin: '*' });

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  await app.listen(process.env.PORT || nestConfig?.port || 8000);
}

bootstrap();
