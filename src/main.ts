import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './config';

async function bootstrap() {
  const port = new ConfigService().get('PORT');
  const app = await NestFactory.create(AppModule);

  configApp(app);
  await app.listen(port || 3000, () => console.log(`Server running on PORT: ${port || 3000}`));
}
bootstrap();
