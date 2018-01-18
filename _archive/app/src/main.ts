import 'zone.js/dist/zone.js';
import 'reflect-metadata/Reflect.js';

import 'twbs/bootstrap';
import 'twbs/bootstrap/css/bootstrap.min.css!';
import 'font-awesome/css/font-awesome.min.css!';

import { browserDynamicPlatform } from '@angular/platform-browser-dynamic';
import { AccountAppModule } from './app.module';

browserDynamicPlatform().bootstrapModule(AccountAppModule);