import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { IM } from '../utils/IM'

IM.defaultIM().login('1')
platformBrowserDynamic().bootstrapModule(AppModule);