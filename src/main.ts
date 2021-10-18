require('dotenv').config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { config } from './config';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';
const logger: Logger = new Logger('Main');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');

async function bootstrap(): Promise<void> {
    const appOptions = { cors: true };
    const app = await NestFactory.create(AppModule, appOptions);
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (): BadRequestException => new BadRequestException('Validation error'),
        }),
    );
    setupSwagger(app);

    await app.listen(port);
    logger.log(`Application listening on port ${port}`);
}

bootstrap();
