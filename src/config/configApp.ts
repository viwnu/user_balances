import { INestApplication } from '@nestjs/common';
import { pipesSetup, preffixSetup, swaggerSetup } from '.';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  preffixSetup(app);
  swaggerSetup(app);
};
