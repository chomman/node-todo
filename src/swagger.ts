import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from './config';

export function setupSwagger(app: INestApplication): any {
    const logger: Logger = new Logger('Swagger');
    const swaggerEndpoint = config.get('app.swagger.path');

    const options = new DocumentBuilder()
        .setTitle(config.get('app.swagger.title'))
        .setDescription(config.get('app.swagger.description'))
        .setVersion(config.get('app.swagger.version'))
        // .addBearerAuth() /* 테스트 시 API 문서 접근을 위해 주석처리함  */
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
    logger.log(`Added swagger on endpoint ${swaggerEndpoint}`);
}
