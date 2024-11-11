import { NestFactory } from '@nestjs/core';
import { AppModule } from './inventory.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.REDIS,
  //   options: {
  //     host: 'localhost',
  //     port: 6379,
  //   },
  // });
  // await app.listen();

  // Create the HTTP server and listen on port 3000
  const httpApp = await NestFactory.create(AppModule);
  
  httpApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  await httpApp.listen(process.env.PORT).then(()=> {
    console.log("")
    console.log(`#### INVENTORY HTTP SERVER LISTENING ON PORT - ${process.env.PORT} ####`)
  });  // HTTP server port
}
bootstrap();
