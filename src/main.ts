import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('APP_PORT');
  const swagger = new DocumentBuilder()
    .setTitle('4level')
    .setDescription('Swapi API info parser (CRUD)')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {
    Logger.log(`Server is running on ${port} port`);
  });
}
bootstrap();
